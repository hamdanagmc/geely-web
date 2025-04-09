import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/live";

const generateCustomSitemap = (
  homepage: { language: string; _updatedAt: string }[] = [],
  pages: { slug: string; language: string; _updatedAt: string }[] = []
) => {
  const domain = process.env.SITE_URL || "https://www.geely.ae";

  if (!Array.isArray(homepage) || !Array.isArray(pages)) {
    console.error("generateCustomSitemap received invalid input:", { homepage, pages });
    return "<?xml version='1.0' encoding='UTF-8'?><urlset></urlset>";
  }

  const staticLinks = homepage
    .map(({ language, _updatedAt }) => {
      const safeLanguage = typeof language === "string" ? language : "en";
      return `
        <url>
          <loc>${domain}/${safeLanguage}</loc>
          <lastmod>${_updatedAt || new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `;
    })
    .join("");

  const pageLinks = pages
    .map(({ slug, language, _updatedAt }) => {
      const safeLanguage = typeof language === "string" ? language : "en";
      const prefix = safeLanguage === "en" ? "/en" : "";
      return `
        <url>
          <loc>${domain}${prefix}${slug}</loc>
          <lastmod>${_updatedAt || new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticLinks}
      ${pageLinks}
    </urlset>
  `;
};

const removeDuplicates = (pageData: any[], isCarData = false) => {
  if (!Array.isArray(pageData)) {
    console.error("removeDuplicates received non-array data:", pageData);
    return [];
  }

  const seenSlugs = new Set();

  return pageData
    .filter((page) => {
      if (!page || typeof page !== "object") return false;
      const slug = page?.slug?.current;
      if (!slug || typeof slug !== "string") return false;

      if (seenSlugs.has(slug)) return false;
      seenSlugs.add(slug);
      return true;
    })
    .map((page) => {
      const formattedSlug =
        page.slug.current === "home"
          ? ""
          : page.slug.current === "ar/home"
          ? "/ar"
          : `/${isCarData ? "car/" : ""}${page.slug.current || ""}`; // Add "/car/" prefix if it's a car page

      return {
        slug: formattedSlug,
        language: page.language || "en",
        _updatedAt: page._updatedAt || new Date().toISOString(),
      };
    });
};

export async function GET() {
  try {
    const queryPages = `*[_type == "page"]{ slug, language, _updatedAt }`;
    const queryHome = `*[_type == "homepage"]{ language, _updatedAt }`;
    const queryCars = `*[_type == "car"]{ slug, language, _updatedAt }`;

    const [pageDataResponse, homePageDataResponse, carDataResponse] = await Promise.all([
      sanityFetch({ query: queryPages }),
      sanityFetch({ query: queryHome }),
      sanityFetch({ query: queryCars }),
    ]);

    const pageData = pageDataResponse?.data || [];
    const homePageData = homePageDataResponse?.data || [];
    const carData = carDataResponse?.data || [];

    if (!Array.isArray(pageData) || !Array.isArray(homePageData) || !Array.isArray(carData)) {
      throw new Error("Invalid data structure from Sanity API");
    }

    const pages = [...removeDuplicates(pageData), ...removeDuplicates(carData, true)]; // Apply "/car/" prefix to car pages
    const sitemap = generateCustomSitemap(homePageData, pages);

    return new NextResponse(sitemap, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new NextResponse("Failed to generate sitemap", { status: 500 });
  }
}
