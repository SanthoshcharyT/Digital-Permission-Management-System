-- Schema for the Digital Permission Management System on Supabase (Postgres).
-- Apply with `npm run db:setup`, or paste into the Supabase SQL Editor. Safe to run more than once.

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'faculty')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS request_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    date_time TIMESTAMP NOT NULL, -- leave start as the student entered it (local wall-clock time)
    file_path VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Need More Info')),
    faculty_comment TEXT,
    faculty_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES request_categories(id) ON DELETE CASCADE,
    expected_duration_days INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_requests_student ON requests(student_id);
CREATE INDEX IF NOT EXISTS idx_requests_faculty ON requests(faculty_id);

-- Keep updated_at current on every change
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS requests_updated_at ON requests;
CREATE TRIGGER requests_updated_at BEFORE UPDATE ON requests
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Supabase also exposes public tables through its REST API using the anon key.
-- This app only talks to the database from the server, so enable Row Level Security
-- with no policies: the REST API sees nothing, while the server's direct connection is unaffected.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Default categories for a fresh database
INSERT INTO request_categories (name, description)
SELECT * FROM (VALUES
    ('Medical Leave', 'Leave for medical reasons, health checkups, or medical emergencies'),
    ('Personal Leave', 'Leave for personal reasons, family functions, or personal commitments'),
    ('Academic Leave', 'Leave for academic purposes, conferences, competitions, or educational events'),
    ('Emergency Leave', 'Leave for urgent or emergency situations requiring immediate attention'),
    ('Other', 'Any other type of leave not covered by the above categories')
) AS defaults(name, description)
WHERE NOT EXISTS (SELECT 1 FROM request_categories);
