import { NextRequest, NextResponse } from 'next/server';

interface Location {
  id: number;
  country: string;
  state: string;
  city: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const country = searchParams.get('country');
    const state = searchParams.get('state');

    console.log('API llamada con:', { type, country, state });

    // Usar el backend como fuente de datos
    const backendUrl = 'http://localhost:4000/api/global_locations';
    const response = await fetch(backendUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const allLocations: Location[] = await response.json();
    console.log('Datos del backend:', allLocations);

    switch (type) {
      case 'countries':
        // Extraer países únicos
        const countries = [...new Set(allLocations.map((loc: Location) => loc.country))];
        return NextResponse.json(countries.map(country => ({ value: country, label: country })), {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        });

      case 'states':
        if (!country) {
          return NextResponse.json({ error: 'Country parameter required' }, { status: 400 });
        }
        // Filtrar por país y extraer estados únicos
        const states = [...new Set(
          allLocations
            .filter((loc: Location) => loc.country === country)
            .map((loc: Location) => loc.state)
        )];
        return NextResponse.json(states.map(state => ({ value: state, label: state })), {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        });

      case 'cities':
        if (!country || !state) {
          return NextResponse.json({ error: 'Country and state parameters required' }, { status: 400 });
        }
        // Filtrar por país y estado, extraer ciudades únicas
        const cities = [...new Set(
          allLocations
            .filter((loc: Location) => loc.country === country && loc.state === state)
            .map((loc: Location) => loc.city)
        )];
        return NextResponse.json(cities.map(city => ({ value: city, label: city })), {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        });

      default:
        return NextResponse.json({
          message: 'API funcionando',
          type: type || 'no-type',
          timestamp: Date.now()
        });
    }

  } catch (error) {
    console.error('Error en API locations:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
