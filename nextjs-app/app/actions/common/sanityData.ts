"use server"

import { sanityFetch } from "@/sanity/lib/live";
import { sanityFetchCustom } from "@/sanity/lib/client";
import { headerQuery, footerQuery, getGeelyNetworkQuery,sideQuickQuery,siteSettingQuery } from "@/sanity/lib/queries";



//function to get header 
export async function getHeader(locale : string) : Promise<any> {
    const data = await sanityFetchCustom({
        query : headerQuery,
        params :  {language : locale},
        tags: ['fragment']
    });
    return data;
}

export async function getSideQuickData(locale : string) : Promise<any> {
  const data = await sanityFetchCustom({
      query : sideQuickQuery,
      params :  {language : locale},
      tags: ['fragment']
  });
  return data;
}

export async function getSiteSettingData(locale : string) : Promise<any> {
  const data = await sanityFetchCustom({
      query : siteSettingQuery(locale),
      params :  {language : locale},
      tags: ['settings']
  });
  return data;
}




//function to get footer 
export async function getFooter(locale : string) : Promise<any> {
    const data = await sanityFetchCustom({
        query : footerQuery,
        params :  {language : locale},
        tags: ['fragment']
    });
    return data;
}

export async function getGeelyNetwork(locale: string) {
  const data  = await sanityFetchCustom({
    query: getGeelyNetworkQuery(locale),
    params: { locale },
    tags : ['geelyNetwork' ]
  });
  return data;
}
