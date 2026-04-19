// Package momo implements the MoMo payment adapter.
// Spec: https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
package momo

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/payment-service/internal/domain"
	"go.uber.org/zap"
)

// Adapter is the MoMo payment adapter.
type Adapter struct {
	partnerCode string
	accessKey   string
	secretKey   string
	baseURL     string
	returnURL   string
	notifyURL   string
	httpClient  *http.Client
	log         *zap.Logger
}

func New(partnerCode, accessKey, secretKey, baseURL, returnURL, notifyURL string, log *zap.Logger) *Adapter {
	return &Adapter{
		partnerCode: partnerCode,
		accessKey:   accessKey,
		secretKey:   secretKey,
		baseURL:     baseURL,
		returnURL:   returnURL,
		notifyURL:   notifyURL,
		httpClient:  &http.Client{Timeout: 15 * time.Second},
		log:         log,
	}
}

func (a *Adapter) Type() domain.ProviderType { return domain.ProviderMoMo }

// momoCreateRequest mirrors the MoMo create payment API body.
type momoCreateRequest struct {
	PartnerCode string `json:"partnerCode"`
	PartnerName string `json:"partnerName"`
	StoreID     string `json:"storeId"`
	RequestID   string `json:"requestId"`
	Amount      int64  `json:"amount"`
	OrderID     string `json:"orderId"`
	OrderInfo   string `json:"orderInfo"`
	ReturnURL   string `json:"returnUrl"`
	NotifyURL   string `json:"notifyUrl"`
	RequestType string `json:"requestType"`
	Signature   string `json:"signature"`
	Lang        string `json:"lang"`
}

type momoCreateResponse struct {
	PartnerCode string `json:"partnerCode"`
	RequestID   string `json:"requestId"`
	OrderID     string `json:"orderId"`
	ResultCode  int    `json:"resultCode"`
	Message     string `json:"message"`
	PayURL      string `json:"payUrl"`
	QrCodeURL   string `json:"qrCodeUrl"`
}

// CreateCheckoutSession creates a MoMo payment session.
func (a *Adapter) CreateCheckoutSession(ctx context.Context, req domain.CheckoutRequest) (*domain.CheckoutSession, error) {
	orderID := fmt.Sprintf("%s-%d", req.UserID.String()[:8], time.Now().UnixMilli())
	requestID := uuid.New().String()

	rawSig := fmt.Sprintf(
		"accessKey=%s&amount=%d&extraData=&ipnUrl=%s&orderId=%s&orderInfo=OmniLingo+%s+subscription&orderType=momo_wallet&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=captureWallet",
		a.accessKey, req.AmountCents, a.notifyURL, orderID, req.PlanCode, a.partnerCode, a.returnURL, requestID,
	)
	sig := a.sign(rawSig)

	body := momoCreateRequest{
		PartnerCode: a.partnerCode,
		PartnerName: "OmniLingo",
		StoreID:     "OmniLingo",
		RequestID:   requestID,
		Amount:      int64(req.AmountCents),
		OrderID:     orderID,
		OrderInfo:   fmt.Sprintf("OmniLingo %s subscription", req.PlanCode),
		ReturnURL:   a.returnURL,
		NotifyURL:   a.notifyURL,
		RequestType: "captureWallet",
		Signature:   sig,
		Lang:        "vi",
	}

	bodyBytes, err := json.Marshal(body)
	if err != nil {
		return nil, fmt.Errorf("momo: marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, a.baseURL, bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, fmt.Errorf("momo: create http request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := a.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("momo: http call failed: %w", err)
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("momo: read response: %w", err)
	}

	var momoResp momoCreateResponse
	if err := json.Unmarshal(respBytes, &momoResp); err != nil {
		return nil, fmt.Errorf("momo: parse response: %w", err)
	}

	if momoResp.ResultCode != 0 {
		return nil, fmt.Errorf("momo: create payment failed (code=%d): %s", momoResp.ResultCode, momoResp.Message)
	}

	return &domain.CheckoutSession{
		SessionID:   orderID,
		CheckoutURL: momoResp.PayURL,
	}, nil
}

// ParseWebhook verifies MoMo IPN signature and returns a normalized webhook.
// MoMo IPN sends a JSON POST body.
type momoIPNPayload struct {
	PartnerCode  string `json:"partnerCode"`
	OrderID      string `json:"orderId"`
	RequestID    string `json:"requestId"`
	Amount       int64  `json:"amount"`
	OrderInfo    string `json:"orderInfo"`
	OrderType    string `json:"orderType"`
	TransID      int64  `json:"transId"`
	ResultCode   int    `json:"resultCode"`
	Message      string `json:"message"`
	PayType      string `json:"payType"`
	Signature    string `json:"signature"`
}

func (a *Adapter) ParseWebhook(payload []byte, _ string) (*domain.NormalizedWebhook, error) {
	var ipn momoIPNPayload
	if err := json.Unmarshal(payload, &ipn); err != nil {
		return nil, fmt.Errorf("momo: unmarshal IPN: %w", err)
	}

	// Reconstruct the raw signature string per MoMo spec
	rawSig := fmt.Sprintf(
		"accessKey=%s&amount=%d&extraData=&message=%s&orderId=%s&orderInfo=%s&orderType=%s&partnerCode=%s&payType=%s&requestId=%s&responseTime=0&resultCode=%d&transId=%d",
		a.accessKey, ipn.Amount, ipn.Message, ipn.OrderID, ipn.OrderInfo, ipn.OrderType,
		ipn.PartnerCode, ipn.PayType, ipn.RequestID, ipn.ResultCode, ipn.TransID,
	)
	expected := a.sign(rawSig)

	if !hmac.Equal([]byte(expected), []byte(ipn.Signature)) {
		return nil, domain.ErrInvalidSig
	}

	norm := &domain.NormalizedWebhook{
		ProviderEventID:   fmt.Sprintf("%s-%d", ipn.OrderID, ipn.TransID),
		ProviderSessionID: ipn.OrderID,
		ProviderChargeID:  fmt.Sprintf("%d", ipn.TransID),
		AmountCents:       int(ipn.Amount),
		Currency:          "VND",
	}

	if ipn.ResultCode == 0 {
		norm.EventType = domain.EventPaymentSucceeded
	} else {
		norm.EventType = domain.EventPaymentFailed
		norm.FailureCode = fmt.Sprintf("%d", ipn.ResultCode)
		norm.FailureMessage = ipn.Message
	}

	return norm, nil
}

// RefundCharge is not implemented for MVP (requires MoMo admin API).
func (a *Adapter) RefundCharge(_ context.Context, _ string, _ int) (string, error) {
	return "", fmt.Errorf("momo: refund not implemented in MVP phase")
}

// sign computes HMAC-SHA256 with the MoMo secret key.
func (a *Adapter) sign(data string) string {
	mac := hmac.New(sha256.New, []byte(a.secretKey))
	mac.Write([]byte(data))
	return hex.EncodeToString(mac.Sum(nil))
}
