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

## Page view counter (CountAPI)

This site includes a lightweight CountAPI-based page view counter.

- Script: `scripts/countapi.js` — increments/reads a CountAPI counter and updates the DOM.
- Default behavior: a small, global site counter is shown in the footer (`Views: <span id="page-count">`).
- Configuration:
	- Change the initialization in `index.html` to use `keyStrategy: 'path'` for per-page counters or `keyStrategy: 'meta'` to read a meta tag key.
	- Disable the counter per-page by adding `<meta name="countapi-enabled" content="false">`.
	- Provide a custom namespace by editing the `namespace` option in the init call (default used in PR: `goodgoys-thor`).

The project includes small Node tests (`tests/run_tests.js`) and a `npm test` script that runs them.
