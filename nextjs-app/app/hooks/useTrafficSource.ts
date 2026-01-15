"use client";
import { setCookie, getCookie } from 'cookies-next';
import { useEffect } from 'react';

export const useTrafficSource = () => {
  useEffect(() => {

    const currentUrl = window.location.href;
    const searchParams = new URLSearchParams(window.location.search);
    
    const hasTracking = Array.from(searchParams.keys()).some(
      key => key.startsWith('utm_') || key.includes('clid')
    );

    if (hasTracking) {
      setCookie('referring_url', currentUrl, { 
        maxAge: 60 * 60 * 24 * 3, // 3 days in seconds
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === 'production'
      });
    }
  }, []);
};