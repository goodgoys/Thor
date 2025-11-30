<#
set_github_token.ps1

Prompt for a GitHub Personal Access Token (PAT) securely and set it
as the `GITHUB_TOKEN` environment variable for the current PowerShell
session only. This avoids writing secrets to disk.

Usage: run from the repository root (PowerShell)
    .\scripts\set_github_token.ps1

After running, the token will be available to other scripts in this
PowerShell session as `$env:GITHUB_TOKEN`.
#>

# Prompt for token (hidden)
$secure = Read-Host 'Paste your GitHub Personal Access Token (hidden input)' -AsSecureString

# Convert SecureString to plain text for this session only
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
    $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
    if ([string]::IsNullOrWhiteSpace($plain)) {
        Write-Error 'No token provided. Aborting.'
        exit 1
    }
    # Set environment variable for current process
    $env:GITHUB_TOKEN = $plain
    Write-Host 'GITHUB_TOKEN set for current session.'
} finally {
    # Clear the unmanaged memory
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
}

# Quick verification (does not print token)
if ($env:GITHUB_TOKEN) { Write-Host 'Token present (session). You can now run the wrapper to enable Pages.' }
else { Write-Error 'Failed to set token.' }
