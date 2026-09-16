export interface Booking {
  _id: string;
  _rev: string;
  _createdAt: string;
  paymentStatus: string;
  orderReference?: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  location?: string;
  pageUrl?: string;
  currency?: string;
  reconciliationRunId?: string;
}

export interface Payment {
  status: 'successful' | 'failed' | 'pending';
  rawState: string;
  paymentId: string;
  amount: number;
  currency: string;
}

export type Outcome = 'resolved_successful' | 'resolved_failed' | 'still_pending' | 'timed_out' | 'skipped';
