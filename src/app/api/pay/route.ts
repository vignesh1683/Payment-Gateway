import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/payment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionId } = body;

    // Simulate network delay
    const random = Math.random();
    
    if (random < 0.6) {
      // Success (60%)
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json<ApiResponse>({
        status: 'SUCCESS',
        transactionId
      });
    } else if (random < 0.85) {
      // Failed (25%)
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json<ApiResponse>({
        status: 'FAILED',
        reason: 'Insufficient funds',
        transactionId
      }, { status: 400 });
    } else {
      // Timeout (15%) - Response after 8 seconds
      // Frontend should abort after 6 seconds
      await new Promise(resolve => setTimeout(resolve, 8000));
      return NextResponse.json<ApiResponse>({
        status: 'FAILED',
        reason: 'Gateway timeout',
        transactionId
      }, { status: 504 });
    }
  } catch (error) {
    return NextResponse.json({ 
      status: 'FAILED', 
      reason: 'Invalid request' 
    }, { status: 400 });
  }
}
