# Clean Up Test Results and Reports

Write-Host "Cleaning up test artifacts..." -ForegroundColor Cyan
Write-Host ""

# Clean test-results
if (Test-Path "test-results") {
    Write-Host "Removing test-results..." -ForegroundColor Yellow
    cmd /c 'rmdir /s /q "test-results"' 2>$null
    if (-not (Test-Path "test-results")) {
        Write-Host "  Successfully removed" -ForegroundColor Green
    } else {
        Write-Host "  Could not remove (may be in use)" -ForegroundColor Red
    }
} else {
    Write-Host "test-results does not exist" -ForegroundColor Gray
}

Write-Host ""

# Clean playwright-report
if (Test-Path "playwright-report") {
    Write-Host "Removing playwright-report..." -ForegroundColor Yellow
    cmd /c 'rmdir /s /q "playwright-report"' 2>$null
    if (-not (Test-Path "playwright-report")) {
        Write-Host "  Successfully removed" -ForegroundColor Green
    } else {
        Write-Host "  Could not remove (may be in use)" -ForegroundColor Red
    }
} else {
    Write-Host "playwright-report does not exist" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Cleanup completed!" -ForegroundColor Cyan
Write-Host ""
