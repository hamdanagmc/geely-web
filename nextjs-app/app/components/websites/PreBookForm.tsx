"use client"
import { countryCodeOptions } from "@/app/lib/constants/countryCodeOptions"
import verifyRecaptcha from "@/app/utils/recaptcha"
import type { PreBookForm } from "@/sanity.types"
import axios from "axios"
import { getCookie } from "cookies-next"
import { useFormik } from "formik"
import dynamic from "next/dynamic"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Script from "next/script"
import { useEffect, useRef, useState } from "react"
import * as Yup from "yup"
import { useTestDrive } from "../../context/TestDriveContext"
import { getSiteSettingData } from "@/app/actions/common/sanityData"
import { identifyWebEngageUser } from "@/app/lib/webengage"

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

type PreBookFormProps = {
  block: PreBookForm
  index: number
}

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be only digits")
    .min(9, "Phone number must be at least 9 digits")
    .required("Phone number is required"),
  selectedModelTitle: Yup.string().required("Location is required"),
  modelYear: Yup.string(),
  agreed: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
  countrymobileNoCode: Yup.string().required("Country code is required"),
})

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderColor: state.isFocused ? "black" : "#e5e7eb",
    boxShadow: "none",
    fontSize: "14px",
    borderRadius: "0",
    borderWidth: "1px",
    minHeight: "50px",
    padding: "0 15px",
    "&:hover": {
      borderColor: state.isFocused ? "black" : "#e5e7eb",
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
}

