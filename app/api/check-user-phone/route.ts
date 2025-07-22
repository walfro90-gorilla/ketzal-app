import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone || phone.length < 8) {
      return NextResponse.json({ available: null, message: 'Número muy corto' });
    }

    // Buscar si existe un supplier con este teléfono
    const existingSupplier = await db.supplier.findFirst({
      where: {
        phoneNumber: {
          equals: phone,
          mode: 'insensitive'
        }
      }
    });

    const available = !existingSupplier;
    const message = available 
      ? 'Teléfono disponible ✅' 
      : 'Este número ya está registrado ❌';

    return NextResponse.json({ 
      available, 
      message,
      phone 
    });

  } catch (error) {
    console.error('Error checking user phone:', error);
    return NextResponse.json(
      { error: 'Error al verificar teléfono' }, 
      { status: 500 }
    );
  }
}
