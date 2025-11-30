Scripts for safely enabling GitHub Pages via API

Files added:
- `set_github_token.ps1` — interactive prompt to set `$env:GITHUB_TOKEN` for the current session.
- `enable_pages_with_token.ps1` — wrapper that ensures the token is set and runs `enable_pages.ps1`.
- `enable_pages.ps1` (already present) — performs the Pages API calls (create/status/builds) and site checks.

Recommended workflow (safer than putting token in files):
1. Open PowerShell in the repo root.
2. Run the interactive setter (it will hide input):
   ```powershell
   .\scripts\set_github_token.ps1
   ```
   This sets `$env:GITHUB_TOKEN` only for the current PowerShell session.

3. Run the wrapper to enable Pages:
   ```powershell
   .\scripts\enable_pages_with_token.ps1
   ```

4. When finished, clear the token from the session:
   ```powershell
   Remove-Item Env:\GITHUB_TOKEN
   ```

Security notes:
- Do NOT store PATs in files checked into the repository.
- Prefer `gh auth login` or the interactive setter above.
- If you accidentally paste a token into chat or commit it, revoke it immediately at https://github.com/settings/tokens.

If you'd still like a file template where you will paste the token (not recommended), tell me and I can add a `pat.template` file and a `.gitignore` entry, but I strongly recommend using the interactive setter instead.
