"use client"
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type VerifyResult = {
  success?: boolean;
  paymentStatus?: string;
  orderReference?: string;
  paymentId?: string;
  amount?: number;
  currency?: string;
  pendingRecord?: any;
  error?: string;
};

export default function PreBookThankyou() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyResult | null>(null);

  useEffect(() => {
    const verify = async () => {
      setLoading(true);
      const orderRef = searchParams.get('ref');
      if (!orderRef) {
        // If no query param, try to parse from full URL (fallback)
        const url = typeof window !== "undefined" ? window.location.href : "";
        const m = url.match(/(PB-[A-Za-z0-9]{8,36})/);
        if (m) {
          await fetchStatus(m[1]);
        } else {
          setResult({ error: "Missing order reference in URL" });
          setLoading(false);
        }
        return;
      }

      await fetchStatus(orderRef);
    };

    const fetchStatus = async (orderRef: string) => {
      try {
        const res = await fetch(`/api/pre-booking/verify?orderReference=${encodeURIComponent(orderRef)}`);
        const data = await res.json();
        if (!res.ok) {
          setResult({ error: data?.error || 'Verification failed' });
        } else {
          setResult(data);
        }
      } catch (err: any) {
        setResult({ error: err?.message || 'Verification error' });
      } finally {
        setLoading(false);
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRetry = () => {
    // Send user back to pre-book form
    router.push('/en');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <p className="text-lg">Verifying payment status, please wait...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <p className="text-lg text-red-600">Unable to verify payment.</p>
        <button onClick={onRetry} className="mt-4 px-6 py-2 bg-black text-white">Try Again</button>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <p className="text-lg text-red-600">{result.error}</p>
        <button onClick={onRetry} className="mt-4 px-6 py-2 bg-black text-white">Try Again</button>
      </div>
    );
  }

  const state = (result.paymentStatus || '').toUpperCase();

  if (state === 'CAPTURED' || state === 'PURCHASED' || state === 'SUCCESSFUL') {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Thank you for your booking</h1>
        <p className="text-lg mb-4">Your payment was successful.</p>
        <p className="text-sm">Booking reference:</p>
        <p className="text-xl font-mono mt-2">{result.orderReference || result.pendingRecord?.orderReference || result.paymentId}</p>
      </div>
    );
  }

  // Otherwise consider it failed or pending
  if (state === 'FAILED' || state === 'REVERSED' || state === 'CANCELLED') {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Payment Failed</h1>
        <p className="mb-4">Unfortunately your payment did not complete. You can try again.</p>
        <button onClick={onRetry} className="mt-4 px-6 py-2 bg-black text-white">Try Again</button>
      </div>
    );
  }

  // Pending / unknown states
  return (
    <div className="max-w-3xl mx-auto py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment status: {'Pending'}</h1>
      <p className="mb-4">If this doesn't update automatically, please check back later.</p>
      <p className="text-sm">Booking reference:</p>
      <p className="text-xl font-mono mt-2">{result.orderReference || result.pendingRecord?.orderReference || result.paymentId}</p>
    </div>
  );
}
