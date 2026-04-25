package service

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/hex"
	"encoding/pem"
	"errors"
	"fmt"
	"math/big"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"golang.org/x/crypto/argon2"

	"github.com/omnilingo/omnilingo/services/identity/internal/audit"
	"github.com/omnilingo/omnilingo/services/identity/internal/config"
	"github.com/omnilingo/omnilingo/services/identity/internal/domain"
	iam "github.com/omnilingo/omnilingo/services/identity/internal/metrics"
	"github.com/omnilingo/omnilingo/services/identity/internal/messaging"
	"github.com/omnilingo/omnilingo/services/identity/internal/ratelimit"
	"github.com/omnilingo/omnilingo/services/identity/internal/repository"
	"github.com/omnilingo/omnilingo/services/identity/internal/security"
)

// ─── Interfaces ───────────────────────────────────────────────────────────────

// AuthService handles all authentication and session logic.
type AuthService interface {
	Register(ctx context.Context, req RegisterRequest) (*domain.User, error)
	Login(ctx context.Context, req LoginRequest) (*domain.TokenPair, error)
	RefreshToken(ctx context.Context, rawRefreshToken string) (*domain.TokenPair, error)
	Logout(ctx context.Context, rawRefreshToken string) error
	GetMe(ctx context.Context, userID uuid.UUID) (*domain.User, error)
	UpdateMe(ctx context.Context, userID uuid.UUID, req domain.UpdateMeRequest) (*domain.User, error)
	DeleteMe(ctx context.Context, userID uuid.UUID, reason string) error
	// Email verification
	SendVerificationEmail(ctx context.Context, userID uuid.UUID) error
	VerifyEmail(ctx context.Context, rawToken string) error
	// Password reset
	ForgotPassword(ctx context.Context, email string) error
	ResetPassword(ctx context.Context, rawToken, newPassword string) error
	// Account management
	ChangePassword(ctx context.Context, userID uuid.UUID, oldPassword, newPassword string) error
	DeleteMeWithPassword(ctx context.Context, userID uuid.UUID, password, reason string) error
	// Session management
	ListSessions(ctx context.Context, userID uuid.UUID) ([]*domain.Session, error)
	RevokeSession(ctx context.Context, userID, sessionID uuid.UUID) error
	// JWKS
	GetPublicKey() *rsa.PublicKey
	GetKeyID() string
}

// ─── Request types ────────────────────────────────────────────────────────────

type RegisterRequest struct {
	Email       string
	Password    string
	DisplayName string
	UILanguage  string
	IP          string
	DeviceInfo  string
	RequestID   string
}

type LoginRequest struct {
	Email      string
	Password   string
	DeviceID   string
	DeviceInfo string
	IP         string
	RequestID  string
}

// ─── Implementation ───────────────────────────────────────────────────────────

type authService struct {
	cfg         *config.Config
	log         *zap.Logger
	userRepo    repository.UserRepository
	sessionRepo repository.SessionRepository
	limiter     *ratelimit.Limiter
	hibp        *security.HIBPChecker
	publisher   *messaging.Publisher
	auditLog    *audit.Service
	outbox      *messaging.OutboxRepository

	// RS256 key pair
	privateKey *rsa.PrivateKey
	publicKey  *rsa.PublicKey
	keyID      string
}

// NewAuthService creates a fully wired AuthService.
func NewAuthService(
	cfg *config.Config,
	log *zap.Logger,
	userRepo repository.UserRepository,
	sessionRepo repository.SessionRepository,
	limiter *ratelimit.Limiter,
	publisher *messaging.Publisher,
	auditSvc *audit.Service,
	outboxRepo *messaging.OutboxRepository,
) (AuthService, error) {
	privateKey, err := loadOrGenerateRSAKey(cfg.JWTPrivateKeyPath, log)
	if err != nil {
		return nil, fmt.Errorf("load RSA key: %w", err)
	}

	hibp := security.NewHIBPChecker(cfg.HIBPTimeout)

	return &authService{
		cfg:         cfg,
		log:         log,
		userRepo:    userRepo,
		sessionRepo: sessionRepo,
		limiter:     limiter,
		hibp:        hibp,
		publisher:   publisher,
		auditLog:    auditSvc,
		outbox:      outboxRepo,
		privateKey:  privateKey,
		publicKey:   &privateKey.PublicKey,
		keyID:       cfg.JWTKeyID,
	}, nil
}

