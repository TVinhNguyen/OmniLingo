// Package outbox implements the Transactional Outbox pattern for reliable
// Kafka event publishing via a Postgres-backed relay worker.
//
// Design contract (ADR-010 MVP1):
//   - Enqueue is NOT atomic with the caller's domain write — it uses the shared
//     pool, not a pgx.Tx. This is acceptable for MVP1.
//   - The relay worker flushes pending events inside a pgx.Tx for correctness:
//     the SELECT FOR UPDATE SKIP LOCKED + status updates are wrapped atomically.
//   - Phase 2 hook: to make Enqueue atomic, add EnqueueTx(ctx, pgx.Tx, ...) in
//     this package only — callers inherit the fix automatically.
//
// Usage:
//
//	repo := outbox.NewRepository(db)
//	worker := outbox.NewWorker(repo, outbox.NewKafkaPublisher(brokers), log)
//	go worker.Run(ctx) // exits cleanly on ctx cancel
//
//	// In service layer:
//	if err := repo.Enqueue(ctx, "user.registered", event); err != nil { ... }
package outbox
