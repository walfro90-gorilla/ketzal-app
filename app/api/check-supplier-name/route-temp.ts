import { NextRequest, NextResponse } from 'next/server';

// API temporal sin Prisma para probar
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name || name.length < 2) {
      return NextResponse.json({ available: null, message: 'Nombre muy corto' });
    }

    // Simulación temporal (siempre disponible)
    const available = true;
    const message = 'Nombre de Proveedor libre ✅ (temporal)';

    return NextResponse.json({ 
      available, 
      message,
      name: name
    });

  } catch (error) {
    console.error('Error checking supplier name:', error);
    return NextResponse.json({ 
      available: null, 
      message: 'Error al verificar disponibilidad',
      error: error.message
    }, { status: 500 });
  }
}
