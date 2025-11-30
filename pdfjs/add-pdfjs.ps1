<#
Add the full PDF.js distribution (web + build) to this repo using npm.

Run this script from the repository root (where `.git` lives):

  pwsh -ExecutionPolicy Bypass -File .\pdfjs\add-pdfjs.ps1

This will:
- ensure `npm` exists
- `npm install pdfjs-dist@latest --no-save`
- copy `node_modules/pdfjs-dist/web` -> `pdfjs/web`
- copy `node_modules/pdfjs-dist/build` -> `pdfjs/build`
- remove the temporary `node_modules/pdfjs-dist` folder
- commit and push the new files

Be aware: this will create a large commit containing pdf.js distribution files.
#>

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm not found. Install Node.js (which includes npm) and re-run this script."
    exit 1
}

Write-Output "Installing pdfjs-dist (no-save)..."
npm install pdfjs-dist@latest --no-save

Write-Output "Preparing destination folders..."
New-Item -ItemType Directory -Force .\pdfjs | Out-Null

Write-Output "Copying web and build folders from node_modules..."
if (-Not (Test-Path .\node_modules\pdfjs-dist)) {
    Write-Error "pdfjs-dist not found under node_modules. npm install may have failed."
    exit 2
}

Copy-Item -Recurse -Force .\node_modules\pdfjs-dist\web .\pdfjs\web
Copy-Item -Recurse -Force .\node_modules\pdfjs-dist\build .\pdfjs\build

Write-Output "Cleaning up node_modules/pdfjs-dist..."
Remove-Item -Recurse -Force .\node_modules\pdfjs-dist

Write-Output "Staging files for commit..."
git add pdfjs/web pdfjs/build

Write-Output "Creating git commit..."
git commit -m "Add pdf.js web and build for self-hosted viewer" || Write-Output "No changes to commit or commit failed."

Write-Output "Pushing to origin/main..."
git push origin main

Write-Output "Done. After the push finishes, test the viewer at:`nhttps://tradehax.net/pdfjs/web/viewer.html?file=/MichaelSFlahertyResume.pdf"
