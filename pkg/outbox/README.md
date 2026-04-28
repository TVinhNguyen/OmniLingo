# pkg/outbox

Shared Transactional Outbox module for OmniLingo Go microservices.

Replaces 6 near-identical `internal/messaging/outbox.go` copies in:
`identity`, `vocabulary`, `assessment`, `billing`, `learning`, `gamification`.

## Quick start

```go
import "github.com/omnilingo/pkg/outbox"

repo   := outbox.NewRepository(db)
pub    := outbox.NewKafkaPublisher(cfg.KafkaBrokers, log)
worker := outbox.NewWorker(repo, pub, log)

go worker.Run(ctx) // start relay; exits cleanly on ctx cancel

// In service layer:
if err := repo.Enqueue(ctx, "user.registered", myEvent); err != nil { ... }
```

## Design contract

| Concern | Decision |
|---------|----------|
| Enqueue atomicity | **Non-transactional** (ADR-010 MVP1) — uses shared pool |
| Relay correctness | Worker flushes inside `pgx.Tx` — prevents double-delivery |
| Kafka library | `segmentio/kafka-go` (majority of services) |
| Worker lifecycle | **Caller-controlled** — `go worker.Run(ctx)` |
| Batch size | Default 50; configurable via `WithBatchSize(n)` |
| Poll interval | Default 5s; configurable via `WithPollInterval(d)` |

## Phase-2 ADR-010 hook

When upgrading from MVP1 to full transactional outbox:

1. Uncomment `EnqueueTx` in `repository.go`.
2. Thread `pgx.Tx` from the domain service → repository → `EnqueueTx`.
3. **This package is the only file to change** — all 6 callers inherit the fix.

## Testing

```bash
# Unit tests (no DB required):
go test ./...

# Integration tests (requires Postgres + Kafka — uses testcontainers-go):
go test -tags integration ./...
```

## Known limitations (MVP1)

### Dead-letter: events stuck after 5 attempts

Events with `attempts >= 5` are excluded from polling and silently abandoned.
There is no dead-letter queue or alerting in MVP1.

**Operational implication**: A corrupt or permanently-undeliverable event will
stop retrying without any log or metric. Monitor the DB column directly:

```sql
SELECT COUNT(*) FROM outbox_events WHERE sent_at IS NULL AND attempts >= 5;
```

**Phase-2 fix plan** (BUG-13):
- Add Prometheus metric `outbox_dead_letter_total` on failed flush.
- Create a DLQ table or move to a separate Kafka dead-letter topic.
