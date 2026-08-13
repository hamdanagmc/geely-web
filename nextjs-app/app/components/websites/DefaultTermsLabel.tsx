import React from "react";

interface DefaultTermsLabelProps {
  currentLocale: string;
  linkColorClass?: string;
  termsHref?: string;
}

export default function DefaultTermsLabel({
  currentLocale,
  linkColorClass = "text-[#0070b7]",
  termsHref,
}: DefaultTermsLabelProps) {
  const isAr = currentLocale === "ar";
  const resolvedTermsHref = `/${currentLocale}/privacy-policy#Terms&Definitions`;
  const privacyHref = `/${currentLocale}/privacy-policy`;

  if (isAr) {
    return (
      <>
        أوافق على{" "}
        <a
          href={resolvedTermsHref}
          className={`${linkColorClass} hover:underline`}
          target="_blank"
          rel="noopener noreferrer"
        >
          الشروط والأحكام
        </a>{" "}
        و{" "}
        <a
          href={privacyHref}
          className={`${linkColorClass} hover:underline`}
          target="_blank"
          rel="noopener noreferrer"
        >
          سياسة الخصوصية
        </a>
      </>
    );
  }

  return (
    <>
      I agree to the{" "}
      <a
        href={resolvedTermsHref}
        className={`${linkColorClass} hover:underline`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms & Conditions
      </a>{" "}
      and{" "}
      <a
        href={privacyHref}
        className={`${linkColorClass} hover:underline`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </a>
    </>
  );
}
