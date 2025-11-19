import { type NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)
const localePattern = /^\/(en|ar)(\/|$)/

export default function middleware(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang")

  if (lang === "ar" || lang === "en") {
    const url = request.nextUrl.clone()

    // Remove existing locale from pathname if present
    url.pathname = url.pathname.replace(localePattern, "/")

    // Add new locale prefix
    url.pathname = `/${lang}${url.pathname}`.replace(/\/+$/, "")

    url.searchParams.delete("lang")
    return NextResponse.redirect(url)
  }

  const response = intlMiddleware(request)

  const csp = `
    default-src 'self' https://vimeo.com/;
    script-src 'self' 'unsafe-inline' 'unsafe-eval'
      https://vimeo.com/ https://*.vercel.app https://vercel.live
      https://cdn.sanity.io http://uae.fw-cdn.com
      https://agmc-768475558000719353-aaa2c72fa980a2717295684.freshchat.com
      https://www.google.com/ https://www.gstatic.com/
      https://www.googletagmanager.com https://*.cookiebot.com/
      https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/
      https://connect.facebook.net https://snap.licdn.com
      https://sc-static.net https://analytics.tiktok.com
      https://tr.snapchat.com https://static.ads-twitter.com https://analytics.google.com https://googleads.g.doubleclick.net
      https://c.amazon-adsystem.com https://ad.doubleclick.net https://15181648.fls.doubleclick.net 
      https://www.googleadservices.com https://bat.bing.com https://trackback.gotrackier.com https://trk.betrck.com
      https://googleads.g.doubleclick.net https://www.google.com https://www.google-analytics.com https://d1v2u6by4izioz.cloudfront.net
      https://cdn.pixel.platformance.io https://us-assets.i.posthog.com/ https://us.i.posthog.com/ https://pixel.data.platformrce.io https://gmt.gotrackier.com https://pixel.data.platformance.io https://events.data.platformance.io;
    
    connect-src 'self' https://vimeo.com/ https://*.sanity.io https://*.vercel.app
      https://app-uae.freshmarketer.com https://www.google-analytics.com
      https://*.cookiebot.com https://cdn.cookielaw.org https://*.freshmarketer.ae
      https://www.google.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/
      https://px.ads.linkedin.com https://tr.snapchat.com
      https://analytics.tiktok.com https://analytics.google.com  https://stats.g.doubleclick.net 
      https://*.ads.linkedin.com https://*.snapchat.com https://ara.paa-reporting-advertising.amazon
      https://aax-eu.amazon-adsystem.com https://ad.doubleclick.net https://c.amazon-adsystem.com https://15181648.fls.doubleclick.net
      https://www.googleadservices.com https://www.google.co.in https://google.com https://bat.bing.com https://adservice.google.com https://www.facebook.com
      https://cdn.pixel.platformance.io https://us.i.posthog.com/ https://d34iy6sn17nn1e.cloudfront.net https://us-assets.i.posthog.com https://pixel.data.platformance.io
      https://www.googletagmanager.com;

    img-src 'self' data: https://*.sanity.io https://*.vercel.app blob:
      https://www.googletagmanager.com https://px.ads.linkedin.com
      https://*.ads.linkedin.com https://www.facebook.com https://tr.snapchat.com https://analytics.tiktok.com
      https://www.google.co.in https://t.co https://analytics.twitter.com https://ad.doubleclick.net
      https://www.google.com https://www.linkedin.com https://bat.bing.com https://googleads.g.doubleclick.net
      https://www.googleadservices.com https://adservice.google.com https://cdn.pixel.platformance.io https://us.i.posthog.com/ https://adscholars10770037.o18.click https://connect.facebook.net https://trackback.gotrackier.com
      https://fonts.gstatic.com https://adevolve.gotrackier.com;

    style-src 'self' 'unsafe-inline'
      https://agmc-768475558000719353-aaa2c72fa980a2717295684.freshchat.com 
      https://www.gstatic.com
      https://www.googletagmanager.com
      https://fonts.googleapis.com;

    font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com data:;

    frame-src 'self' https://*.vimeo.com/ https://vimeo.com/ https://vercel.live/
      https://agmc-768475558000719353-aaa2c72fa980a2717295684.freshchat.com
      https://www.google.com/ https://*.cookiebot.com/
      https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/
      https://www.youtube.com https://www.youtube-nocookie.com https://tr.snapchat.com
      https://geely-ae.vercel.app/ https://td.doubleclick.net
      https://13442784.fls.doubleclick.net https://www.googletagmanager.com https://www.facebook.com
      https://aax-eu.amazon-adsystem.com https://c.amazon-adsystem.com https://ad.doubleclick.net https://15181648.fls.doubleclick.net
      https://www.googleadservices.com https://trackback.gotrackier.com https://trk.betrck.com https://bat.bing.com
      https://googleads.g.doubleclick.net https://thinkabout88.gotrackier.io/ https://track.valueleadme.com https://tracking.sksdigital.co https://gmt.gotrackier.com https://pixel.data.platformance.io
      https://*.fls.doubleclick.net https://adevolve.gotrackier.com;
  `
    .replace(/\s{2,}/g, " ")
    .trim()

  response.headers.set("Content-Security-Policy", csp)
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "no-referrer")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Powered-By", "")
  response.headers.set("Server", "")
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")

  return response
}

export const config = {
  matcher: ["/", "/((?!_next|_vercel|api/|.*\\..*).*)"],
}
