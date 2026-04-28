package request_test

import (
	"bytes"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnilingo/pkg/request"
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

func makeApp(handler fiber.Handler) *fiber.App {
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{"error": err.Error()})
		},
	})
	app.Post("/test", handler)
	app.Get("/test/:id", handler)
	app.Get("/page", handler)
	return app
}

func doRequest(app *fiber.App, method, path, body string) *http.Response {
	var bodyReader io.Reader
	if body != "" {
		bodyReader = bytes.NewBufferString(body)
	}
	req := httptest.NewRequest(method, path, bodyReader)
	if body != "" {
		req.Header.Set("Content-Type", "application/json")
	}
	resp, _ := app.Test(req, -1)
	return resp
}

// ─── Parse tests ──────────────────────────────────────────────────────────────

type TestReq struct {
	Email    string `json:"email"    validate:"required,email"`
	Password string `json:"password" validate:"required,min=10"`
	Name     string `json:"name"     validate:"required"`
}

func TestParse_ValidBody(t *testing.T) {
	app := makeApp(func(c *fiber.Ctx) error {
		req, err := request.Parse[TestReq](c)
		if err != nil {
			return err
		}
		return c.JSON(fiber.Map{"email": req.Email})
	})

	resp := doRequest(app, "POST", "/test", `{"email":"user@example.com","password":"secret1234","name":"Alice"}`)
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestParse_InvalidJSON(t *testing.T) {
	app := makeApp(func(c *fiber.Ctx) error {
		_, err := request.Parse[TestReq](c)
		return err
	})

	resp := doRequest(app, "POST", "/test", `{not valid json}`)
	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
}

func TestParse_MissingRequiredField(t *testing.T) {
	app := makeApp(func(c *fiber.Ctx) error {
		_, err := request.Parse[TestReq](c)
		return err
	})

	resp := doRequest(app, "POST", "/test", `{"email":"user@example.com","password":"secret1234"}`)
	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
}

func TestParse_InvalidEmail(t *testing.T) {
	app := makeApp(func(c *fiber.Ctx) error {
		_, err := request.Parse[TestReq](c)
		return err
	})

	resp := doRequest(app, "POST", "/test", `{"email":"not-an-email","password":"longpassword","name":"Bob"}`)
	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
}

func TestParse_PasswordTooShort(t *testing.T) {
	app := makeApp(func(c *fiber.Ctx) error {
		_, err := request.Parse[TestReq](c)
		return err
	})

	resp := doRequest(app, "POST", "/test", `{"email":"user@example.com","password":"short","name":"Bob"}`)
	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
}

// ─── ParseUUID tests ──────────────────────────────────────────────────────────

func TestParseUUID_Valid(t *testing.T) {
	id := uuid.New()
	var got uuid.UUID

	app := fiber.New()
	app.Get("/test/:id", func(c *fiber.Ctx) error {
		var err error
		got, err = request.ParseUUID(c, "id")
		if err != nil {
			return err
		}
		return c.SendStatus(200)
	})

	resp := doRequest(app, "GET", "/test/"+id.String(), "")
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
	if got != id {
		t.Errorf("got UUID %s, want %s", got, id)
	}
}

func TestParseUUID_Invalid(t *testing.T) {
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			if e, ok := err.(*fiber.Error); ok {
				return c.Status(e.Code).SendString(e.Message)
			}
			return c.Status(500).SendString(err.Error())
		},
	})
	app.Get("/test/:id", func(c *fiber.Ctx) error {
		_, err := request.ParseUUID(c, "id")
		return err
	})

	resp := doRequest(app, "GET", "/test/not-a-uuid", "")
	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
}

// ─── ParsePagination tests ────────────────────────────────────────────────────

func TestParsePagination_Defaults(t *testing.T) {
	app := fiber.New()
	var gotLimit, gotOffset int
	app.Get("/page", func(c *fiber.Ctx) error {
		gotLimit, gotOffset = request.ParsePagination(c)
		return c.SendStatus(200)
	})

	req := httptest.NewRequest("GET", "/page", nil)
	app.Test(req, -1)

	if gotLimit != 20 {
		t.Errorf("default limit: want 20, got %d", gotLimit)
	}
	if gotOffset != 0 {
		t.Errorf("default offset: want 0, got %d", gotOffset)
	}
}

func TestParsePagination_CustomValues(t *testing.T) {
	app := fiber.New()
	var gotLimit, gotOffset int
	app.Get("/page", func(c *fiber.Ctx) error {
		gotLimit, gotOffset = request.ParsePagination(c)
		return c.SendStatus(200)
	})

	req := httptest.NewRequest("GET", "/page?limit=50&offset=100", nil)
	app.Test(req, -1)

	if gotLimit != 50 {
		t.Errorf("want limit 50, got %d", gotLimit)
	}
	if gotOffset != 100 {
		t.Errorf("want offset 100, got %d", gotOffset)
	}
}

func TestParsePagination_CapAt100(t *testing.T) {
	app := fiber.New()
	var gotLimit int
	app.Get("/page", func(c *fiber.Ctx) error {
		gotLimit, _ = request.ParsePagination(c)
		return c.SendStatus(200)
	})

	req := httptest.NewRequest("GET", "/page?limit=999", nil)
	app.Test(req, -1)

	if gotLimit != 100 {
		t.Errorf("want capped limit 100, got %d", gotLimit)
	}
}

// ─── Error formatting test ────────────────────────────────────────────────────

func TestParse_ErrorMessageContainsFieldName(t *testing.T) {
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			if e, ok := err.(*fiber.Error); ok {
				return c.Status(e.Code).SendString(e.Message)
			}
			return c.Status(500).SendString(err.Error())
		},
	})
	app.Post("/test", func(c *fiber.Ctx) error {
		_, err := request.Parse[TestReq](c)
		return err
	})

	req := httptest.NewRequest("POST", "/test", bytes.NewBufferString(`{"email":"bad"}`))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req, -1)

	body, _ := io.ReadAll(resp.Body)
	msg := string(body)

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
	// Error message should mention at least one failing field
	if !strings.Contains(msg, "email") && !strings.Contains(msg, "password") && !strings.Contains(msg, "name") {
		t.Errorf("error message %q should contain field names", msg)
	}
}
