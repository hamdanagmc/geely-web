import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";
import { toPlainText } from "next-sanity";
import { VisualEditing } from "next-sanity/visual-editing";
import DraftModeToast from "@/app/components/DraftModeToast";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { handleError } from "../client-utils";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import Cookie from "../components/websites/cookie";
import Gtm from "../components/websites/Gtm";
import { TestDriveProvider } from '../context/TestDriveContext';
import StoreProvider from '../StoreProvider';
import { useTrafficSource } from "../hooks/useTrafficSource";
import TrafficTracker from "../components/TrafficTracker";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: "no",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  const { locale } = await params;
  const messages = await getMessages();
  if (!["en", "ar"].includes(locale)) {
    notFound();
  }

  const isRtl = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${inter.className}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="google-site-verification" content="Kw51pvZL9dlv0DegiXI7u66KBFORCZKkZkgzDwCiS6k" />
      </head>
      <body>
        <>
        <TrafficTracker />
          {isDraftMode && (
            <>
              <DraftModeToast />
              <VisualEditing />
            </>
          )}
          {/* <SanityLive onError={handleError} /> */}

          <Script
          id="genesys-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function (g, e, n, es, ys) {
                g['_genesysJs'] = e;
                g[e] = g[e] || function () {
                  (g[e].q = g[e].q || []).push(arguments)
                };
                g[e].t = 1 * new Date();
                g[e].c = es;
                ys = document.createElement('script'); ys.async = 1; ys.src = n; ys.charset = 'utf-8'; document.head.appendChild(ys);
              })(window, 'Genesys', 'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js', {
                environment: 'prod-euc1',
                deploymentId: '4a6081fc-450e-411e-bc72-eca590395b4d'
              });
            `,
          }}
        />
          <main className="">
          <StoreProvider>
            <TestDriveProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
              <Cookie />
              <Gtm/>
            </NextIntlClientProvider>
            </TestDriveProvider>
            </StoreProvider>
          </main>
        </>
      </body>
    </html>
  );
}
