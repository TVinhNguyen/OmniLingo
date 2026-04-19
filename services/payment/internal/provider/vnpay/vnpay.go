// Package vnpay implements the VNPay payment adapter.
// Spec: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
package vnpay

import (
	"context"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"net/url"
	"sort"
	"strings"
	"time"

	"github.com/omnilingo/payment-service/internal/domain"
	"go.uber.org/zap"
)

// Adapter is the VNPay payment adapter.
type Adapter struct {
	tmnCode    string
	hashSecret string
	baseURL    string
	returnURL  string
	log        *zap.Logger
}

func New(tmnCode, hashSecret, baseURL, returnURL string, log *zap.Logger) *Adapter {
	return &Adapter{
		tmnCode:    tmnCode,
		hashSecret: hashSecret,
		baseURL:    baseURL,
		returnURL:  returnURL,
		log:        log,
	}
}

func (a *Adapter) Type() domain.ProviderType { return domain.ProviderVNPay }

// CreateCheckoutSession creates a VNPay payment URL.
// VNPay uses a redirect-based flow: we build a signed URL and return it as the checkout URL.
func (a *Adapter) CreateCheckoutSession(_ context.Context, req domain.CheckoutRequest) (*domain.CheckoutSession, error) {
	now := time.Now().In(vnpayTZ())

	orderID := req.UserID.String()[:8] + "-" + fmt.Sprintf("%d", now.UnixMilli())

	params := url.Values{}
	params.Set("vnp_Version", "2.1.0")
	params.Set("vnp_Command", "pay")
	params.Set("vnp_TmnCode", a.tmnCode)
	params.Set("vnp_Amount", fmt.Sprintf("%d", req.AmountCents*100)) // VNPay = amount * 100
	params.Set("vnp_CurrCode", "VND")
	params.Set("vnp_TxnRef", orderID)
	params.Set("vnp_OrderInfo", fmt.Sprintf("OmniLingo %s subscription", req.PlanCode))
	params.Set("vnp_OrderType", "subscription")
	params.Set("vnp_ReturnUrl", a.returnURL)
	params.Set("vnp_IpAddr", "127.0.0.1") // caller should inject real IP
	params.Set("vnp_CreateDate", now.Format("20060102150405"))
	params.Set("vnp_ExpireDate", now.Add(15*time.Minute).Format("20060102150405"))
	params.Set("vnp_Locale", "vn")

	sig := a.signParams(params)
	params.Set("vnp_SecureHash", sig)

	checkoutURL := a.baseURL + "?" + params.Encode()

	return &domain.CheckoutSession{
		SessionID:   orderID,
		CheckoutURL: checkoutURL,
	}, nil
}

// ParseWebhook verifies the VNPay IPN callback signature and returns a normalized webhook.
// VNPay IPN sends GET params — payload is the raw query string, signature is vnp_SecureHash.
func (a *Adapter) ParseWebhook(payload []byte, signature string) (*domain.NormalizedWebhook, error) {
	params, err := url.ParseQuery(string(payload))
	if err != nil {
		return nil, fmt.Errorf("vnpay: parse IPN query: %w", err)
	}

	// Remove hash fields before verifying
	toVerify := url.Values{}
	for k, v := range params {
		if k != "vnp_SecureHash" && k != "vnp_SecureHashType" {
			toVerify[k] = v
		}
	}

	expectedSig := a.signParams(toVerify)
	if !hmac.Equal([]byte(strings.ToUpper(expectedSig)), []byte(strings.ToUpper(signature))) {
		return nil, domain.ErrInvalidSig
	}

	responseCode := params.Get("vnp_ResponseCode")
	txnRef := params.Get("vnp_TxnRef")
	transactionNo := params.Get("vnp_TransactionNo")
	amount := params.Get("vnp_Amount")

	// VNPay uses txnRef as our order ID (provider session ID)
	norm := &domain.NormalizedWebhook{
		ProviderEventID:   transactionNo,
		ProviderChargeID:  transactionNo,
		ProviderSessionID: txnRef,
		Currency:          "VND",
	}

	if amount != "" {
		var amtInt int
		fmt.Sscanf(amount, "%d", &amtInt)
		norm.AmountCents = amtInt / 100 // reverse VNPay *100 encoding
	}

	if responseCode == "00" {
		norm.EventType = domain.EventPaymentSucceeded
	} else {
		norm.EventType = domain.EventPaymentFailed
		norm.FailureCode = responseCode
		norm.FailureMessage = vnpayResponseDesc(responseCode)
	}

	return norm, nil
}

// RefundCharge is not yet supported for VNPay in MVP — returns stub error.
// VNPay refund requires a separate API call with admin approval flow.
func (a *Adapter) RefundCharge(_ context.Context, _ string, _ int) (string, error) {
	return "", fmt.Errorf("vnpay: refund not implemented in MVP phase")
}

// ─── helpers ──────────────────────────────────────────────────────────────────

// signParams builds the VNPay HMAC-SHA512 signature from sorted query params.
func (a *Adapter) signParams(params url.Values) string {
	// Sort keys alphabetically
	keys := make([]string, 0, len(params))
	for k := range params {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	var sb strings.Builder
	for i, k := range keys {
		if i > 0 {
			sb.WriteByte('&')
		}
		sb.WriteString(k)
		sb.WriteByte('=')
		sb.WriteString(url.QueryEscape(params.Get(k)))
	}

	mac := hmac.New(sha512.New, []byte(a.hashSecret))
	mac.Write([]byte(sb.String()))
	return hex.EncodeToString(mac.Sum(nil))
}

func vnpayTZ() *time.Location {
	loc, err := time.LoadLocation("Asia/Ho_Chi_Minh")
	if err != nil {
		return time.UTC
	}
	return loc
}

func vnpayResponseDesc(code string) string {
	codes := map[string]string{
		"00": "Giao dịch thành công",
		"07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
		"09": "Thẻ/Tài khoản chưa đăng ký dịch vụ",
		"10": "Xác thực thẻ/tài khoản không đúng quá 3 lần",
		"11": "Đã hết hạn chờ thanh toán",
		"12": "Thẻ/Tài khoản bị khóa",
		"13": "Nhập sai mật khẩu OTP",
		"24": "Khách hàng hủy giao dịch",
		"51": "Tài khoản của quý khách không đủ số dư",
		"65": "Tài khoản của quý khách đã vượt quá hạn mức giao dịch trong ngày",
		"75": "Ngân hàng thanh toán đang bảo trì",
		"79": "Nhập sai mật khẩu thanh toán quá số lần quy định",
		"99": "Lỗi không xác định",
	}
	if desc, ok := codes[code]; ok {
		return desc
	}
	return "Unknown error"
}
