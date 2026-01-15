// components/forms/HiddenTrackingField.tsx
'use client';
import { useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { useFormikContext } from 'formik';

export default function HiddenTrackingField() {
  // Access the parent formik state
  const { setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    const savedRef = getCookie('referring_url');
    if (savedRef) {
      // This injects the cookie value into Formik's values.referring_url
      setFieldValue("referring_url", savedRef);
    }
  }, [setFieldValue]);

  return null; // This component doesn't need to render anything visible
}