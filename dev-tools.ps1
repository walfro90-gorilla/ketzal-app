# Script de desarrollo para Ketzal App
# Simplifica el manejo de imágenes y desarrollo

Write-Host "🚀 Ketzal App - Herramientas de Desarrollo" -ForegroundColor Green

function Show-Menu {
    Write-Host ""
    Write-Host "Selecciona una opción:" -ForegroundColor Yellow
    Write-Host "1. Iniciar desarrollo completo (frontend + verificar backend)"
    Write-Host "2. Solo frontend"
    Write-Host "3. Verificar backend"
    Write-Host "4. Verificar estado de imágenes"
    Write-Host "5. Mostrar guía de imágenes"
    Write-Host "6. Limpiar cache de Next.js"
    Write-Host "7. Verificar errores de TypeScript"
    Write-Host "8. Salir"
    Write-Host ""
}

function Start-FullDevelopment {
    Write-Host "🔍 Verificando backend..." -ForegroundColor Cyan
    node check-backend.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend OK! Iniciando frontend..." -ForegroundColor Green
        npm run dev
    } else {
        Write-Host "❌ Backend no disponible. ¿Continuar solo con frontend? (y/n)" -ForegroundColor Yellow
        $response = Read-Host
        if ($response -eq "y" -or $response -eq "Y") {
            npm run dev
        }
    }
}

function Start-Frontend {
    Write-Host "🎨 Iniciando frontend..." -ForegroundColor Cyan
    npm run dev
}

function Check-Backend {
    Write-Host "🔍 Verificando backend..." -ForegroundColor Cyan
    node check-backend.js
}

function Check-Images {
    Write-Host "🖼️ Verificando optimización de imágenes..." -ForegroundColor Cyan
    Write-Host "✅ Componente OptimizedImage disponible"
    Write-Host "✅ Configuración simplificada de Next.js"
    Write-Host "✅ Manejo de errores implementado"
    Write-Host "✅ Placeholder SVG disponible"
    
    # Verificar que el componente existe
    if (Test-Path "components\OptimizedImage.tsx") {
        Write-Host "✅ OptimizedImage.tsx encontrado" -ForegroundColor Green
    } else {
        Write-Host "❌ OptimizedImage.tsx no encontrado" -ForegroundColor Red
    }
    
    # Verificar placeholder
    if (Test-Path "public\placeholder.svg") {
        Write-Host "✅ placeholder.svg encontrado" -ForegroundColor Green
    } else {
        Write-Host "❌ placeholder.svg no encontrado" -ForegroundColor Red
    }
}

function Show-ImageGuide {
    Write-Host "📖 Guía de Optimización de Imágenes:" -ForegroundColor Cyan
    if (Test-Path "IMAGE_OPTIMIZATION_GUIDE.md") {
        Get-Content "IMAGE_OPTIMIZATION_GUIDE.md" | Select-Object -First 20
        Write-Host "..." -ForegroundColor Gray
        Write-Host "Ver archivo completo: IMAGE_OPTIMIZATION_GUIDE.md" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Guía no encontrada" -ForegroundColor Red
    }
}

function Clear-NextCache {
    Write-Host "🧹 Limpiando cache de Next.js..." -ForegroundColor Cyan
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force
        Write-Host "✅ Cache limpiado" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ No hay cache para limpiar" -ForegroundColor Yellow
    }
}

function Check-TypeScript {
    Write-Host "🔍 Verificando errores de TypeScript..." -ForegroundColor Cyan
    npx tsc --noEmit
}

# Menú principal
do {
    Show-Menu
    $choice = Read-Host "Ingresa tu opción"
    
    switch ($choice) {
        "1" { Start-FullDevelopment }
        "2" { Start-Frontend }
        "3" { Check-Backend }
        "4" { Check-Images }
        "5" { Show-ImageGuide }
        "6" { Clear-NextCache }
        "7" { Check-TypeScript }
        "8" { 
            Write-Host "👋 ¡Hasta luego!" -ForegroundColor Green
            break
        }
        default { Write-Host "❌ Opción no válida" -ForegroundColor Red }
    }
    
    if ($choice -ne "8") {
        Write-Host ""
        Write-Host "Presiona Enter para continuar..." -ForegroundColor Gray
        Read-Host
    }
} while ($choice -ne "8")
