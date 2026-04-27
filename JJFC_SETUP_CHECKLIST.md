# JJFC Setup Checklist

This setup is for the new `jjfc` project only.
It does not modify the existing `team-bulgaemi` Vercel project or the existing Bulgaemi Supabase project.

## Already done

- `jjfc` Vercel project created
- `https://jjfc.vercel.app` deployed
- `jjfc` production env vars added
- Team-specific players configured through env vars

## Still required

The new Supabase project is reachable, but the app tables do not exist yet.
Confirmed error:

```text
Could not find the table 'public.matches' in the schema cache
```

## One-time action in Supabase Dashboard

1. Open the `JJFC` Supabase project
2. Go to `SQL Editor`
3. Create a new query
4. Paste the full contents of [JJFC_SUPABASE_SETUP.sql](/Users/jihwang/Documents/team-bulgaemi/JJFC_SUPABASE_SETUP.sql)
5. Run it once

## Expected result after SQL runs

- `public.matches`
- `public.scores`
- `public.participants`
- `public.moms`
- `public.goal_events`
- storage bucket `match-images`

## Fast verification

After running the SQL, this request should stop returning `PGRST205` and return `200` or `[]` instead:

```bash
curl -s -D - 'https://wfnqhtsxaxnrljzmdrxl.supabase.co/rest/v1/matches?select=id&limit=1' \
  -H 'apikey: sb_publishable_M0wN_vwaBvpZzT-bKL26Fg_-jGKixnk' \
  -H 'Authorization: Bearer sb_publishable_M0wN_vwaBvpZzT-bKL26Fg_-jGKixnk'
```
