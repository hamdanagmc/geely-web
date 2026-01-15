"use server"

import { sanityFetch } from "@/sanity/lib/live";
import { sanityFetchCustom } from "@/sanity/lib/client";
import { headerQuery, footerQuery, getGeelyNetworkQuery,sideQuickQuery,siteSettingQuery,  getAllModelsQuery, getServiceTableQuery, getSparePartsTableQuery,getAllSparePartsForModelQuery } from "@/sanity/lib/queries";



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

export async function getAllModels(locale: string) {
  const data = await sanityFetchCustom({
    query: getAllModelsQuery,
    params: { locale },
    tags: ['models']
  });

  return data;
}

export async function getServiceTable(locale: string, model: string) {
  const data = await sanityFetchCustom({
    query: getServiceTableQuery,
    params: { locale, model },
    tags: ['models']
  });

  return data;
}


export async function getSparePartsTable(locale: string, model: string) {
  const data = await sanityFetchCustom({
    query: getSparePartsTableQuery,
    params: { locale, model },
    tags: ['models']
  });

  return data;
}
export async function getAllSparePartsForModel(locale: string, model: string) {
  const data = await sanityFetchCustom({
    query: getAllSparePartsForModelQuery,
    params: { locale, model },
    tags: ["sparePart"],
  })

  return data
}
