package domain

import (
	"time"

	"github.com/google/uuid"
)

// ─── Enums ───────────────────────────────────────────────────────────────────

// UserStatus represents the lifecycle state of a user account.
type UserStatus string

const (
	UserStatusActive          UserStatus = "active"
	UserStatusSuspended       UserStatus = "suspended"
	UserStatusLocked          UserStatus = "locked"
	UserStatusPendingDeletion UserStatus = "pending_deletion"
	UserStatusDeleted         UserStatus = "deleted"
)

// Role represents an RBAC role.
type Role string

const (
	RoleUser          Role = "user"
	RolePremiumUser   Role = "premium_user"
	RoleTeacher       Role = "teacher"
	RoleAdmin         Role = "admin"
	RoleContentEditor Role = "content_editor"
	RoleContentAdmin  Role = "content_admin"
	RoleModerator     Role = "moderator"
	RoleBillingAdmin  Role = "billing_admin"
	RolePlatformAdmin Role = "platform_admin"
	RoleTenantAdmin   Role = "tenant_admin"
	RoleTenantLearner Role = "tenant_learner"
)

// OAuthProvider represents supported social login providers.
type OAuthProvider string

const (
	ProviderGoogle   OAuthProvider = "google"
	ProviderApple    OAuthProvider = "apple"
	ProviderFacebook OAuthProvider = "facebook"
	ProviderZalo     OAuthProvider = "zalo"
	ProviderKakao    OAuthProvider = "kakao"
	ProviderLine     OAuthProvider = "line"
)

// ─── Entities ────────────────────────────────────────────────────────────────

// User is the core domain entity.
type User struct {
	ID            uuid.UUID  `json:"id"`
	Email         string     `json:"email,omitempty"`
	Phone         string     `json:"phone,omitempty"`
	DisplayName   string     `json:"display_name"`
	AvatarURL     string     `json:"avatar_url,omitempty"`
	UILanguage    string     `json:"ui_language"`
	Timezone      string     `json:"timezone"`
	Status        UserStatus `json:"status"`
	EmailVerified bool       `json:"email_verified"`
	MFAEnabled    bool       `json:"mfa_enabled"`
	Roles         []Role     `json:"roles"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`

	// Learning preferences
	DailyGoalMinutes   int        `json:"daily_goal_minutes"`
	ReminderTime       *string    `json:"reminder_time,omitempty"` // "HH:MM" or nil
	LearningLanguages  []string   `json:"learning_languages"`

	// Internal — never serialized to clients
	PasswordHash        string     `json:"-"`
	FailedLoginCount    int        `json:"-"`
	LockedUntil         *time.Time `json:"-"`
}

// IsLocked returns true if account is temporarily locked due to brute force.
func (u *User) IsLocked() bool {
	if u.Status == UserStatusLocked {
		return true
	}
	if u.LockedUntil != nil && time.Now().Before(*u.LockedUntil) {
		return true
	}
	return false
}

// Session represents an active user session (refresh token lifecycle).
type Session struct {
	ID               uuid.UUID  `json:"id"`
	UserID           uuid.UUID  `json:"user_id"`
	RefreshTokenHash string     `json:"-"`
	DeviceID         string     `json:"device_id,omitempty"`
	DeviceInfo       string     `json:"device_info,omitempty"`
	IP               string     `json:"ip,omitempty"`
	CreatedAt        time.Time  `json:"created_at"`
	ExpiresAt        time.Time  `json:"expires_at"`
	RevokedAt        *time.Time `json:"revoked_at,omitempty"`
}

// IsExpired returns true if session has passed its expiry time.
func (s *Session) IsExpired() bool {
	return time.Now().After(s.ExpiresAt)
}

// IsRevoked returns true if session has been revoked.
func (s *Session) IsRevoked() bool {
	return s.RevokedAt != nil
}

