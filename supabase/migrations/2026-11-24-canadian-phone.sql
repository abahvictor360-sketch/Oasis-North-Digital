-- =============================================================================
-- Switch the public phone and WhatsApp number to the Canadian line.
-- Only profile.phone and profile.phoneRaw change; nothing else is touched.
-- =============================================================================

update site_settings set
  profile = coalesce(profile, '{}'::jsonb) || '{"phone":"+1 902 593 4442","phoneRaw":"19025934442"}'::jsonb,
  updated_at = now()
where id = 1;
