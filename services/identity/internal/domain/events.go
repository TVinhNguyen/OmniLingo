package domain

import (
	"time"

	"github.com/google/uuid"
)

// ─── Kafka Event Types ────────────────────────────────────────────────────────

// Topic constants for identity domain events.
const (
	TopicUserRegistered = "identity.user.registered"
	TopicUserLoggedIn   = "identity.user.logged_in"
	TopicUserDeleted    = "identity.user.deleted"
	TopicAuditEvent     = "audit.identity.events"
)

// UserRegisteredEvent is emitted after successful registration.
type UserRegisteredEvent struct {
	EventID     string    `json:"event_id"`
	UserID      string    `json:"user_id"`
	Email       string    `json:"email"`
	DisplayName string    `json:"display_name"`
	UILanguage  string    `json:"ui_language"`
	Roles       []string  `json:"roles"`
	CreatedAt   time.Time `json:"created_at"`
}

// UserLoggedInEvent is emitted after successful login.
type UserLoggedInEvent struct {
	EventID    string    `json:"event_id"`
	UserID     string    `json:"user_id"`
	SessionID  string    `json:"session_id"`
	DeviceID   string    `json:"device_id"`
	DeviceInfo string    `json:"device_info"`
	IP         string    `json:"ip"`
	LoggedInAt time.Time `json:"logged_in_at"`
}

// UserDeletedEvent is emitted when GDPR delete is initiated.
type UserDeletedEvent struct {
	EventID   string    `json:"event_id"`
	UserID    string    `json:"user_id"`
	DeletedAt time.Time `json:"deleted_at"`
	Reason    string    `json:"reason"`
}

// ─── Audit Events ─────────────────────────────────────────────────────────────

// AuditAction represents a loggable security-relevant action.
type AuditAction string

const (
	AuditLogin            AuditAction = "AUTH_LOGIN"
	AuditLoginFailed      AuditAction = "AUTH_LOGIN_FAILED"
	AuditRegister         AuditAction = "AUTH_REGISTER"
	AuditLogout           AuditAction = "AUTH_LOGOUT"
	AuditRefresh          AuditAction = "AUTH_REFRESH"
	AuditTokenReuseDetect AuditAction = "AUTH_TOKEN_REUSE_DETECTED"
	AuditPasswordChange   AuditAction = "AUTH_PASSWORD_CHANGED"
	AuditAccountLocked    AuditAction = "AUTH_ACCOUNT_LOCKED"
	AuditAccountDeleted   AuditAction = "AUTH_ACCOUNT_DELETED"
	AuditEmailVerified    AuditAction = "AUTH_EMAIL_VERIFIED"
	AuditSessionRevoked   AuditAction = "AUTH_SESSION_REVOKED"
)

// AuditEvent is an immutable record of a security-relevant action.
type AuditEvent struct {
	EventID    string      `json:"event_id"`
	UserID     string      `json:"user_id"`    // may be empty for pre-auth actions
	Action     AuditAction `json:"action"`
	IP         string      `json:"ip"`
	DeviceInfo string      `json:"device_info"`
	RequestID  string      `json:"request_id"`
	Result     string      `json:"result"` // "SUCCESS" | "FAILURE"
	Details    string      `json:"details,omitempty"`
	Timestamp  time.Time   `json:"timestamp"`
}

// NewAuditEvent creates an AuditEvent with a fresh UUID.
func NewAuditEvent(userID string, action AuditAction, ip, deviceInfo, requestID, result, details string) AuditEvent {
	return AuditEvent{
		EventID:    uuid.New().String(),
		UserID:     userID,
		Action:     action,
		IP:         ip,
		DeviceInfo: deviceInfo,
		RequestID:  requestID,
		Result:     result,
		Details:    details,
		Timestamp:  time.Now().UTC(),
	}
}
