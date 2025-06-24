"use client";
import { saveBrochureForm } from "@/app/actions/keyloop/brochure";
import { countryCodeOptions } from "@/app/lib/constants/countryCodeOptions";
import { sendContactCustomerEmail } from "@/app/services/email/contact";
import { sendCRMBrochureEmail } from "@/app/services/email/crm";
import { BrochureFormProps } from "@/app/types/email";
import type { BrochureDownloadFormSection } from "@/sanity.types";
import { urlForPDF } from "@/sanity/lib/utils";
import axios from "axios";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import ImageComp from "../CustomImage";
import { saveLeads } from "@/app/actions/sanity/leads";

type BrochureDownloadFormSectionProps = {
  block: BrochureDownloadFormSection;
};

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

interface FormValues {
  brochure_check: string[];
}

const validationSchema = Yup.object({
  brochure_check: Yup.array()
    .min(1, "Please select a brochure to download.")
    .required("Selection is required"),
});


export default function BrochureDownloadForm({
  block,
}: BrochureDownloadFormSectionProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const downloadValues = block?.form?.downloadValues || [];
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckboxChange = (title: string) => {
  const isSelected = selectedValues.includes(title);
  const newSelectedValues = isSelected ? [] : [title];

  setSelectedValues(newSelectedValues);

  // Update Formik values
  formik.setFieldValue("brochure_check", newSelectedValues);

  // Clear the error if one item is selected
  if (newSelectedValues.length > 0) {
    formik.setFieldError("brochure_check", undefined);
  }
};


  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const currentLocale = pathSegments[1] || "en";

  const formik = useFormik<FormValues>({
    initialValues: {
      brochure_check: [],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);

        // Handle form submission
        const selectedFiles = downloadValues
          .filter((item) => item.title && selectedValues.includes(item.title))
          .map((item) => urlForPDF(item.brochureFile) || "");

        console.log("Selected Values:", values);
        console.log("PDF URLs:", selectedFiles);

        // Trigger PDF downloads
        selectedFiles.forEach((pdfUrl) => {
          if (pdfUrl) {
            window.open(pdfUrl, "_blank");
          }
        });

        // Reset form and selected values
        resetForm();
        setSelectedValues([]);

        //redirect to thankyou page
        const slug = (block?.form?.link as any)?.slug || "";
        window.location.href = currentLocale == 'en' ?`/${currentLocale}/${slug}` : `/${slug}`;
        setSubmitting(false);

    },
  });

  useEffect(() => {
    formik.setFieldValue("brochure_check", selectedValues);
  }, [selectedValues]);

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      />
      <div className="broucherList pt-12 md:pb-0 pb-10">
        <h2 className="text-center md:text-[30px] text-[24px] geelybold">
          {block?.heading}
          <br /> {block?.subHeading}
        </h2>
        <div className="brochures_grid mt-12">
          {block?.form?.downloadValues?.map((item) => (
            <div key={item._key} className="brochure_block">
              <div className="content_parent">
                <div className="brochure_head">
                  <div className="brochure_head_title geelyBold">
                    {item?.title}
                  </div>
                  <div className="brochure_head_logo">
                    {item?.logo?.altText && (
                      <ImageComp
                        block={item?.logo}
                        imageClassName="object-contain h-full w-full"
                        width={138}
                        height={50}
                      />
                    )}
                  </div>
                </div>
                <div className="brochure_image">
                  {item?.image?.altText && (
                    <ImageComp
                      block={item?.image}
                      imageClassName="object-contain h-full w-full"
                      width={600}
                      height={600}
                    />
                  )}
                </div>
                <div className="brochure_text">
                  <p className="brochure_desc leading-[1.5]">
                    {item?.financeText} <br /> {item?.leaseText}
                  </p>
                  <div className="brochure_input mt-2">
                    <label
                      htmlFor={`brochure_${item._key}`}
                      className="offertext"
                    >
                      <input
                        type="radio"
                        id={`brochure_${item._key}`}
                        className="brochure_check"
                        name="brochure_check"
                        checked={selectedValues.includes(item.title ?? "")}
                        onChange={() => handleCheckboxChange(item.title ?? "")}
                      />{" "}
                      {item?.title}
                      <span className="star">*</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {formik.errors.brochure_check && formik.touched.brochure_check && (
          <p className="text-red-500 text-center text-sm mt-1">
            {formik.errors.brochure_check}
          </p>
        )}
        <div id="registerForm" className={`w-full md:pt-12 pt-10`}>
          <div className="">
            

            {/* Contact Form */}
            <form
              onSubmit={formik.handleSubmit}
              className="max-w-[1000px] mx-auto pb-12 rounded-sm text-center"
            >
             
                

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`${isSubmitting ? "cursor-not-allowed opacity-65 brochure-submit-btn" : ""} w-32 bg-black hover:bg-black/90 text-white py-2 px-4 inline-block rounded-sm`}
                >
                  {block?.form?.submitButtonLabel || "Submit"}
                  {isSubmitting && (
                    <Image
                      src="/images/infinite-spinner.svg"
                      alt="arrow right"
                      width={30}
                      height={15}
                      className="loaderImage inline-block"
                    />
                  )}
                </button>
              
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