// ─── Register ─────────────────────────────────────────────────────────────────

func (s *authService) Register(ctx context.Context, req RegisterRequest) (*domain.User, error) {
	// Rate limit: registrations per IP
	rl, err := s.limiter.Allow(ctx,
		ratelimit.RegisterByIPKey(req.IP),
		s.cfg.RateRegisterMaxPerIP,
		s.cfg.RateRegisterWindowPerIP,
	)
	if err == nil && !rl.Allowed {
		iam.RateLimitHits.WithLabelValues("register").Inc()
		iam.AuthRegisterTotal.WithLabelValues("rate_limited").Inc()
		return nil, domain.ErrRateLimited
	}

	// HIBP password check (non-blocking on API failure)
	if s.cfg.HIBPEnabled {
		count, hibpErr := s.hibp.IsPwned(req.Password)
		if hibpErr != nil {
			s.log.Warn("HIBP check failed (proceeding)", zap.Error(hibpErr))
			iam.HIBPChecks.WithLabelValues("api_error").Inc()
		} else if count > 0 {
			iam.HIBPChecks.WithLabelValues("compromised").Inc()
			iam.AuthRegisterTotal.WithLabelValues("failure").Inc()
			return nil, domain.ErrPasswordCompromised
		} else {
			iam.HIBPChecks.WithLabelValues("clean").Inc()
		}
	}

	hash, err := s.hashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}

	lang := req.UILanguage
	if lang == "" {
		lang = "en"
	}

	user := &domain.User{
		ID:            uuid.New(),
		Email:         req.Email,
		PasswordHash:  hash,
		DisplayName:   req.DisplayName,
		UILanguage:    lang,
		Timezone:      "UTC",
		Status:        domain.UserStatusActive,
		EmailVerified: false,
		Roles:         []domain.Role{domain.RoleUser},
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		if errors.Is(err, domain.ErrEmailTaken) {
			iam.AuthRegisterTotal.WithLabelValues("duplicate").Inc()
		} else {
			iam.AuthRegisterTotal.WithLabelValues("failure").Inc()
		}
		return nil, err
	}

	iam.AuthRegisterTotal.WithLabelValues("success").Inc()
	s.log.Info("user registered",
		zap.String("user_id", user.ID.String()),
		zap.String("request_id", req.RequestID))

	// Audit log
	s.auditLog.Record(ctx, domain.NewAuditEvent(
		user.ID.String(), domain.AuditRegister, req.IP, req.DeviceInfo, req.RequestID,
		"SUCCESS", "email="+user.Email,
	))

	// Outbox: durable Kafka event (relay picks up within 5s)
	roleStrings := make([]string, len(user.Roles))
	for i, r := range user.Roles {
		roleStrings[i] = string(r)
	}
	if err := s.outbox.Enqueue(ctx, domain.TopicUserRegistered, domain.UserRegisteredEvent{
		EventID:     uuid.New().String(),
		UserID:      user.ID.String(),
		Email:       user.Email,
		DisplayName: user.DisplayName,
		UILanguage:  user.UILanguage,
		Roles:       roleStrings,
		CreatedAt:   user.CreatedAt,
	}); err != nil {
		s.log.Error("outbox insert user.registered failed", zap.Error(err))
	}

	return user, nil
}

// ─── Login ────────────────────────────────────────────────────────────────────

