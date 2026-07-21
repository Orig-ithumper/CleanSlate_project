function Invoke-CleanSlateBackup {
    param(
        [string]$DriveLetter = "Z",
        [string]$MainFolder = "Automation",
        [string]$DbName = "cleanslate",
        [string]$DbUser = "postgres",
        [string]$DbHost = "localhost",
        [string]$DbPort = "5432",
        [string]$BackupPrefix = "CleanSlate_DB_Backup",
        [int]$MaxBackups = 10
    )

    $BasePath   = "$DriveLetter:\$MainFolder"
    $BackupPath = "$BasePath\Backup"
    $LogPath    = "$BasePath\logs"
    $Timestamp  = Get-Timestamp
    $BackupFile = "$BackupPath\$BackupPrefix`_$Timestamp.sql"
    $LogFile    = "$LogPath\Backup_$Timestamp.txt"

    # Ensure folders exist
    foreach ($Folder in @($BackupPath, $LogPath)) {
        if (-not (Test-Path $Folder)) {
            New-Item -ItemType Directory -Force -Path $Folder | Out-Null
        }
    }

    Write-Log "Starting database backup for '$DbName'..." $LogFile

    # Run pg_dump
    $pgDumpCmd = "pg_dump -h $DbHost -p $DbPort -U $DbUser -F p -d $DbName -f `"$BackupFile`""

    try {
        Write-Log "Running: $pgDumpCmd" $LogFile
        & cmd.exe /c $pgDumpCmd
        Write-Log "Backup completed: $BackupFile" $LogFile
    }
    catch {
        Write-Log "Backup FAILED: $($_.Exception.Message)" $LogFile
        return
    }

    # Rotate old backups
    $files = Get-ChildItem $BackupPath -Filter "$BackupPrefix*.sql" |
             Sort-Object LastWriteTime -Descending

    if ($files.Count -gt $MaxBackups) {
        $files | Select-Object -Skip $MaxBackups | Remove-Item -Force
        Write-Log "Old backups purged (kept last $MaxBackups)." $LogFile
    }

    Write-Host "✨ Database backup complete."
}

Set-Alias cleanslate-backup Invoke-CleanSlateBackup