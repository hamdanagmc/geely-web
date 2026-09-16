import { NextResponse } from 'next/server';
import { start } from 'workflow/api';
import { reconcileBookings } from '@/app/workflow/reconcile';

// Vercel Cron schedule is configured in vercel.json. This route only queues work.
export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('[reconcile] CRON_SECRET env var is not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }
  if (req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cronRunAt = new Date().toISOString();
  try {
    const run = await start(reconcileBookings, [cronRunAt]);
    console.log(`[reconcile] Workflow queued: ${run.runId}`);
    return NextResponse.json({ ok: true, cronRunAt, runId: run.runId }, { status: 202 });
  } catch (error) {
    console.error('[reconcile] Unable to start workflow:', error);
    return NextResponse.json({ error: 'Unable to start reconciliation' }, { status: 500 });
  }
}
