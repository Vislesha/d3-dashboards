#!/usr/bin/env pwsh

<#
.SYNOPSIS
Validates local environment prerequisites for initializing the Angular workspace.

.DESCRIPTION
Checks Node.js and npm availability, verifies minimum version requirements,
confirms that the workspace directory is clean (no pre-existing Angular files),
and ensures that Angular CLI v20.2.0 can be invoked via npx.

.PARAMETER Json
Outputs validation results as JSON (pass/fail and messages).

.EXAMPLE
pwsh ./scripts/setup/validate-environment.ps1

.EXAMPLE
pwsh ./scripts/setup/validate-environment.ps1 -Json
#>

[CmdletBinding()]
param(
    [switch]$Json
)

$ErrorActionPreference = 'Stop'

function Write-Result {
    param(
        [bool]$Success,
        [string]$Message
    )

    if ($Json) {
        [PSCustomObject]@{
            success = $Success
            message = $Message
        } | ConvertTo-Json -Compress
    } else {
        if ($Success) {
            Write-Host "[PASS] $Message" -ForegroundColor Green
        } else {
            Write-Host "[FAIL] $Message" -ForegroundColor Red
        }
    }
}

function Fail {
    param([string]$Message)

    Write-Result -Success $false -Message $Message
    exit 1
}

function Parse-Version {
    param([string]$VersionString)

    if (-not $VersionString) {
        return $null
    }

    $normalized = $VersionString.Trim()
    if ($normalized.StartsWith('v')) {
        $normalized = $normalized.Substring(1)
    }

    try {
        return [System.Version]$normalized
    } catch {
        return $null
    }
}

$minimumNodeVersion = [System.Version]'20.13.0'

try {
    $nodeOutput = & node --version 2>$null
} catch {
    Fail "Node.js is not installed or not accessible in PATH."
}

if ($LASTEXITCODE -ne 0 -or -not $nodeOutput) {
    Fail "Failed to retrieve Node.js version. Ensure Node.js is installed."
}

$nodeVersion = Parse-Version -VersionString $nodeOutput
if (-not $nodeVersion) {
    Fail "Unable to parse Node.js version from output: '$nodeOutput'."
}

if ($nodeVersion -lt $minimumNodeVersion) {
    Fail "Node.js version $($nodeVersion.ToString()) detected. Version 20.13.0 or higher is required."
}

Write-Result -Success $true -Message "Node.js version $($nodeVersion.ToString()) detected."

try {
    $npmOutput = & npm --version 2>$null
} catch {
    Fail "npm is not installed or not accessible in PATH."
}

if ($LASTEXITCODE -ne 0 -or -not $npmOutput) {
    Fail "Failed to retrieve npm version. Ensure npm is installed."
}

Write-Result -Success $true -Message "npm version $($npmOutput.Trim()) detected."

$conflictingPaths = @('angular.json', 'package.json', 'projects', 'src')
$existingConflicts = @()

foreach ($path in $conflictingPaths) {
    if (Test-Path -Path $path) {
        $existingConflicts += $path
    }
}

if ($existingConflicts.Count -gt 0) {
    $conflictList = $existingConflicts -join ', '
    Fail "Conflicting files/directories found: $conflictList. Remove or relocate them before running setup."
} else {
    Write-Result -Success $true -Message "No conflicting Angular workspace files detected."
}

try {
    $ngVersionOutput = & npx --yes @angular/cli@20.2.0 version 2>&1
} catch {
    Fail "Failed to execute Angular CLI v20.2.0 via npx. Ensure internet connectivity and npm access."
}

if ($LASTEXITCODE -ne 0) {
    Fail ("Angular CLI v20.2.0 check failed with output:`n{0}" -f $ngVersionOutput)
}

Write-Result -Success $true -Message "Angular CLI v20.2.0 is accessible via npx."

Write-Result -Success $true -Message "Environment validation successful. Ready for workspace initialization."

