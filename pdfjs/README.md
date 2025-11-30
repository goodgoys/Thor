Self-hosted PDF.js viewer setup

This repository now references a self-hosted PDF.js viewer at `/pdfjs/web/viewer.html` and expects PDF.js build files under `pdfjs/build` and viewer files under `pdfjs/web`.

Because the PDF.js distribution is several MB and includes many files, follow these PowerShell steps locally to download the official PDF.js distribution and install it into this repo.

Note: Update the `PDFJS_ZIP` URL to the latest release if needed. The example below uses a release tag; check https://github.com/mozilla/pdf.js/releases for the latest.

1) From a PowerShell window in the repository root, run:

```powershell
# Set a PDF.js release zip URL (change version if needed)
$PDFJS_ZIP = 'https://github.com/mozilla/pdf.js/releases/download/v3.5.141/pdfjs-3.5.141-dist.zip'

# Download the zip
Invoke-WebRequest -Uri $PDFJS_ZIP -OutFile pdfjs-dist.zip

# Extract to a temp folder
Expand-Archive -Path pdfjs-dist.zip -DestinationPath .\pdfjs-temp

# The extracted folder name may contain the version, find it
$extracted = Get-ChildItem -Directory pdfjs-temp | Select-Object -First 1

# Move build and web folders into pdfjs/
New-Item -ItemType Directory -Path pdfjs -Force | Out-Null
Move-Item -Path (Join-Path $extracted.FullName 'build') -Destination .\pdfjs\build
Move-Item -Path (Join-Path $extracted.FullName 'web') -Destination .\pdfjs\web

# Clean up
Remove-Item -Recurse -Force pdfjs-dist.zip, pdfjs-temp

# Verify files
Get-ChildItem -Recurse pdfjs | Select-Object FullName

# Commit and push the added files (this will add several MB to your repo)
git add pdfjs
git commit -m "Add self-hosted PDF.js viewer"
git push origin main
```

2) After the push completes, visit:

    https://tradehax.net/pdfjs/web/viewer.html?file=/MichaelSFlahertyResume.pdf

You should see the full PDF.js viewer UI (toolbar, search, print, download, etc.) and the resume loaded from your domain.

If you prefer, I can add the `pdfjs/web/viewer.html` scaffolding now and you run the script above to populate `pdfjs/build` and `pdfjs/web`. If you want me to add everything but prefer to upload the PDF.js build files yourself, you can upload them and I'll commit them.

Security note: adding `pdfjs` will increase repo size by several MB. Make sure you're okay with that before committing.
