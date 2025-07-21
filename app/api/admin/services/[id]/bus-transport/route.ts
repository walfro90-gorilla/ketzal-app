import { NextRequest, NextResponse } from 'next/server';

// API que se conecta al backend
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// GET - Obtener configuración de transporte para un servicio
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = parseInt(params.id);

    if (isNaN(serviceId)) {
      return NextResponse.json(
        { error: 'ID de servicio inválido' },
        { status: 400 }
      );
    }

    // Hacer la petición al backend
    const backendResponse = await fetch(`${BACKEND_URL}/services/${serviceId}/bus-transport`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json(
          { error: 'Servicio no encontrado' },
          { status: 404 }
        );
      }
      throw new Error(`Backend responded with ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error al obtener configuración del servicio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar configuración de transporte para un servicio
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = parseInt(params.id);

    if (isNaN(serviceId)) {
      return NextResponse.json(
        { error: 'ID de servicio inválido' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Hacer la petición al backend
    const backendResponse = await fetch(`${BACKEND_URL}/services/${serviceId}/bus-transport`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json(
          { error: 'Servicio no encontrado' },
          { status: 404 }
        );
      }
      if (backendResponse.status === 400) {
        const errorData = await backendResponse.json();
        return NextResponse.json(errorData, { status: 400 });
      }
      throw new Error(`Backend responded with ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error al actualizar configuración del servicio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
