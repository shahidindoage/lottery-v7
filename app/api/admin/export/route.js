import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const submissions = await prisma.lotterySubmission.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (!submissions.length) {
      return new Response('No data available', { status: 404 });
    }

    const header = ['Customer ID', 'Name', 'Phone', 'Accepted Terms', 'Winner', 'Created At'];
    const rows = submissions.map((s) => [
      s.uniqueId,
      s.name,
      s.phone,
      s.accepted_terms ? 'Yes' : 'No',
      s.winner === 1 ? 'Winner' : 'No',
      new Date(s.createdAt).toLocaleString(),
    ]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="submissions.csv"',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
}