func (s *authService) Login(ctx context.Context, req LoginRequest) (*domain.TokenPair, error) {
	start := time.Now()
	defer func() {
		iam.LoginLatency.Observe(time.Since(start).Seconds())
	}()

	// Rate limit: by IP
	if rl, _ := s.limiter.Allow(ctx, ratelimit.LoginByIPKey(req.IP),
		s.cfg.RateLoginMaxPerIP, s.cfg.RateLoginWindowPerIP); !rl.Allowed {
		iam.RateLimitHits.WithLabelValues("login_ip").Inc()
		iam.AuthLoginTotal.WithLabelValues("rate_limited").Inc()
		return nil, domain.ErrRateLimited
	}

	// Rate limit: by email
	if rl, _ := s.limiter.Allow(ctx, ratelimit.LoginByEmailKey(req.Email),
		s.cfg.RateLoginMaxPerEmail, s.cfg.RateLoginWindowPerEmail); !rl.Allowed {
		iam.RateLimitHits.WithLabelValues("login_email").Inc()
		iam.AuthLoginTotal.WithLabelValues("rate_limited").Inc()
		return nil, domain.ErrRateLimited
	}

	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		// Return same error regardless of whether email exists (no enumeration)
		iam.AuthLoginTotal.WithLabelValues("failure").Inc()
		s.auditLog.Record(ctx, domain.NewAuditEvent(
			"", domain.AuditLoginFailed, req.IP, req.DeviceInfo, req.RequestID,
			"FAILURE", "email="+req.Email+" reason=not_found",
		))
		return nil, domain.ErrInvalidCredentials
	}

	// Check account status
	switch user.Status {
	case domain.UserStatusSuspended:
		iam.AuthLoginTotal.WithLabelValues("failure").Inc()
		return nil, domain.ErrAccountSuspended
	case domain.UserStatusPendingDeletion, domain.UserStatusDeleted:
		iam.AuthLoginTotal.WithLabelValues("failure").Inc()
		return nil, domain.ErrInvalidCredentials
	}

	// Check brute force lockout
	if user.IsLocked() {
		iam.AuthLoginTotal.WithLabelValues("locked").Inc()
		s.auditLog.Record(ctx, domain.NewAuditEvent(
			user.ID.String(), domain.AuditLoginFailed, req.IP, req.DeviceInfo, req.RequestID,
			"FAILURE", "reason=account_locked",
		))
		return nil, domain.ErrAccountLocked
	}

	// Verify password
	if !s.verifyPassword(req.Password, user.PasswordHash) {
		iam.AuthLoginTotal.WithLabelValues("failure").Inc()
		iam.BruteForceEvents.WithLabelValues("failed_attempt").Inc()

		// Increment failed attempts
		count, _ := s.userRepo.IncrementFailedLogin(ctx, user.ID)
		if count >= s.cfg.MaxFailedLoginAttempts {
			lockUntil := time.Now().Add(s.cfg.AccountLockDuration)
			_ = s.userRepo.SetLockedUntil(ctx, user.ID, lockUntil)
			iam.BruteForceEvents.WithLabelValues("lockout").Inc()
			s.auditLog.Record(ctx, domain.NewAuditEvent(
				user.ID.String(), domain.AuditAccountLocked, req.IP, req.DeviceInfo, req.RequestID,
				"SUCCESS", fmt.Sprintf("locked_until=%s", lockUntil.Format(time.RFC3339)),
			))
		}

		s.auditLog.Record(ctx, domain.NewAuditEvent(
			user.ID.String(), domain.AuditLoginFailed, req.IP, req.DeviceInfo, req.RequestID,
			"FAILURE", fmt.Sprintf("reason=wrong_password attempts=%d", count),
		))
		return nil, domain.ErrInvalidCredentials
	}

	// Reset failed attempts on success
	_ = s.userRepo.ResetFailedLogin(ctx, user.ID)

	// Issue tokens
	tokens, session, err := s.issueTokenPair(ctx, user, req.DeviceID, req.DeviceInfo, req.IP)
	if err != nil {
		iam.AuthLoginTotal.WithLabelValues("failure").Inc()
		return nil, err
	}

	iam.AuthLoginTotal.WithLabelValues("success").Inc()
	iam.SessionActiveCount.Inc()

	s.log.Info("user logged in",
		zap.String("user_id", user.ID.String()),
		zap.String("request_id", req.RequestID))

	s.auditLog.Record(ctx, domain.NewAuditEvent(
		user.ID.String(), domain.AuditLogin, req.IP, req.DeviceInfo, req.RequestID,
		"SUCCESS", "session_id="+session.ID.String(),
	))

	if err := s.outbox.Enqueue(ctx, domain.TopicUserLoggedIn, domain.UserLoggedInEvent{
		EventID:    uuid.New().String(),
		UserID:     user.ID.String(),
		SessionID:  session.ID.String(),
		DeviceID:   req.DeviceID,
		DeviceInfo: req.DeviceInfo,
		IP:         req.IP,
		LoggedInAt: time.Now().UTC(),
	}); err != nil {
		s.log.Error("outbox insert user.logged_in failed", zap.Error(err))
	}

	return tokens, nil
}

// ─── Refresh ──────────────────────────────────────────────────────────────────

