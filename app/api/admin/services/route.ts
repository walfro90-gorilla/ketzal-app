import { NextRequest, NextResponse } from 'next/server';

// API que se conecta al backend
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// GET - Obtener lista de servicios con información de transporte
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    // Hacer la petición al backend
    const backendResponse = await fetch(`${BACKEND_URL}/services?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend responded with ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error al obtener lista de servicios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
