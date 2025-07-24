import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

// GET /api/wallet?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get('userId');
  if (!userId) {
    return new Response(JSON.stringify({ success: false, message: 'userId is required' }), { status: 400 });
  }
  try {
    const wallet = await db.wallet.findFirst({ where: { userId } });
    if (!wallet) {
      return new Response(JSON.stringify({ success: false, message: 'No wallet found for user' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, wallet }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Error fetching wallet', error: String(error) }), { status: 500 });
  }
}