func (s *authService) RefreshToken(ctx context.Context, rawRefreshToken string) (*domain.TokenPair, error) {
	session, err := s.sessionRepo.FindByRefreshToken(ctx, rawRefreshToken)
	if err != nil {
		iam.AuthRefreshTotal.WithLabelValues("failure").Inc()
		return nil, domain.ErrTokenInvalid
	}

	// Detect token reuse (refresh token rotation violation)
	if session.IsRevoked() {
		iam.AuthRefreshTotal.WithLabelValues("reuse_detected").Inc()
		iam.BruteForceEvents.WithLabelValues("token_reuse").Inc()
		s.log.Warn("refresh token reuse detected — revoking all sessions",
			zap.String("user_id", session.UserID.String()))
		// Revoke entire session family
		_ = s.sessionRepo.RevokeAllForUser(ctx, session.UserID)
		s.auditLog.Record(ctx, domain.NewAuditEvent(
			session.UserID.String(), domain.AuditTokenReuseDetect, "", "", "",
			"FAILURE", "session_id="+session.ID.String(),
		))
		return nil, domain.ErrTokenInvalid
	}

	if session.IsExpired() {
		iam.AuthRefreshTotal.WithLabelValues("failure").Inc()
		return nil, domain.ErrTokenInvalid
	}

	// Revoke old session (rotation)
	if err := s.sessionRepo.Revoke(ctx, session.ID); err != nil {
		return nil, err
	}

	user, err := s.userRepo.FindByID(ctx, session.UserID)
	if err != nil {
		return nil, err
	}

	tokens, _, err := s.issueTokenPair(ctx, user, session.DeviceID, session.DeviceInfo, session.IP)
	if err != nil {
		iam.AuthRefreshTotal.WithLabelValues("failure").Inc()
		return nil, err
	}

	iam.AuthRefreshTotal.WithLabelValues("success").Inc()
	s.auditLog.Record(ctx, domain.NewAuditEvent(
		user.ID.String(), domain.AuditRefresh, session.IP, session.DeviceInfo, "",
		"SUCCESS", "",
	))
	return tokens, nil
}

// ─── Logout ───────────────────────────────────────────────────────────────────

func (s *authService) Logout(ctx context.Context, rawRefreshToken string) error {
	session, err := s.sessionRepo.FindByRefreshToken(ctx, rawRefreshToken)
	if err != nil {
		return nil // idempotent
	}
	if err := s.sessionRepo.Revoke(ctx, session.ID); err != nil {
		return err
	}
	iam.SessionActiveCount.Dec()
	iam.AuthLogoutTotal.WithLabelValues("success").Inc()
	s.auditLog.Record(ctx, domain.NewAuditEvent(
		session.UserID.String(), domain.AuditLogout, session.IP, session.DeviceInfo, "",
		"SUCCESS", "session_id="+session.ID.String(),
	))
	return nil
}

// ─── Profile ──────────────────────────────────────────────────────────────────

func (s *authService) GetMe(ctx context.Context, userID uuid.UUID) (*domain.User, error) {
	return s.userRepo.FindByID(ctx, userID)
}

func (s *authService) UpdateMe(ctx context.Context, userID uuid.UUID, req domain.UpdateMeRequest) (*domain.User, error) {
	if err := s.userRepo.UpdateProfile(ctx, userID, req); err != nil {
		return nil, err
	}
	return s.userRepo.FindByID(ctx, userID)
}

func (s *authService) DeleteMe(ctx context.Context, userID uuid.UUID, reason string) error {
	if err := s.userRepo.MarkPendingDeletion(ctx, userID); err != nil {
		return err
	}
	// Revoke all sessions
	_ = s.sessionRepo.RevokeAllForUser(ctx, userID)

	s.auditLog.Record(ctx, domain.NewAuditEvent(
		userID.String(), domain.AuditAccountDeleted, "", "", "",
		"SUCCESS", "reason="+reason,
	))

	if err := s.outbox.Enqueue(ctx, domain.TopicUserDeleted, domain.UserDeletedEvent{
		EventID:   uuid.New().String(),
		UserID:    userID.String(),
		DeletedAt: time.Now().UTC(),
		Reason:    reason,
	}); err != nil {
		s.log.Error("outbox insert user.deleted failed", zap.Error(err))
	}
	return nil
}

// ─── Email Verification ───────────────────────────────────────────────────────

