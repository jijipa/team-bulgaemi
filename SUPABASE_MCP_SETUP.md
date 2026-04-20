# Supabase MCP Setup

## Status

- Supabase MCP server added
- Remote MCP client enabled
- Supabase OAuth login completed
- Supabase agent skills installed

## Config

File: `~/.codex/config.toml`

```toml
[mcp_servers.supabase]
url = "https://mcp.supabase.com/mcp?project_ref=rteqastcfrywbqxlpihb"

[mcp]
remote_mcp_client_enabled = true
```

## Verified

Command:

```bash
codex mcp list
```

Result:

- `supabase`
- `enabled`
- `OAuth`

## Installed Skills

- `supabase`
- `supabase-postgres-best-practices`

## Important

- Restart Codex to load the new MCP server in the current session
- Restart Codex to pick up the newly installed skills

## After Restart

1. Open Codex again
2. Run `/mcp`
3. Confirm `supabase` is visible

## Next Step

After restart, continue with:

- Google Sheets tab -> Supabase table mapping
- Migration checklist
- Initial schema design