export default function PreBookFormCmp({ block }: PreBookFormProps) {
  const [isClient, setIsClient] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const swiperRef = useRef<any>(null)
  const { selectedTestDrive } = useTestDrive()
  const [isSubmitting, setSubmitting] = useState(false);
  const [siteSettingData, setSiteSettingData] = useState<any>(null);

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

  useEffect(() => {
    setIsClient(true)
    setIsMounted(true)

    const fetchSiteSettings = async () => {
      try {
        const data = await getSiteSettingData(currentLocale);
        setSiteSettingData(data);
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      }
    };
    fetchSiteSettings();
  }, [currentLocale])

  useEffect(() => {
    const savedRef = getCookie('referring_url');
    if (savedRef) {
      formik.setFieldValue("referring_url", savedRef);
    }
  }, [isMounted]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileDevice(window.innerWidth <= 768)
    }

    // Initial check
    checkIsMobile()

    // Listen for window resize events
    window.addEventListener("resize", checkIsMobile)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  const locationOptions = (block?.locations || block?.locations)?.map((item: any) => ({
    value: item,
    label: item,
  })) ?? [];

  const selectLabel = block?.locationLabel || "Select Location";

  useEffect(() => {
    if (selectedTestDrive) {
      formik.setFieldValue("selectedModelTitle", selectedTestDrive);
    }
  }, [selectedTestDrive])

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      selectedModelTitle: selectedTestDrive || "",
      modelYear: "",
      agreed: false,
      countrymobileNoCode: "+971",
      referring_url: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Handle form submission
      console.log(values)
      setSubmitting(true);

      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        console.log("Recpatcha site key not found!");
        return;
      }
      const token = await grecaptcha.execute(siteKey, {
        action: "geelyTestDriveForm",
      });
      if (!token) {
        console.log("Recpatch failed");
        return;
      }
      if (!csrfToken) {
        console.log("CSRF token not found");
        return;
      }
      //const formType = { name: 'preBook', title: "Pre Book Now" };

      //verify recaptcha
      const recaptchaResponse = await verifyRecaptcha(token);
      if (!recaptchaResponse.status) {
        console.log("Recaptcha verification failed");
        setSubmitting(false);
        return;
      }

      const body = {
        fullName: values.fullName,
        email: values.email,
        mobile: values.countrymobileNoCode + values.phone,
        location: values.selectedModelTitle,
        pageUrl: window.location.href,
        redirectUrl: process.env.NEXT_PUBLIC_SITE_URL + '/en/prebook-thankyou',
        // amount is determined server-side to prevent tampering
        currency: 'AED',
        currentLocale: currentLocale
      }

      // Identify before the request: on success the page redirects straight to the payment gateway
      const [firstName, ...lastName] = (values.fullName || "").trim().split(/\s+/)
      identifyWebEngageUser({ firstName, lastName: lastName.join(" "), email: values.email, phone: body.mobile })

      try {
        const createPaymentResponse = await fetch("/api/pre-booking/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const resData = await createPaymentResponse.json()
        if (resData.success) {
          window.location.href = resData.paymentUrl;

        }
      } catch (error) {
        console.log(error);
      }




      //zapier logic
      /*await fetch("/api/zap/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formName: formType.title,
          utmUrl: pageUrl,
          ...values,
        }),
      });*/

      setSubmitting(false);
      resetForm()
    },
  })

  return (
    <>
      <style>{`.grecaptcha-badge { visibility: hidden !important; }`}</style>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      />

      <div id="preBookNow" className={`w-full max-w-[1180px] mx-auto px-4 py-16`}>
        <div className="text-center mb-10">
          <h2 className="text-[32px] md:text-[35px] font-black uppercase mb-2">{block?.formTitle?.replace('{prebookAmount}', siteSettingData?.preBookingAmountGeelyM9?.toString() || '')}</h2>
          <p className="text-[#000000] text-base md:text-lg">{block?.formSubTitle}</p>
        </div>

        <div className="bg-[#F6F4F2] md:p-12 p-6 rounded-sm">
          <form onSubmit={formik.handleSubmit} className="max-w-[1020px] mx-auto space-y-6">
            <input type="hidden" name="referring_url" value={formik.values.referring_url} />

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                {block?.fullNameLabel} <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
              />
              {formik.touched.fullName && formik.errors.fullName ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.fullName}</div>
              ) : null}
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {block?.emailPlaceholder?.label} <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                ) : null}
              </div>

              <div>
                <label htmlFor="selectedModelTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  {selectLabel} <span className="text-red-500">*</span>
                </label>
                <div className="bg-white">
                  {isMounted ? (
                    <Select
                      id="selectedModelTitle"
                      name="selectedModelTitle"
                      options={locationOptions}
                      styles={customStyles}
                      value={
                        formik.values.selectedModelTitle
                          ? {
                            value: formik.values.selectedModelTitle,
                            label: formik.values.selectedModelTitle,
                          }
                          : null
                      }
                      onChange={(selectedOption: any) => {
                        formik.setFieldValue(
                          "selectedModelTitle",
                          (selectedOption as { value: string })?.value || ""
                        );
                      }}
                    />
                  ) : (
                    <input type="text" className="w-full p-3 border border-gray-200" disabled />
                  )}
                </div>
                {formik.touched.selectedModelTitle && formik.errors.selectedModelTitle ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.selectedModelTitle}</div>
                ) : null}
              </div>


            </div>

            {/* Vehicle Type / Model and Model Year */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                   {block?.phone?.label} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="w-[140px] shrink-0 bg-white">
                    {isMounted ? (
                      <Select
                        className="w-full h-full"
                        options={countryCodeOptions}
                        name="countrymobileNoCode"
                        styles={customStyles}
                        value={
                          formik.values.countrymobileNoCode
                            ? { value: formik.values.countrymobileNoCode, label: formik.values.countrymobileNoCode }
                            : null
                        }
                        onChange={(selectedOption: any) => {
                          formik.setFieldValue("countrymobileNoCode", (selectedOption as { value: string })?.value || "")
                        }}
                        onBlur={() => formik.setFieldTouched("countrymobileNoCode", true)}
                      />
                    ) : (
                      <input type="text" className="w-full p-3 border border-gray-200" disabled />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder={block?.phone?.placeholder}
                      className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                    />
                  </div>
                </div>
                {formik.touched.phone && formik.errors.phone ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
                ) : null}
              </div>


            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start mt-6">
              <input
                id="agreed"
                name="agreed"
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300"
                onChange={formik.handleChange}
                checked={formik.values.agreed}
              />
              <label htmlFor="agreed" className="ml-2 text-sm text-gray-700">
                {block?.termsAndConditions?.label} (
                <a href={block?.termsAndConditions?.link || "#"} className="text-[#0070b7] hover:underline">
                  {block?.termsAndConditions?.termsAndConditionsTitle}
                </a>
                )
              </label>
            </div>
            {formik.touched.agreed && formik.errors.agreed ? (
              <div className="text-red-500 errorMTop text-sm mt-1">{formik.errors.agreed}</div>
            ) : null}

            {/* Submit Button */}
            <div className="pt-0">
              <button
                type="submit"
                className={`${isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:bg-black/90"
                  } bg-black text-white md:px-10 px-4 py-3 rounded-sm font-medium transition-colors flex items-center justify-center md:w-auto w-full min-w-[140px]`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Image src="/images/infinite-spinner.svg" alt="loading" width={24} height={24} className="animate-spin" />
                ) : (
                  block?.submitLabel?.replace('{prebookAmount}', siteSettingData?.preBookingAmountGeelyM9?.toString() || '')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

