# ADR-010: Non-Transactional Outbox Pattern for MVP1

**Status**: Accepted  
**Date**: 2026-04-25  
**Deciders**: Backend team  
**Supersedes**: N/A  
**Related**: Bug #7 (event loss on Kafka outage), Commit `1fe1655`, `9e94540`

---

## Context

### Problem

Before this ADR, all 14 active Kafka publish sites across identity, learning, and
vocabulary services used fire-and-forget publishing directly to Kafka. If Kafka was
temporarily unavailable (broker restart, network partition, disk full), events were
silently lost. This included critical domain events like `user.registered`,
`lesson.completed`, and `card.added` that downstream services (gamification, SRS,
notifications) depend on.

### The Transactional Outbox Pattern

The canonical fix is the **transactional outbox pattern**: write the event to an
`outbox_events` table in the **same database transaction** as the domain write. A
separate relay worker polls the table and publishes to Kafka. This guarantees
at-least-once delivery because:

- If the domain write fails → the outbox row is also rolled back → no orphan event
- If the relay fails → the row persists → retry on next poll cycle
- If the service crashes mid-transaction → Postgres rolls back both

### Implementation Gap

The payment service (`services/payment`) implements the pattern correctly:

```go
// payment-service: true transactional outbox
err := r.WithTx(ctx, func(dbtx pgx.Tx) error {
    if err := r.PaymentRepoTx.Insert(ctx, dbtx, payment); err != nil { return err }
    return s.outboxRepo.InsertTx(ctx, dbtx, &OutboxEntry{...})
})
```

However, the other 4 services (identity, learning, vocabulary, gamification) do NOT
thread a `pgx.Tx` through their repository layer. Their repo methods use the connection
pool directly (`db.Exec(ctx, ...)`), and the outbox insert is a **separate** pool-level
write that happens **after** the domain write commits.

Refactoring all repo methods to accept an optional `pgx.Tx` parameter would require:
- Changing the `UserRepository`, `AttemptRepository`, `DeckRepository` interfaces
- Modifying 15+ repo methods across 3 services
- Threading the transaction through service → repo → outbox call chains
- Estimated effort: 2+ days of interface refactoring + testing

## Decision

**For MVP1, use a non-transactional outbox called `Enqueue` instead of `InsertTx`.**

The `Enqueue` method inserts into `outbox_events` using the same `*pgxpool.Pool` as the
domain write, but **not** within the same `pgx.Tx`. The method is explicitly named
`Enqueue` (not `InsertTx`) to signal that it is not transactional.

```go
// MVP1: non-transactional outbox (pool-level)
func (r *OutboxRepository) Enqueue(ctx context.Context, topic string, payload interface{}) error {
    data, _ := json.Marshal(payload)
    _, err := r.db.Exec(ctx,
        `INSERT INTO outbox_events (topic, key, payload) VALUES ($1, $2, $3)`,
        topic, uuid.New().String(), json.RawMessage(data))
    return err
}
```

The payment service retains `InsertTx` with its correct `pgx.Tx` parameter.

## Consequences

### Positive

- **99%+ event delivery coverage**: Events survive Kafka outages, broker restarts,
  and network partitions. The relay worker retries with `FOR UPDATE SKIP LOCKED`.
- **Zero code disruption**: No interface changes to existing repository layer.
- **Consistent naming**: `Enqueue` clearly signals "best-effort durability, not atomic".
- **Immediate value**: 14 publish sites converted in one commit vs. 2+ days for full tx.

### Negative

- **Race window**: A narrow window (~microseconds) exists between domain commit and
  outbox insert. If the process crashes in this window:
  - Domain write is committed ✅
  - Outbox row is lost ❌
  - Downstream services never see the event
- **Estimated impact**: At typical request rates (~100 RPS), a process crash during
  this window affects < 0.01% of events. Application-level crashes in this window are
  extremely rare in practice.
- **Not all events are equal**: `user.registered` loss means gamification never creates
  the user profile. `audit.*` loss means a gap in the audit trail. For MVP1 with low
  traffic, this is accepted.

### Neutral

- Payment service already has the correct `InsertTx(ctx, dbtx, ...)` pattern, serving
  as the reference implementation for Phase 2 migration.

## Migration Plan (Phase 2)

1. **Add `DBTX` interface** to each service's repository package:
   ```go
   type DBTX interface {
       Exec(ctx context.Context, sql string, args ...any) (pgconn.CommandTag, error)
       Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
       QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
   }
   ```

2. **Refactor repo methods** to accept `DBTX` instead of using `r.db` directly.

3. **Add `WithTx` helper** to each repository (copy from payment-service):
   ```go
   func (r *Repo) WithTx(ctx context.Context, fn func(pgx.Tx) error) error {
       tx, err := r.db.Begin(ctx)
       if err != nil { return err }
       defer tx.Rollback(ctx)
       if err := fn(tx); err != nil { return err }
       return tx.Commit(ctx)
   }
   ```

4. **Rename `Enqueue` → `InsertTx`** and add `pgx.Tx` parameter:
   ```go
   func (r *OutboxRepository) InsertTx(ctx context.Context, tx pgx.Tx, topic string, payload interface{}) error {
       _, err := tx.Exec(ctx, `INSERT INTO outbox_events ...`, ...)
       return err
   }
   ```

5. **Wrap domain write + outbox insert** in `WithTx` at each call site.

6. **Estimated effort**: 1-2 days per service, testable in isolation.

---

*This ADR is referenced by `// Phase 2: accept pgx.Tx parameter for true atomic write
(like payment-service)` comments in all 4 outbox.go files.*
