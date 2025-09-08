-- Migration: Create refresh_token_revocation table
-- File: migrations/001_create_refresh_token_revocation.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS refresh_token_revocation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_jti TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_revocation_user ON refresh_token_revocation(user_id);
CREATE INDEX IF NOT EXISTS idx_revocation_jti ON refresh_token_revocation(token_jti);
CREATE INDEX IF NOT EXISTS idx_revocation_revoked_at ON refresh_token_revocation(revoked_at);

-- Add comments for documentation
COMMENT ON TABLE refresh_token_revocation IS 'Stores revoked refresh tokens for security';
COMMENT ON COLUMN refresh_token_revocation.token_jti IS 'JWT ID of the revoked token';
COMMENT ON COLUMN refresh_token_revocation.user_id IS 'User who owned the token';
COMMENT ON COLUMN refresh_token_revocation.reason IS 'Reason for revocation (logout, rotation, compromise, etc.)';

-- Create cleanup function for expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_revocations()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM refresh_token_revocation 
  WHERE expires_at < now() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'INFO',
  user_id UUID,
  user_email TEXT,
  user_role TEXT,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  resource TEXT,
  action TEXT,
  result TEXT,
  details JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);

-- Create 2FA secrets table
CREATE TABLE IF NOT EXISTS user_2fa_secrets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  secret_encrypted TEXT NOT NULL,
  backup_codes_encrypted TEXT[],
  enabled BOOLEAN DEFAULT FALSE,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for 2FA secrets
CREATE INDEX IF NOT EXISTS idx_2fa_secrets_user_id ON user_2fa_secrets(user_id);

-- Create SSO providers table
CREATE TABLE IF NOT EXISTS sso_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_name TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  external_id TEXT NOT NULL,
  email TEXT,
  profile_data JSONB,
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(provider_name, external_id)
);

-- Indexes for SSO providers
CREATE INDEX IF NOT EXISTS idx_sso_providers_user_id ON sso_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_sso_providers_provider ON sso_providers(provider_name, external_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE refresh_token_revocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_2fa_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sso_providers ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth system)
CREATE POLICY "Users can view their own revocations" ON refresh_token_revocation
  FOR SELECT USING (user_id = current_setting('app.current_user_id')::UUID);

CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT USING (current_setting('app.current_user_role') = 'admin');

CREATE POLICY "Users can manage their own 2FA" ON user_2fa_secrets
  FOR ALL USING (user_id = current_setting('app.current_user_id')::UUID);

CREATE POLICY "Users can view their own SSO providers" ON sso_providers
  FOR SELECT USING (user_id = current_setting('app.current_user_id')::UUID);