import type { NextConfig } from "next";
const withNextIntl = require('next-intl/plugin')();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/actions/sitemap",
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "geelyksa.com",
      }
    ],
    dangerouslyAllowSVG: true,
  },
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: "false",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self' https://vimeo.com/;
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vimeo.com/ https://*.vercel.app https://vercel.live https://cdn.sanity.io http://uae.fw-cdn.com https://agmc-768475558000719353-aaa2c72fa980a2717295684.freshchat.com https://www.google.com/ https://www.gstatic.com/ https://www.googletagmanager.com/ https://*.cookiebot.com/ https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ ;
              connect-src 'self' https://vimeo.com/ https://*.sanity.io https://*.vercel.app https://app-uae.freshmarketer.com https://www.google-analytics.com/ https://*.cookiebot.com https://cdn.cookielaw.org https://*.freshmarketer.ae https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;
              img-src 'self' data: https://*.sanity.io https://*.vercel.app blob: https://www.googletagmanager.com ;
              style-src 'self' 'unsafe-inline' https://agmc-768475558000719353-aaa2c72fa980a2717295684.freshchat.com;
              font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com data:;
              frame-src 'self' https://*.vimeo.com/ https://vimeo.com/ https://vercel.live/ https://agmc-768475558000719353-aaa2c72fa980a2717295684.freshchat.com https://www.google.com/ https://*.cookiebot.com/ https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.youtube.com https://www.youtube-nocookie.com https://geely-ae.vercel.app/;
            `.replace(/\s{2,}/g, " "), // Remove extra spaces
          },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Powered-By", value: "" },
          { key: "Server",value: "" },
          { key: "X-Frame-Options",value: "deny" },
          { key: "Set-Cookie", value: "NEXT_LOCALE=en;Path=/;HttpOnly; Secure; SameSite=Lax" },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://geely-ae.vercel.app", // Replace with allowed domains
          },
        ],
      },
    ]
  },
};
module.exports = withNextIntl(nextConfig);
