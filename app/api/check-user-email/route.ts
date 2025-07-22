import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ available: null, message: 'Email inválido' });
    }

    // Buscar si existe un usuario con este email (en la tabla User)
    const existingUser = await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    });

    // También buscar en la tabla Supplier por contactEmail
    const existingSupplier = await db.supplier.findFirst({
      where: {
        contactEmail: {
          equals: email,
          mode: 'insensitive'
        }
      }
    });

    const available = !existingUser && !existingSupplier;
    const message = available 
      ? 'Email disponible ✅' 
      : 'Este email ya está registrado ❌';

    return NextResponse.json({ 
      available, 
      message,
      email 
    });

  } catch (error) {
    console.error('Error checking user email:', error);
    return NextResponse.json(
      { error: 'Error al verificar email' }, 
      { status: 500 }
    );
  }
}