func (s *authService) SendVerificationEmail(ctx context.Context, userID uuid.UUID) error {
	rawToken, err := generateSecureToken(32)
	if err != nil {
		return err
	}

	ev := &domain.EmailVerification{
		ID:        uuid.New(),
		UserID:    userID,
		Token:     rawToken,
		TokenHash: hashString(rawToken),
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}

	if err := s.userRepo.CreateEmailVerification(ctx, ev); err != nil {
		return err
	}

	// TODO: integrate with notification-service to send email
	// For now, log the token (dev mode only)
	s.log.Info("email verification token generated (dev — use in prod: send via notification-service)",
		zap.String("user_id", userID.String()),
		zap.String("token", rawToken[:8]+"..."),
		zap.String("link", s.cfg.BaseURL+"/api/v1/auth/verify-email?token="+rawToken))

	return nil
}

func (s *authService) VerifyEmail(ctx context.Context, rawToken string) error {
	tokenHash := hashString(rawToken)
	ev, err := s.userRepo.FindEmailVerificationByHash(ctx, tokenHash)
	if err != nil {
		return err
	}
	if ev.UsedAt != nil {
		return domain.ErrVerificationUsed
	}
	if time.Now().After(ev.ExpiresAt) {
		return domain.ErrVerificationInvalid
	}

	if err := s.userRepo.MarkEmailVerificationUsed(ctx, ev.ID); err != nil {
		return err
	}
	if err := s.userRepo.SetEmailVerified(ctx, ev.UserID); err != nil {
		return err
	}

	s.auditLog.Record(ctx, domain.NewAuditEvent(
		ev.UserID.String(), domain.AuditEmailVerified, "", "", "",
		"SUCCESS", "",
	))
	return nil
}

// ─── Password Reset ───────────────────────────────────────────────────────────

// ForgotPassword creates a password-reset token and logs the link (dev mode).
// Always returns nil to prevent email enumeration — caller must show generic message.
func (s *authService) ForgotPassword(ctx context.Context, email string) error {
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		// Anti-enumeration: silently succeed even if email not found
		return nil
	}

	rawToken, err := generateSecureToken(32)
	if err != nil {
		return nil // swallow — caller shows generic success
	}

	prt := &domain.PasswordResetToken{
		ID:        uuid.New(),
		UserID:    user.ID,
		Token:     rawToken,
		TokenHash: hashString(rawToken),
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}

	if err := s.userRepo.CreatePasswordResetToken(ctx, prt); err != nil {
		s.log.Error("failed to save password reset token", zap.Error(err))
		return nil // swallow — anti-enumeration
	}

	// TODO: integrate notification-service to send email
	// Dev: log the full link so developers can test the flow
	s.log.Info("password reset token generated (dev — wire notification-service in prod)",
		zap.String("user_id", user.ID.String()),
		zap.String("link", s.cfg.BaseURL+"/reset-password?token="+rawToken),
	)

	return nil
}

// ResetPassword validates the token and updates the password hash.
func (s *authService) ResetPassword(ctx context.Context, rawToken, newPassword string) error {
	tokenHash := hashString(rawToken)
	prt, err := s.userRepo.FindPasswordResetByHash(ctx, tokenHash)
	if err != nil {
		return domain.ErrResetTokenInvalid
	}
	if prt.UsedAt != nil {
		return domain.ErrResetTokenUsed
	}
	if time.Now().After(prt.ExpiresAt) {
		return domain.ErrResetTokenInvalid
	}

	// HIBP check on new password
	if s.cfg.HIBPEnabled {
		if count, hibpErr := s.hibp.IsPwned(newPassword); hibpErr == nil && count > 0 {
			return domain.ErrPasswordCompromised
		}
	}

	newHash, err := s.hashPassword(newPassword)
	if err != nil {
		return fmt.Errorf("hash password: %w", err)
	}

	if err := s.userRepo.UpdatePasswordHash(ctx, prt.UserID, newHash); err != nil {
		return err
	}
	if err := s.userRepo.MarkPasswordResetUsed(ctx, prt.ID); err != nil {
		return err
	}

	// Revoke all sessions for security
	_ = s.sessionRepo.RevokeAllForUser(ctx, prt.UserID)

	s.auditLog.Record(ctx, domain.NewAuditEvent(
		prt.UserID.String(), domain.AuditPasswordChange, "", "", "",
		"SUCCESS", "via_reset_token",
	))
	return nil
}

