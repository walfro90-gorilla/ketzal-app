import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:4000';

export async function GET(req: NextRequest, { params }: { params: { serviceId: string } }) {
  const { serviceId } = params;
  const res = await fetch(`${BACKEND_URL}/services/${serviceId}/reviews`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest, { params }: { params: { serviceId: string } }) {
  const { serviceId } = params;
  const body = await req.json();
  const res = await fetch(`${BACKEND_URL}/services/${serviceId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
