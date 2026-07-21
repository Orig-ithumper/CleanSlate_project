# --- CleanSlate Project Permission Fixer ---
# Run this script as Administrator
# 1️⃣ Moves project out of OneDrive if necessary
# 2️⃣ Removes read-only flags recursively
# 3️⃣ Grants full control to the current user

# Define original and target paths
$originalPath = "C:\Users\$env:USERNAME\Documents\cleanslateapp"
$targetRoot   = "C:\Projects"
$targetPath   = Join-Path $targetRoot "cleanslateapp"

# Ensure target root exists
if (!(Test-Path $targetRoot)) {
    New-Item -ItemType Directory -Path $targetRoot | Out-Null
}

# Detect if project is under OneDrive
if ($originalPath -match "OneDrive") {
    Write-Host "Detected OneDrive path... moving project to $targetPath" -ForegroundColor Yellow

    # Stop OneDrive temporarily if running
    $onedrive = Get-Process OneDrive -ErrorAction SilentlyContinue
    if ($onedrive) {
        Write-Host "Pausing OneDrive Sync..."
        Stop-Process -Name OneDrive -Force
    }

    Move-Item -Path $originalPath -Destination $targetPath -Force
} else {
    # If not in OneDrive, just use existing path
    if (Test-Path $originalPath) {
        $targetPath = $originalPath
    } else {
        Write-Host "Project folder not found." -ForegroundColor Red
        exit
    }
}

# --- Remove read-only flags recursively ---
Write-Host "Removing read-only attributes recursively..."
Get-ChildItem -Path $targetPath -Recurse -Force | ForEach-Object {
    if ($_.Attributes -band [System.IO.FileAttributes]::ReadOnly) {
        $_.Attributes = 'Normal'
    }
}
attrib -r "$targetPath" /s /d

# --- Reset NTFS permissions ---
Write-Host "Resetting NTFS permissions for current user..." -ForegroundColor Green
$acl = Get-Acl $targetPath
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule("$env:USERNAME","FullControl","ContainerInherit, ObjectInherit","None","Allow")
$acl.SetAccessRuleProtection($false,$true)   # Disable inheritance blocking
$acl.AddAccessRule($rule)
Set-Acl -Path $targetPath -AclObject $acl

# --- Confirm ---
Write-Host "`n✅ Permissions & attributes fixed for: $targetPath"
Write-Host "You can now run: cd '$targetPath' && npm run dev"