// ─── Account Management ───────────────────────────────────────────────────────

// ChangePassword verifies oldPassword matches current hash, then updates to newPassword.
// Revokes all sessions (force re-login after password change).
func (s *authService) ChangePassword(ctx context.Context, userID uuid.UUID, oldPassword, newPassword string) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}

	if !s.verifyPassword(oldPassword, user.PasswordHash) {
		return domain.ErrInvalidCredentials
	}

	if s.cfg.HIBPEnabled {
		if count, hibpErr := s.hibp.IsPwned(newPassword); hibpErr == nil && count > 0 {
			return domain.ErrPasswordCompromised
		}
	}

	newHash, err := s.hashPassword(newPassword)
	if err != nil {
		return fmt.Errorf("hash password: %w", err)
	}

	if err := s.userRepo.UpdatePasswordHash(ctx, userID, newHash); err != nil {
		return err
	}

	// Revoke all sessions so attacker can't keep using stolen session
	_ = s.sessionRepo.RevokeAllForUser(ctx, userID)

	s.auditLog.Record(ctx, domain.NewAuditEvent(
		userID.String(), domain.AuditPasswordChange, "", "", "",
		"SUCCESS", "via_account_settings",
	))
	return nil
}

// DeleteMeWithPassword verifies password before soft-deleting the account.
func (s *authService) DeleteMeWithPassword(ctx context.Context, userID uuid.UUID, password, reason string) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return err
	}

	// Require password confirmation for security
	if !s.verifyPassword(password, user.PasswordHash) {
		return domain.ErrInvalidCredentials
	}

	return s.DeleteMe(ctx, userID, reason)
}

// ─── Session Management ───────────────────────────────────────────────────────

func (s *authService) ListSessions(ctx context.Context, userID uuid.UUID) ([]*domain.Session, error) {
	return s.sessionRepo.ListActiveByUser(ctx, userID)
}

func (s *authService) RevokeSession(ctx context.Context, userID, sessionID uuid.UUID) error {
	// Verify the session belongs to this user
	session, err := s.sessionRepo.FindByID(ctx, sessionID)
	if err != nil {
		return domain.ErrTokenInvalid
	}
	if session.UserID != userID {
		return domain.ErrTokenInvalid // don't reveal whether session exists
	}
	if err := s.sessionRepo.Revoke(ctx, sessionID); err != nil {
		return err
	}
	s.auditLog.Record(ctx, domain.NewAuditEvent(
		userID.String(), domain.AuditSessionRevoked, "", "", "",
		"SUCCESS", "session_id="+sessionID.String(),
	))
	return nil
}

// ─── JWKS ─────────────────────────────────────────────────────────────────────

func (s *authService) GetPublicKey() *rsa.PublicKey { return s.publicKey }
func (s *authService) GetKeyID() string             { return s.keyID }

// ─── Internal helpers ─────────────────────────────────────────────────────────

func (s *authService) issueTokenPair(ctx context.Context, user *domain.User, deviceID, deviceInfo, ip string) (*domain.TokenPair, *domain.Session, error) {
	now := time.Now().UTC()
	jtiStr := uuid.New().String()

	// Build roles as strings for JWT
	roleStrings := make([]string, len(user.Roles))
	for i, r := range user.Roles {
		roleStrings[i] = string(r)
	}

	// Scopes derived from roles (simplified)
	scopes := []string{"read:self", "write:self"}
	for _, r := range user.Roles {
		if r == domain.RoleAdmin || r == domain.RolePlatformAdmin {
			scopes = append(scopes, "admin:all")
		}
	}

	claims := jwt.MapClaims{
		"sub":        user.ID.String(),
		// NOTE: no "email" — PII not in JWT per 09-security.md §2.2
		"tier":       "free", // entitlement-service enriches this
		"lang":       user.UILanguage,
		"roles":      roleStrings,
		"scopes":     scopes,
		"jti":        jtiStr,
		"iss":        "identity-service",
		"aud":        []string{"omnilingo"},
		"iat":        now.Unix(),
		"exp":        now.Add(s.cfg.AccessTokenTTL).Unix(),
	}

	// RS256 signing
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	token.Header["kid"] = s.keyID
	accessToken, err := token.SignedString(s.privateKey)
	if err != nil {
		return nil, nil, fmt.Errorf("sign access token: %w", err)
	}

	// Opaque refresh token
	rawRefresh, err := generateSecureToken(32)
	if err != nil {
		return nil, nil, fmt.Errorf("generate refresh token: %w", err)
	}

	session := &domain.Session{
		ID:               uuid.New(),
		UserID:           user.ID,
		RefreshTokenHash: hashString(rawRefresh),
		DeviceID:         deviceID,
		DeviceInfo:       deviceInfo,
		IP:               ip,
		ExpiresAt:        now.Add(s.cfg.RefreshTokenTTL),
	}

	if err := s.sessionRepo.Create(ctx, session); err != nil {
		return nil, nil, err
	}

	return &domain.TokenPair{
		AccessToken:  accessToken,
		RefreshToken: rawRefresh,
		ExpiresIn:    int(s.cfg.AccessTokenTTL.Seconds()),
		TokenType:    "Bearer",
	}, session, nil
}

