package handler

import (
	"encoding/base64"
	"math/big"

	"github.com/gofiber/fiber/v2"

	"github.com/omnilingo/omnilingo/services/identity/internal/service"
)

// RegisterJWKS mounts the JWKS discovery endpoint.
func RegisterJWKS(app *fiber.App, svc service.AuthService) {
	app.Get("/.well-known/jwks.json", jwksHandler(svc))
}

// jwksHandler returns the RSA public key in JWK Set format.
// This endpoint is used by other services to verify JWT signatures
// without needing the private key (RS256 asymmetric verification).
func jwksHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		pub := svc.GetPublicKey()
		kid := svc.GetKeyID()

		jwk := map[string]interface{}{
			"kty": "RSA",
			"use": "sig",
			"alg": "RS256",
			"kid": kid,
			"n":   base64.RawURLEncoding.EncodeToString(pub.N.Bytes()),
			"e":   base64.RawURLEncoding.EncodeToString(big.NewInt(int64(pub.E)).Bytes()),
		}

		c.Set("Cache-Control", "public, max-age=3600") // cache 1h
		return c.JSON(fiber.Map{
			"keys": []interface{}{jwk},
		})
	}
}
