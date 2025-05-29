"use client";
import { saveOptOutLeads } from "@/app/actions/sanity/optOutLeads";
import { countryCodeOptions } from "@/app/lib/constants/countryCodeOptions";
import { sendCRMOptOutEmail } from "@/app/services/email/optOut";
import { OptOutFormFields } from "@/app/types/email";
import { OptOutForm } from "@/sanity.types";
import axios from "axios";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import * as Yup from "yup";


type OptOutFormProps = {
  block: OptOutForm;
};

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});


interface FormValues {
  name: string;
  email: string;
  phone: string;
  stopMarketing: string;
  countrymobileNoCode: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be only digits")
    .min(9, "Phone number must be at least 9 digits")
    .required("Phone number is required"),
  stopMarketing: Yup.string().required("Please select an option"),
  countrymobileNoCode: Yup.string().required("Country code is required"),
});

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderColor: "transparent",
    boxShadow: "none",
    fontSize: "14px",
    borderRadius: "0",
    border: 0,
    padding: "4px 15px",
    "&:hover": {
      borderColor: "transparent",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "gray",
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
    padding: "8px",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    cursor: "pointer",
    outline: 0,
  }),
};

export default function OptOutFormComp({ block }: OptOutFormProps) {
  const [phone, setPhone] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const currentLocale = pathSegments[1] || "en";

  //generate and set csrf token
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("/api/csrf");
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      stopMarketing: "",
      countrymobileNoCode: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Handle form submission
      setSubmitting(true);
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        console.log("Recpatcha site key not found!");
        return;
      }
      const token = await grecaptcha.execute(siteKey, {
        action: "geelyOptOutForm",
      });
      if (!token) {
        console.log("Recpatch failed");
        return;
      }
      if (!csrfToken) {
        console.log("CSRF token not found");
        return;
      }

      //email logic
      const crmEmailProps = values as OptOutFormFields;
      const pageUrl = window.location.href;
      const response = await sendCRMOptOutEmail(crmEmailProps, currentLocale, "Opt-Out Form", pageUrl, token, csrfToken);
      if (response.status) {
        setSubmitting(false);
        await saveOptOutLeads({
          name: values.name,
          email: values.email,
          phone: values.countrymobileNoCode + values.phone,
          stopMarketing: values.stopMarketing,
        });
        const slug = (block?.link as any)?.slug || "";
        window.location.href = `/${currentLocale}/${slug}`;
        resetForm();
      } 
      
    },
  });



  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      />
      <div id="registerForm" className={`w-full max-w-7xl mx-auto px-4 md:py-16 py-10`}>
        <div className="bg-[#f5f2f0] md:p-8 pt-8 rounded-sm">
          <h2 className="text-2xl md:text-3xl pt-5 font-semibold text-center">
            {block?.heading || "Contact Us"}
          </h2>

          {/* Contact Form */}
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-[1000px] mx-auto bg-[#f5f2f0] md:p-8 py-4 px-4 rounded-sm"
          >
            <div className="grid gap-6">

              {/* Full Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {block?.nameLabel || ' First Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="input-style borderBlueFocus p-2 w-full"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    placeholder={block?.namePlaceholder || ''}
                    style={{
                      borderColor:
                        formik.touched.name && formik.errors.name ? "red" : "",
                    }}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="error-field" style={{ color: "red" }}>
                      {formik.errors.name}
                    </div>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {block?.emailLabel || 'Email'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input-style borderBlueFocus p-2 w-full"
                    placeholder={block?.emailPlaceholder || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    style={{
                      borderColor:
                        formik.touched.email && formik.errors.email ? "red" : "",
                    }}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="error-field" style={{ color: "red" }}>
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {block?.phoneLabel ?? "Phone"} <span className="text-red-500">*</span>
                  </label>
                  {isMounted ? (
                    <Select
                      className="w-full input-style border-0 h-[54px]"
                      options={countryCodeOptions}
                      id="countrymobileNoCode"
                      name="countrymobileNoCode"
                      styles={customStyles}
                      value={
                        formik.values.countrymobileNoCode
                          ? {
                            value: formik.values.countrymobileNoCode,
                            label: formik.values.countrymobileNoCode,
                          }
                          : null
                      }
                      onChange={(selectedOption) => {
                        formik.setFieldValue(
                          "countrymobileNoCode",
                          (selectedOption as { value: string })?.value || ""
                        );
                      }}
                      onBlur={() =>
                        formik.setFieldTouched("countrymobileNoCode", true)
                      }
                      placeholder={block?.countryCodePlaceholder ?? "Country code*"}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={block?.countryCodePlaceholder ?? "Country code*"}
                      className="w-full input-style border-0 h-[54px]"
                      id="countrymobileNoCode"
                      name="countrymobileNoCode"
                      disabled
                    />
                  )}
                  {formik.touched.countrymobileNoCode &&
                    !formik.values.countrymobileNoCode && (
                      <div className="error-field" style={{ color: "red" }}>
                        {formik.errors.countrymobileNoCode}
                      </div>
                    )}
                </div>

                <div>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={block?.phonePlaceholder || ''}
                    className="input-style borderBlueFocus p-2 w-full"
                    style={{ marginTop: "30px" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="error-field" style={{ color: "red" }}>
                      {formik.errors.phone}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Stop Marketing Communication */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {block?.stopMarketingLabel || "Do you wish to stop receiving marketing communications from Geely?"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stopMarketing"
                      value="yes"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.stopMarketing === "yes"}
                      className="mr-2"
                    />
                    {block?.yesLabel || "Yes"}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stopMarketing"
                      value="no"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.stopMarketing === "no"}
                      className="mr-2"
                    />
                    {block?.noLabel || "No"}
                  </label>
                </div>
                {formik.touched.stopMarketing && formik.errors.stopMarketing ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.stopMarketing}
                  </div>
                ) : null}
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                className={`${isSubmitting ? "cursor-not-allowed opacity-65" : ""} w-32 bg-black hover:bg-black/90 text-white py-2 px-4 rounded-sm`}
              >
                {block?.submitButtonLabel || 'Submit'}
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
}