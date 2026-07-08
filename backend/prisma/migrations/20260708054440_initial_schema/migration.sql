-- CreateTable
CREATE TABLE "log_entries" (
    "id" UUID NOT NULL,
    "actor" VARCHAR(100) NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "payload" JSONB NOT NULL,
    "previousHash" CHAR(64) NOT NULL,
    "hash" CHAR(64) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "log_entries_hash_key" ON "log_entries"("hash");

-- CreateIndex
CREATE INDEX "log_entries_actor_idx" ON "log_entries"("actor");

-- CreateIndex
CREATE INDEX "log_entries_createdAt_idx" ON "log_entries"("createdAt");

-- CreateIndex
CREATE INDEX "log_entries_createdAt_id_idx" ON "log_entries"("createdAt" DESC, "id" DESC);
