# enable_pages.ps1
# Usage: run from repo root with $env:GITHUB_TOKEN set
$headers = @{
  Authorization = "Bearer $env:GITHUB_TOKEN"
  Accept = 'application/vnd.github+json'
  'User-Agent' = 'ps'
}

Write-Output "GITHUB_TOKEN present: " + ([string]::IsNullOrEmpty($env:GITHUB_TOKEN) -eq $false)

function TryInvoke($scriptblock, $label) {
  try {
    & $scriptblock
  } catch {
    Write-Output "$label ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
      try { $code = $_.Exception.Response.StatusCode.Value__ } catch { $code = 'unknown' }
      Write-Output "$label HTTP status: $code"
    }
  }
}

# Create/enable Pages
TryInvoke {
  $body = @{ source = @{ branch = 'main'; path = '/' } } | ConvertTo-Json
  $resp = Invoke-RestMethod -Method Post -Uri 'https://api.github.com/repos/ShamrocksStocks/shamrockstocks.github.io/pages' -Headers $headers -Body $body -ErrorAction Stop
  Write-Output "CREATE OK:`n" + ($resp | Select-Object url, html_url, cname | ConvertTo-Json -Depth 4)
} 'Create'

Start-Sleep -Seconds 2

# Get Pages status
TryInvoke {
  $status = Invoke-RestMethod -Uri 'https://api.github.com/repos/ShamrocksStocks/shamrockstocks.github.io/pages' -Headers $headers -ErrorAction Stop
  Write-Output "STATUS:`n" + ($status | ConvertTo-Json -Depth 6)
} 'Status'

Start-Sleep -Seconds 1

# Get builds
TryInvoke {
  $builds = Invoke-RestMethod -Uri 'https://api.github.com/repos/ShamrocksStocks/shamrockstocks.github.io/pages/builds' -Headers $headers -ErrorAction Stop
  Write-Output "BUILDS:`n" + ($builds | Select-Object -First 5 | ConvertTo-Json -Depth 6)
} 'Builds'

Start-Sleep -Seconds 1

# Check site URLs
TryInvoke {
  $r1 = Invoke-WebRequest -Uri 'https://shamrockstocks.github.io/' -UseBasicParsing -TimeoutSec 30 -ErrorAction Stop
  Write-Output "shamrockstocks.github.io HTTP status: $($r1.StatusCode)"
} 'shamrockstocks'

Start-Sleep -Seconds 1

TryInvoke {
  $r2 = Invoke-WebRequest -Uri 'https://tradehax.net/' -UseBasicParsing -TimeoutSec 30 -ErrorAction Stop
  Write-Output "tradehax.net HTTP status: $($r2.StatusCode)"
} 'tradehax'

Write-Output 'SCRIPT DONE'
