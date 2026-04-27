
# team-bulgaemi

`team-bulgaemi` is the web app codebase for 팀불개미.

This project started from a Figma-exported code bundle and is now tracked in GitHub for continued development, including the planned migration from Google Sheets to Supabase.

Original Figma file:
https://www.figma.com/design/3b0njI3aNLYWZSACKWsBDI/%ED%8C%80%EB%B6%88%EA%B0%9C%EB%AF%B8

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Team-specific local development:

```bash
npm run dev:bulgaemi
npm run dev:jjfc
```

Interactive local development:

```bash
npm run dev
```

You can also choose directly:

```bash
npm run dev -- bulgaemi
npm run dev -- jjfc
```

Team-specific production builds:

```bash
npm run build:bulgaemi
npm run build:jjfc
```

## Multi-Team Deployment

Use one codebase and create one Vercel project per team.

- Point both Vercel projects at the same Git branch.
- Give each project its own `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Override team branding with env vars from `.env.example`.
- Set `VITE_TEAM_PLAYERS` with `번호:이름;번호:이름` format.
- Optional: override player jersey colors with the `VITE_PLAYER_*` env vars.

Recommended setup:

- Existing team: keep `VITE_STORAGE_NAMESPACE=soccer`
- New team: use a different namespace such as `soccer_newteam`
- Existing team URL: current Vercel project
- New team URL: second Vercel project with its own domain/subdomain

This keeps feature updates shared while team data and branding stay separate.

Example for `jjfc`:

```env
VITE_SUPABASE_URL=https://wfnqhtsxaxnrljzmdrxl.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_M0wN_vwaBvpZzT-bKL26Fg_-jGKixnk
VITE_TEAM_NAME=JJFC
VITE_TEAM_SLUG=jjfc
VITE_APP_TITLE=JJFC
VITE_STORAGE_NAMESPACE=soccer_jjfc
VITE_DOWNLOAD_FILE_PREFIX=jjfc
```

Full env template:
- [JJFC_ENV_EXAMPLE.txt](/Users/jihwang/Documents/team-bulgaemi/JJFC_ENV_EXAMPLE.txt)
  
