# Script para verificar el estado del backend
Write-Host "Verificando Backend en puerto 4000..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4000"
$endpoints = @(
    @{ Path = ""; Description = "Health Check" },
    @{ Path = "/api/users"; Description = "GET /api/users" },
    @{ Path = "/api/users/6477fadf-8327-4ba1-8c1c-4388ffe438ad"; Description = "GET /api/users/[id]" },
    @{ Path = "/api/suppliers"; Description = "GET /api/suppliers" },
    @{ Path = "/api/users/search?name=test"; Description = "GET /api/users/search" }
)

foreach ($endpoint in $endpoints) {
    $url = $baseUrl + $endpoint.Path
    $description = $endpoint.Description
    
    try {
        Write-Host "Testing: $description" -ForegroundColor Yellow
        
        $response = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 5 -ErrorAction Stop
        
        Write-Host "SUCCESS: $description" -ForegroundColor Green
        
        if ($response -is [Array]) {
            Write-Host "   Response: Array with $($response.Count) items" -ForegroundColor Gray
            if ($response.Count -gt 0) {
                $firstItem = $response[0]
                if ($firstItem -is [PSCustomObject]) {
                    $keys = ($firstItem | Get-Member -MemberType NoteProperty).Name -join ", "
                    Write-Host "   First item keys: $keys" -ForegroundColor Gray
                }
            }
        } elseif ($response -is [PSCustomObject]) {
            Write-Host "   Response: Object" -ForegroundColor Gray
            $keys = ($response | Get-Member -MemberType NoteProperty).Name -join ", "
            Write-Host "   Keys: $keys" -ForegroundColor Gray
        } else {
            Write-Host "   Response: $($response.ToString().Substring(0, [Math]::Min(100, $response.ToString().Length)))" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "ERROR: $description - $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "Verificacion completada" -ForegroundColor Cyan
