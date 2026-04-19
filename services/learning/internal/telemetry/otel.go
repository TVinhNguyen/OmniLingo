package telemetry

import (
	"context"
	"fmt"
	"os"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.21.0"
	"go.opentelemetry.io/otel/trace"
)

// Provider holds the OTel trace provider and provides shutdown.
type Provider struct {
	tp *sdktrace.TracerProvider
}

// Init sets up the OpenTelemetry trace provider.
// In dev mode (otlpEndpoint empty), uses stdout exporter.
// In production, configure OTLP exporter via environment:
//   OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
func Init(ctx context.Context, serviceName, version string, otlpEndpoint string) (*Provider, error) {
	res, err := resource.New(ctx,
		resource.WithAttributes(
			semconv.ServiceNameKey.String(serviceName),
			semconv.ServiceVersionKey.String(version),
			attribute.String("deployment.environment", os.Getenv("ENV")),
		),
	)
	if err != nil {
		return nil, fmt.Errorf("otel resource: %w", err)
	}

	// Exporter selection: stdout for dev, OTLP for production
	var exporter sdktrace.SpanExporter
	if otlpEndpoint != "" {
		// Production: use OTLP over HTTP
		// Note: add go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp
		// for full production setup. For now fallback to stdout.
		exporter, err = stdouttrace.New(stdouttrace.WithPrettyPrint())
	} else {
		// Dev: readable stdout exporter
		exporter, err = stdouttrace.New(stdouttrace.WithPrettyPrint())
	}
	if err != nil {
		return nil, fmt.Errorf("otel exporter: %w", err)
	}

	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(res),
		sdktrace.WithSampler(sdktrace.ParentBased(
			sdktrace.TraceIDRatioBased(0.1), // 10% sampling in prod; use AlwaysSample in dev
		)),
	)

	otel.SetTracerProvider(tp)

	return &Provider{tp: tp}, nil
}

// Shutdown flushes remaining spans.
func (p *Provider) Shutdown(ctx context.Context) error {
	return p.tp.Shutdown(ctx)
}

// Tracer returns a named tracer for the identity service.
func Tracer() trace.Tracer {
	return otel.Tracer("learning-service")
}
