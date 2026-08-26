"use client"
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { PreBookThankyouComponent } from "@/sanity.types";
import PortableText from "@/app/components/PortableText";
import ResolvedLink from "@/app/components/ResolvedLink";

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

type PreBookThankyouProps = {
  block?: PreBookThankyouComponent;
};

export default function PreBookThankyou({ block }: PreBookThankyouProps) {
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

  const username = result.pendingRecord?.fullName || result.pendingRecord?.fallbackFullName || "Customer";
  const bookingReference = result.orderReference || result.pendingRecord?.orderReference || result.paymentId || "N/A";
  const paymentStatus = result.paymentStatus || result.pendingRecord?.paymentStatus || "Pending";

  const replacements = { username, bookingReference, paymentStatus };

  const replacePlaceholders = (text: string): string => {
    if (!text) return text;
    return text
      .replace(/\{{1,2}username\}{0,2}/g, replacements.username)
      .replace(/\{{1,2}bookingReference\}{0,2}/g, replacements.bookingReference)
      .replace(/\{{1,2}paymentStatus\}{0,2}/g, replacements.paymentStatus);
  };

  const replacePlaceholdersInBlocks = (blocks: any): any => {
    if (!blocks || !Array.isArray(blocks)) return blocks;
    return blocks.map((b: any) => {
      if (b._type === "block" && Array.isArray(b.children)) {
        return {
          ...b,
          children: b.children.map((child: any) => {
            if (child._type === "span" && typeof child.text === "string") {
              return {
                ...child,
                text: replacePlaceholders(child.text),
              };
            }
            return child;
          }),
        };
      }
      return b;
    });
  };

  const state = (result.paymentStatus || '').toUpperCase();

  if (state === 'CAPTURED' || state === 'PURCHASED' || state === 'SUCCESSFUL') {
    if (block?.successObject) {
      const heading = replacePlaceholders(block.successObject.heading || "Thank you for your booking");
      const paragraphBlocks = replacePlaceholdersInBlocks(block?.successObject?.paragraph);
      return (
        <div className="max-w-3xl paragraphBlocks mx-auto py-20 text-center">
          {heading && <h1 className="text-3xl font-bold mb-4">{heading}</h1>}
          {paragraphBlocks && (
            <div className="text-lg mb-4">
              <PortableText value={paragraphBlocks} />
            </div>
          )}
          {block.successObject.cta && block.successObject.ctaHeadingText && (
            <div className="mt-6">
              <ResolvedLink
                link={block.successObject.cta}
                className="inline-block px-6 py-2 bg-black text-white hover:bg-black/90 transition-colors"
              >
                {block.successObject.ctaHeadingText}
              </ResolvedLink>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="max-w-3xl paragraphBlocks mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Thank you for your booking</h1>
        <p className="text-lg mb-4">Your payment was successful.</p>
        <p className="text-sm">Booking reference:</p>
        <p className="text-xl font-mono mt-2">{bookingReference}</p>
      </div>
    );
  }

  // Otherwise consider it failed or pending
  if (state === 'FAILED' || state === 'REVERSED' || state === 'CANCELLED') {
    if (block?.failedObject) {
      const heading = replacePlaceholders(block.failedObject.heading || "Payment Failed");
      const paragraphBlocks = replacePlaceholdersInBlocks(block.failedObject.paragraph);
      return (
        <div className="max-w-3xl paragraphBlocks mx-auto py-20 text-center">
          {heading && <h1 className="text-2xl font-bold mb-4 text-red-600">{heading}</h1>}
          {paragraphBlocks && (
            <div className="mb-4">
              <PortableText value={paragraphBlocks} />
            </div>
          )}
          {block.failedObject.cta && block.failedObject.ctaHeadingText ? (
            <div className="mt-6">
              <ResolvedLink
                link={block.failedObject.cta}
                className="inline-block px-6 py-2 bg-black text-white hover:bg-black/90 transition-colors"
              >
                {block.failedObject.ctaHeadingText}
              </ResolvedLink>
            </div>
          ) : (
            <button onClick={onRetry} className="mt-4 px-6 py-2 bg-black text-white">Try Again</button>
          )}
        </div>
      );
    }

    return (
      <div className="max-w-3xl paragraphBlocks mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Payment Failed</h1>
        <p className="mb-4">Unfortunately your payment did not complete. You can try again.</p>
        <button onClick={onRetry} className="mt-4 px-6 py-2 bg-black text-white">Try Again</button>
      </div>
    );
  }

  // Pending / unknown states
  if (block?.pendingObject) {
    const heading = replacePlaceholders(block.pendingObject.heading || "Payment status: Pending");
    const paragraphBlocks = replacePlaceholdersInBlocks(block.pendingObject.paragraph);
    return (
      <div className="max-w-3xl paragraphBlocks mx-auto py-20 text-center">
        {heading && <h1 className="text-2xl font-bold mb-4">{heading}</h1>}
        {paragraphBlocks && (
          <div className="mb-4">
            <PortableText value={paragraphBlocks} />
          </div>
        )}
        {block.pendingObject.cta && block.pendingObject.ctaHeadingText && (
          <div className="mt-6">
            <ResolvedLink
              link={block.pendingObject.cta}
              className="inline-block px-6 py-2 bg-black text-white hover:bg-black/90 transition-colors"
            >
              {block.pendingObject.ctaHeadingText}
            </ResolvedLink>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl paragraphBlocks mx-auto py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment status: {'Pending'}</h1>
      <p className="mb-4">If this doesn't update automatically, please check back later.</p>
      <p className="text-sm">Booking reference:</p>
      <p className="text-xl font-mono mt-2">{bookingReference}</p>
    </div>
  );
}
