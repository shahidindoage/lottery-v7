import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { uniqueId, prize } = await req.json();

  try {
    // 🧠 Find the highest card number used so far
    const lastWinner = await prisma.lotterySubmission.findFirst({
      where: { cardNumber: { not: null } },
      orderBy: { cardNumber: 'desc' },
      select: { cardNumber: true },
    });

    const nextCardNumber = (lastWinner?.cardNumber || 0) + 1;

    // 🏆 Assign new winner with next card number
    const updatedUser = await prisma.lotterySubmission.update({
      where: { uniqueId },
      data: { 
        winner: 1,
        prize,
        cardNumber: nextCardNumber, // ✅ automatically set next number
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Assign winner error:', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
