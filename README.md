# shamrockstocks.github.io
landing page temp

## Developer setup: Git hooks

This repository includes a `.githooks` directory with a sample `pre-commit` hook used to regenerate image assets before committing.

To enable hooks for your local clone, run the appropriate installer below from the repository root:

- Windows / PowerShell:

```powershell
pwsh .\scripts\install-hooks.ps1
```

- POSIX (macOS / Linux / WSL):

```bash
sh ./scripts/install-hooks.sh
```

Or set the config manually:

```bash
git config core.hooksPath .githooks
git add .githooks/pre-commit
git update-index --chmod=+x .githooks/pre-commit
```

The installer scripts are idempotent and safe to re-run.

## Enable GitHub Pages (automation)

You can enable the repository Pages site automatically using a small manual workflow that calls the Pages REST API.

- Create a Personal Access Token (classic) with the `repo` scope (and `workflow` if you plan to trigger workflows programmatically).
- In the repository > Settings > Secrets > Actions, add a new secret named `PAGES_PAT` with that token as the value.

To run the workflow from the Actions UI, open the repository Actions tab, select "Enable GitHub Pages", then click "Run workflow" and choose `main` as the branch.

If you prefer the command line and have the GitHub CLI installed and authenticated, run:

```powershell
gh workflow run pages-enable.yml --repo ShamrocksStocks/shamrockstocks.github.io --ref main
```

Notes:
- The workflow uses the `PAGES_PAT` secret to call the Pages API and will poll briefly until the site is published. If the secret is not set the job will fail with a helpful message.
- For security, do NOT commit PATs into the repository. Use repository secrets or the interactive scripts in `scripts/`.
