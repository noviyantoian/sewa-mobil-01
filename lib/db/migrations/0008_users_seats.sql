-- 0008: per-tenant user seats + verification attribution
--
-- Seat limit per plan tier (docs/PRICING.md): starter 1, growth 3, business 10,
-- enterprise unlimited (NULL = no cap). The admin "Pengguna & Peran" page gates
-- adding members against the active tenant's plan.max_users.
ALTER TABLE plans ADD COLUMN IF NOT EXISTS max_users integer;
UPDATE plans SET max_users = 1 WHERE id = 'starter';
UPDATE plans SET max_users = 3 WHERE id = 'growth';
UPDATE plans SET max_users = 10 WHERE id = 'business';
UPDATE plans SET max_users = NULL WHERE id = 'enterprise';

-- Verification attribution: who approved/rejected an identity doc, and when.
-- `verified_by` stores the admin's email (auth identity) for an audit trail.
ALTER TABLE documents ADD COLUMN IF NOT EXISTS verified_by text;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS verified_at timestamptz;
