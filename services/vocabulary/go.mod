module github.com/omnilingo/vocabulary-service

go 1.22

require (
	github.com/gofiber/fiber/v2 v2.52.5
	github.com/golang-jwt/jwt/v5 v5.3.1
	github.com/google/uuid v1.6.0
	github.com/jackc/pgx/v5 v5.6.0
	github.com/mattn/go-sqlite3 v1.14.22
	github.com/pressly/goose/v3 v3.21.1
	github.com/prometheus/client_golang v1.19.1
	github.com/redis/go-redis/v9 v9.5.3
	github.com/twmb/franz-go v1.17.0
	github.com/valyala/fasthttp v1.51.0
	go.uber.org/zap v1.27.1
)

require (
	github.com/gabriel-vasile/mimetype v1.4.3 // indirect
	github.com/go-playground/locales v0.14.1 // indirect
	github.com/go-playground/universal-translator v0.18.1 // indirect
	github.com/go-playground/validator/v10 v10.22.0 // indirect
	github.com/leodido/go-urn v1.4.0 // indirect
	github.com/segmentio/kafka-go v0.4.47 // indirect
	golang.org/x/net v0.23.0 // indirect
)

require (
	github.com/andybalholm/brotli v1.0.6 // indirect
	github.com/beorn7/perks v1.0.1 // indirect
	github.com/cespare/xxhash/v2 v2.2.0 // indirect
	github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	github.com/klauspost/compress v1.17.9 // indirect
	github.com/mattn/go-colorable v0.1.13 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/mattn/go-runewidth v0.0.15 // indirect
	github.com/mfridman/interpolate v0.0.2 // indirect
	github.com/omnilingo/pkg/outbox v0.0.0
	github.com/pierrec/lz4/v4 v4.1.21 // indirect
	github.com/prometheus/client_model v0.5.0 // indirect
	github.com/prometheus/common v0.48.0 // indirect
	github.com/prometheus/procfs v0.12.0 // indirect
	github.com/rivo/uniseg v0.4.3 // indirect
	github.com/sethvargo/go-retry v0.2.4 // indirect
	github.com/twmb/franz-go/pkg/kmsg v1.8.0 // indirect
	github.com/valyala/bytebufferpool v1.0.0 // indirect
	github.com/valyala/tcplisten v1.0.0 // indirect
	go.uber.org/multierr v1.11.0 // indirect
	golang.org/x/crypto v0.24.0 // indirect
	golang.org/x/sync v0.7.0 // indirect
	golang.org/x/sys v0.21.0 // indirect
	golang.org/x/text v0.16.0 // indirect
	google.golang.org/protobuf v1.34.1 // indirect
)

replace github.com/omnilingo/pkg/outbox => ../../pkg/outbox

require github.com/omnilingo/pkg/request v0.0.0

replace github.com/omnilingo/pkg/request => ../../pkg/request
