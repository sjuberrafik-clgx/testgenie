# Reimagine Space Test Runner
# Simple script to run Playwright tests

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Reimagine Space Test Runner" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check if Playwright browsers are installed
Write-Host "Checking Playwright installation..." -ForegroundColor Yellow
npx playwright install chromium --dry-run 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing Playwright browsers..." -ForegroundColor Yellow
    npx playwright install chromium
}

# Clean up test-results if it exists and is locked
if (Test-Path "test-results") {
    Write-Host "Cleaning old test results..." -ForegroundColor Yellow
    try {
        Remove-Item -Path "test-results" -Recurse -Force -ErrorAction Stop
    } catch {
        Write-Host "Could not remove test-results folder (it may be in use). Attempting to continue..." -ForegroundColor Yellow
        # Try to unlock by killing any processes that might be holding it
        Get-ChildItem "test-results" -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
            try {
                Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
            } catch { }
        }
    }
}

Write-Host ""
Write-Host "What would you like to run?" -ForegroundColor Green
Write-Host "  1. Diagnostic Tests (Recommended first run)" -ForegroundColor White
Write-Host "  2. Main Reimagine Space Tests (Headless)" -ForegroundColor White
Write-Host "  3. Main Reimagine Space Tests (Headed - visible browser)" -ForegroundColor White
Write-Host "  4. Debug Mode (Step through tests)" -ForegroundColor White
Write-Host "  5. UI Mode (Interactive)" -ForegroundColor White
Write-Host "  6. View Last Test Report" -ForegroundColor White
Write-Host "  7. Run Specific Test (by name)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-7)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Running Diagnostic Tests..." -ForegroundColor Cyan
        npx playwright test diagnostic.spec.ts --headed
    }
    "2" {
        Write-Host ""
        Write-Host "Running Main Tests (Headless)..." -ForegroundColor Cyan
        npx playwright test ReimagineSpace_Automation.spec.ts
    }
    "3" {
        Write-Host ""
        Write-Host "Running Main Tests (Headed)..." -ForegroundColor Cyan
        npx playwright test ReimagineSpace_Automation.spec.ts --headed
    }
    "4" {
        Write-Host ""
        Write-Host "Running in Debug Mode..." -ForegroundColor Cyan
        Write-Host "Use Playwright Inspector to step through tests" -ForegroundColor Yellow
        npx playwright test ReimagineSpace_Automation.spec.ts --debug
    }
    "5" {
        Write-Host ""
        Write-Host "Running in UI Mode..." -ForegroundColor Cyan
        npx playwright test ReimagineSpace_Automation.spec.ts --ui
    }
    "6" {
        Write-Host ""
        Write-Host "Opening Test Report..." -ForegroundColor Cyan
        npx playwright show-report
    }
    "7" {
        Write-Host ""
        $testName = Read-Host "Enter test name or pattern to search"
        Write-Host "Running tests matching: $testName" -ForegroundColor Cyan
        npx playwright test ReimagineSpace_Automation.spec.ts -g "$testName" --headed
    }
    default {
        Write-Host ""
        Write-Host "Invalid choice. Running diagnostic tests by default..." -ForegroundColor Yellow
        npx playwright test diagnostic.spec.ts --headed
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Test execution completed" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view the HTML report, run:" -ForegroundColor Yellow
Write-Host "  npx playwright show-report" -ForegroundColor White
Write-Host ""
