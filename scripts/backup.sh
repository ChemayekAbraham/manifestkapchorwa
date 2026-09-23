#!/bin/bash
# ==========================================================
# Manifest Kapchorwa - PostgreSQL Database Backup Script
# ==========================================================

set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${BACKUP_DIR:-./backups}"
BACKUP_FILE="${BACKUP_DIR}/manifest_kapchorwa_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set."
  exit 1
fi

echo "📦 Starting compressed database backup for Manifest Kapchorwa..."
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"

FILESIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
echo "✅ Database backup created successfully: ${BACKUP_FILE} (${FILESIZE})"

# Auto-purge local backups older than 30 days
find "$BACKUP_DIR" -type f -name "manifest_kapchorwa_*.sql.gz" -mtime +30 -exec rm {} \; 2>/dev/null || true
echo "🧹 Old backups cleaned."
