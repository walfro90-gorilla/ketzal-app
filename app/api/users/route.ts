import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
  const res = await fetch(`${BACKEND_URL}/api/users`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
