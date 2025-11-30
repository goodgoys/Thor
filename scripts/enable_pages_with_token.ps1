<#
enable_pages_with_token.ps1

Wrapper that ensures a session GITHUB_TOKEN is present and then calls
`enable_pages.ps1` (which performs the Pages API calls). This script
never stores the token on disk.

Usage (from repo root):
    .\scripts\enable_pages_with_token.ps1

The script will prompt to set the token interactively if $env:GITHUB_TOKEN
is not present in the current session.
#>

# If token missing, run the interactive setter
if (-not $env:GITHUB_TOKEN) {
    Write-Host 'GITHUB_TOKEN is not set in this session. Running interactive token setter...'
    $setter = Join-Path -Path $PSScriptRoot -ChildPath 'set_github_token.ps1'
    if (Test-Path $setter) {
        & $setter
    } else {
        Write-Error "Token setter not found at $setter. Create one or set `\$env:GITHUB_TOKEN` in this session and retry."
        exit 1
    }
}

if (-not $env:GITHUB_TOKEN) {
    Write-Error 'GITHUB_TOKEN still not set. Aborting.'
    exit 1
}

# Run the existing enable_pages script (it uses $env:GITHUB_TOKEN)
$enable = Join-Path -Path $PSScriptRoot -ChildPath 'enable_pages.ps1'
if (-not (Test-Path $enable)) {
    Write-Error "enable_pages.ps1 not found at $enable. Make sure the script exists in scripts/"
    exit 1
}

Write-Host 'Running Pages enable script...'
pwsh -NoProfile -NonInteractive -ExecutionPolicy Bypass -File $enable
