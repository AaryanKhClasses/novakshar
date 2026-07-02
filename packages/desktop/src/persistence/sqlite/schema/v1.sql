CREATE TABLE IF NOT EXISTS folders(
    id TEXT PRIMARY KEY,
    parent_id TEXT NULL,
    name TEXT NOT NULL,
    color TEXT NULL,
    icon TEXT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS documents(
    id TEXT PRIMARY KEY,
    folder_id TEXT NULL,
    title TEXT NOT NULL,
    relative_path TEXT NOT NULL,
    favorite INTEGER NULL,
    deleted INTEGER NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS attachments(
    id TEXT PRIMARY KEY,
    document_id TEXT NULL,
    filename TEXT NOT NULL,
    relative_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    checksum TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tags(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS revisions(
    id TEXT PRIMARY KEY,
    document_id TEXT NULL,
    version INTEGER NOT NULL,
    checksum TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS devices(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    last_seen TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_folder ON documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_attachments_document ON attachments(document_id);
CREATE INDEX IF NOT EXISTS idx_revisions_document ON revisions(document_id);
