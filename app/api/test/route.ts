import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API funcionando correctamente', timestamp: Date.now() });
}