func (s *authService) hashPassword(password string) (string, error) {
	salt := make([]byte, s.cfg.ArgonSaltLength)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}
	hash := argon2.IDKey(
		[]byte(password), salt,
		s.cfg.ArgonIterations,
		s.cfg.ArgonMemory,
		s.cfg.ArgonParallelism,
		s.cfg.ArgonKeyLength,
	)
	encoded := base64.RawStdEncoding.EncodeToString(salt) + "$" + base64.RawStdEncoding.EncodeToString(hash)
	return encoded, nil
}

func (s *authService) verifyPassword(password, encoded string) bool {
	idx := strings.Index(encoded, "$")
	if idx < 0 {
		return false
	}
	salt, err1 := base64.RawStdEncoding.DecodeString(encoded[:idx])
	storedHash, err2 := base64.RawStdEncoding.DecodeString(encoded[idx+1:])
	if err1 != nil || err2 != nil {
		return false
	}
	hash := argon2.IDKey(
		[]byte(password), salt,
		s.cfg.ArgonIterations,
		s.cfg.ArgonMemory,
		s.cfg.ArgonParallelism,
		s.cfg.ArgonKeyLength,
	)
	if len(hash) != len(storedHash) {
		return false
	}
	var diff byte
	for i := range hash {
		diff |= hash[i] ^ storedHash[i]
	}
	return diff == 0
}

func generateSecureToken(n int) (string, error) {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func hashString(s string) string {
	h := sha256.Sum256([]byte(s))
	return hex.EncodeToString(h[:])
}

// ─── RSA Key Management ───────────────────────────────────────────────────────

// loadOrGenerateRSAKey loads a private key from a PEM file if path is set,
// otherwise generates a fresh RSA-2048 key (dev mode).
func loadOrGenerateRSAKey(pemPath string, log *zap.Logger) (*rsa.PrivateKey, error) {
	if pemPath != "" {
		data, err := os.ReadFile(pemPath)
		if err != nil {
			return nil, fmt.Errorf("read private key PEM: %w", err)
		}
		block, _ := pem.Decode(data)
		if block == nil {
			return nil, fmt.Errorf("invalid PEM block in %s", pemPath)
		}
		key, err := x509.ParsePKCS8PrivateKey(block.Bytes)
		if err != nil {
			// Try PKCS1
			key, err = x509.ParsePKCS1PrivateKey(block.Bytes)
			if err != nil {
				return nil, fmt.Errorf("parse private key: %w", err)
			}
		}
		rsaKey, ok := key.(*rsa.PrivateKey)
		if !ok {
			return nil, fmt.Errorf("key is not RSA")
		}
		log.Info("JWT: loaded RS256 private key", zap.String("path", pemPath))
		return rsaKey, nil
	}

	// Dev mode: generate in-memory
	log.Warn("JWT: no private key file configured — generating ephemeral RSA-2048 key (dev only)")
	key, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, fmt.Errorf("generate RSA key: %w", err)
	}
	return key, nil
}

// RsaPublicKeyToJWK converts an RSA public key to JWK format fields.
func RsaPublicKeyToJWK(pub *rsa.PublicKey, keyID, alg string) map[string]interface{} {
	return map[string]interface{}{
		"kty": "RSA",
		"use": "sig",
		"alg": alg,
		"kid": keyID,
		"n":   base64.RawURLEncoding.EncodeToString(pub.N.Bytes()),
		"e":   base64.RawURLEncoding.EncodeToString(big.NewInt(int64(pub.E)).Bytes()),
	}
}
