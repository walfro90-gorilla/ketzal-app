import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name || name.length < 2) {
      return NextResponse.json({ available: null, message: 'Nombre muy corto' });
    }

    // Buscar si existe un supplier con este nombre (case insensitive)
    const existingSupplier = await db.supplier.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });

    const available = !existingSupplier;
    const message = available 
      ? 'Nombre de Proveedor libre ✅' 
      : 'Nombre de Proveedor ya existe ❌';

    return NextResponse.json({ 
      available, 
      message,
      name 
    });

  } catch (error) {
    console.error('Error checking supplier name:', error);
    return NextResponse.json(
      { error: 'Error al verificar disponibilidad' }, 
      { status: 500 }
    );
  }
}