// OAuthIdentity links a user to a social login provider.
type OAuthIdentity struct {
	UserID         uuid.UUID     `json:"user_id"`
	Provider       OAuthProvider `json:"provider"`
	ProviderUserID string        `json:"provider_user_id"`
	LinkedAt       time.Time     `json:"linked_at"`
}

// EmailVerification stores a pending email verification token.
type EmailVerification struct {
	ID        uuid.UUID  `json:"id"`
	UserID    uuid.UUID  `json:"user_id"`
	Token     string     `json:"-"` // plaintext only when created; stored as hash
	TokenHash string     `json:"-"`
	ExpiresAt time.Time  `json:"expires_at"`
	UsedAt    *time.Time `json:"used_at,omitempty"`
}

// PasswordResetToken stores a pending password-reset token.
type PasswordResetToken struct {
	ID        uuid.UUID  `json:"id"`
	UserID    uuid.UUID  `json:"user_id"`
	Token     string     `json:"-"` // plaintext — only returned at creation
	TokenHash string     `json:"-"`
	ExpiresAt time.Time  `json:"expires_at"`
	UsedAt    *time.Time `json:"used_at,omitempty"`
}

// TokenPair is returned on successful login or token refresh.
type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"` // seconds until AT expires
	TokenType    string `json:"token_type"` // "Bearer"
}

// UpdateMeRequest contains allowable fields for self-service profile update.
type UpdateMeRequest struct {
	DisplayName       *string  `json:"display_name,omitempty"`
	UILanguage        *string  `json:"ui_language,omitempty"`
	Timezone          *string  `json:"timezone,omitempty"`
	AvatarURL         *string  `json:"avatar_url,omitempty"`
	// Learning preferences
	DailyGoalMinutes  *int     `json:"daily_goal_minutes,omitempty"`
	ReminderTime      *string  `json:"reminder_time,omitempty"` // "HH:MM" 24h or null to disable
	LearningLanguages []string `json:"learning_languages,omitempty"`
}

// ─── Domain Errors ───────────────────────────────────────────────────────────

// DomainError is a structured error with an application-level code.
type DomainError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func (e *DomainError) Error() string { return e.Message }

// Sentinel errors
var (
	ErrUserNotFound         = &DomainError{Code: "USER_NOT_FOUND", Message: "user not found"}
	ErrEmailTaken           = &DomainError{Code: "EMAIL_TAKEN", Message: "email already in use"}
	ErrInvalidCredentials   = &DomainError{Code: "INVALID_CREDENTIALS", Message: "invalid email or password"}
	ErrEmailNotVerified     = &DomainError{Code: "EMAIL_NOT_VERIFIED", Message: "please verify your email first"}
	ErrAccountSuspended     = &DomainError{Code: "ACCOUNT_SUSPENDED", Message: "account has been suspended"}
	ErrAccountLocked        = &DomainError{Code: "ACCOUNT_LOCKED", Message: "account temporarily locked due to too many failed attempts"}
	ErrTokenInvalid         = &DomainError{Code: "TOKEN_INVALID", Message: "token is invalid or expired"}
	ErrSessionRevoked       = &DomainError{Code: "SESSION_REVOKED", Message: "session has been revoked"}
	ErrMFARequired          = &DomainError{Code: "MFA_REQUIRED", Message: "MFA verification required"}
	ErrRateLimited          = &DomainError{Code: "RATE_LIMITED", Message: "too many requests, please try again later"}
	ErrPasswordCompromised  = &DomainError{Code: "PASSWORD_COMPROMISED", Message: "this password has appeared in a data breach — please choose a different one"}
	ErrVerificationInvalid  = &DomainError{Code: "VERIFICATION_INVALID", Message: "verification token is invalid or expired"}
	ErrVerificationUsed     = &DomainError{Code: "VERIFICATION_USED", Message: "verification token has already been used"}
	ErrResetTokenInvalid    = &DomainError{Code: "RESET_TOKEN_INVALID", Message: "password reset token is invalid or expired"}
	ErrResetTokenUsed       = &DomainError{Code: "RESET_TOKEN_USED", Message: "password reset token has already been used"}
)
