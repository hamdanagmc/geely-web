"use client";
import { saveServiceBookingForm } from "@/app/actions/keyloop/serviceBooking";
import { saveLeads } from "@/app/actions/sanity/leads";
import { countryCodeOptions } from "@/app/lib/constants/countryCodeOptions";
import { sendContactCustomerEmail } from "@/app/services/email/contact";
import { sendCRMServideBookingEmail } from "@/app/services/email/crm";
import { ServiceBookingProps } from "@/app/types/email";
import type { ServiceBookingForm } from "@/sanity.types";
import axios from "axios";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import * as Yup from "yup";

// Dynamically import react-select with ssr disabled
const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

type ServiceBookingFormProps = {
  block: ServiceBookingForm;
  index: number;
};

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

const validationSchema = Yup.object({
  fname: Yup.string().required("First Name is required"),
  lname: Yup.string().required("Last Name is required"),
  title: Yup.string().required("Title is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  vehicleType: Yup.string().required("Vehicle Type / Model is required"),
  modelYear: Yup.number()
    .typeError("Must be a number")
    .min(1900)
    .max(new Date().getFullYear() + 1),
  serviceCenter: Yup.string().required("Service Center is required"),
  agreed: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
  countrymobileNoCode: Yup.string().required("Country code is required"),
});

export default function ServiceBookingFormComp({ block }: ServiceBookingFormProps) {
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const currentLocale = pathSegments[1] || "en";
  const [isSubmitting, setSubmitting] = useState(false);

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
    setIsMounted(true);
  }, []);

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      title: "",
      email: "",
      phone: "",
      vehicleType: "",
      modelYear: 0,
      serviceCenter: "",
      agreed: false,
      countrymobileNoCode: "+971",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Handle form submission
      console.log(values);

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
      const response = await saveServiceBookingForm(values, csrfToken, token, currentLocale);
      console.log(response);
      const responseData = response.data as KeyloopResponse;
      if (responseData.InboundEnquiryResponse.status === "1") {
        //email logic
        await sendContactCustomerEmail(values.fname, values.email, currentLocale, "serviceBooking");
        const crmEmailProps = values as ServiceBookingProps;
        const pageUrl = window.location.href;
        await sendCRMServideBookingEmail(crmEmailProps, currentLocale, "Service Booking Form", pageUrl);

        // Sanity lead data
        const leadData = {
          title: values.title || "",
          firstName: values.fname || "",
          lastName: values.lname || "",
          email: values.email || "",
          phone: `${values.countrymobileNoCode || ""} ${values.phone || ""}`,
          fleetSize: "",
          companyName: "",
          comments:  "",
          formType: "Service Booking Form",
          vehicleMake:  "",
          vehicleModel: values.vehicleType || "",
          location: "",
          modelYear: values.modelYear.toString() || "",
          serviceCenter: values.serviceCenter || "",
          type: "",
          contactYou: "",
          pageUrl,
        };
        await saveLeads(leadData);

        setSubmitting(false);
        const slug = (block?.link as any)?.slug || "";
        window.location.href = currentLocale == 'en' ?`/${currentLocale}/${slug}` : `/${slug}`;
      }

      resetForm();
    },
  });

  // Convert options to react-select format
  const vehicleTypeOptions = block?.vehicleTypes?.map((option) => ({ value: option, label: option })) || [];
  const modelYearOptions = block?.modelYears?.map((option) => ({ value: option, label: option })) || [];
  const serviceTypeOptions = block?.serviceTypes?.map((option) => ({ value: option, label: option })) || [];
  const serviceCenterOptions = block?.serviceCenters?.map((option) => ({ value: option, label: option })) || [];
  const titleOptions = block?.formTitleTypes?.map((option) => ({ value: option, label: option })) || [];

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      />
      <div className={`w-full max-w-[1200px] mx-auto px-4 md:py-16 py-8`}>
        <div className="text-center mb-8">
          <h1 className="md:text-4xl text-[1.5rem] font-bold mb-4">{block?.title || "SERVICE BOOKING"}</h1>
          <p className="text-[#444746]">
            {block?.subTitle || "Request your service in advance to save time and keep your Geely running smoothly."}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="max-w-[1000px] mx-auto bg-[#f5f2f0] md:p-8 py-8 px-5 rounded-sm">
          <div className="grid gap-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                {block?.formTitle || 'Title'} <span className="text-red-500">*</span>
              </label>
              {isMounted ? (
                <Select
                  id="title"
                  name="title"
                  className="input-style borderBlueFocus"
                  styles={customStyles}
                  options={titleOptions}
                  value={titleOptions.find((option) => option.value === formik.values.title)}
                  onChange={(selectedOption) => {
                    formik.setFieldValue("title", (selectedOption as { value: string })?.value || "");
                  }}
                  onBlur={() => formik.setFieldTouched("title", true)}
                  placeholder={block?.formTitlePlaceholder || "Select Title"}
                />
              ) : (
                <input
                  type="text"
                  placeholder="Select Title"
                  className="input-style borderBlueFocus"
                  disabled
                />
              )}
              {formik.touched.title && formik.errors.title ? (
                <div className="error-field" style={{ color: "red" }}>
                  {formik.errors.title}
                </div>
              ) : null}
            </div>

            {/* Full Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fname" className="block text-sm font-medium text-gray-700">
                  {block?.firstNameLabel || 'First Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  id="fname"
                  name="fname"
                  type="text"
                  placeholder={block?.firstNamePlaceholder || ""}
                  className="input-style borderBlueFocus p-2 w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fname}
                  style={{
                    borderColor: formik.touched.fname && formik.errors.fname ? "red" : "",
                  }}
                />
                {formik.touched.fname && formik.errors.fname ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.fname}
                  </div>
                ) : null}
              </div>

              <div>
                <label htmlFor="lname" className="block text-sm font-medium text-gray-700">
                  {block?.lastNameLabel || 'Last Name'}<span className="text-red-500">*</span>
                </label>
                <input
                  id="lname"
                  name="lname"
                  type="text"
                  placeholder={block?.lastNamePlaceholder || ""}
                  className="input-style borderBlueFocus p-2 w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lname}
                  style={{
                    borderColor: formik.touched.lname && formik.errors.lname ? "red" : "",
                  }}
                />
                {formik.touched.lname && formik.errors.lname ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.lname}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {block?.emailAddressLabel || "Email Address"} <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={block?.emailAddressPlaceholder || ""}
                  className="input-style borderBlueFocus p-2 w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  style={{
                    borderColor: formik.touched.email && formik.errors.email ? "red" : "",
                  }}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  {block?.phoneNumberLabel || "Phone Number"}
                </label>
                <div className="md:flex gap-2 justify-between">
                  <div className="md:w-[205] w-full min-w-[205px]">
                    {isMounted ? (
                      <Select
                        className="w-full input-style border-0 h-[54px]"
                        options={countryCodeOptions}
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
                          formik.setFieldValue("countrymobileNoCode", (selectedOption as { value: string })?.value || "");
                        }}
                        onBlur={() => formik.setFieldTouched("countrymobileNoCode", true)}
                        placeholder={"Country code*"}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Country code*"
                        className="w-full input-style border-0 h-[54px]"
                        disabled
                      />
                    )}
                    {formik.touched.countrymobileNoCode && !formik.values.countrymobileNoCode && (
                      <div className="error-field" style={{ color: "red" }}>
                        {formik.errors.countrymobileNoCode}
                      </div>
                    )}
                  </div>

                  <div className="md:w-[70%] md:mt-0 mt-6 min-w-[100% - 190px] w-full">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder={block?.phoneNumberPlaceholder || "(201) 555-0123"}
                      className="input-style borderBlueFocus p-2 w-full"
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
              </div>
            </div>

            {/* Vehicle Type and Model Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                  {block?.vehicleTypeLabel || "Vehicle Type / Model"} <span className="text-red-500">*</span>
                </label>
                {isMounted ? (
                  <Select
                    id="vehicleType"
                    name="vehicleType"
                    className="input-style borderBlueFocus"
                    styles={customStyles}
                    options={vehicleTypeOptions}
                    value={vehicleTypeOptions.find((option) => option.value === formik.values.vehicleType)}
                    onChange={(selectedOption) => {
                      formik.setFieldValue("vehicleType", (selectedOption as { value: string } | null)?.value || "");
                    }}
                    onBlur={() => formik.setFieldTouched("vehicleType", true)}
                    placeholder={block?.vehicleTypeLabel || "Choose Vehicle Type / Model"}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={block?.vehicleTypeLabel || "Choose Vehicle Type / Model"}
                    className="input-style borderBlueFocus"
                    disabled
                  />
                )}
                {formik.touched.vehicleType && formik.errors.vehicleType ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.vehicleType}
                  </div>
                ) : null}
              </div>
              <div>
                <label htmlFor="modelYear" className="block text-sm font-medium text-gray-700">
                  {block?.modelYearLabel || "Model Year"}
                </label>

                {isMounted ? (
                  <Select
                    id="modelYear"
                    name="modelYear"
                    className="input-style borderBlueFocus"
                    styles={customStyles}
                    options={modelYearOptions}
                    value={modelYearOptions.find((option) => option.value === formik.values.modelYear)}
                    onChange={(selectedOption) => {
                      formik.setFieldValue("modelYear", (selectedOption as { value: string } | null)?.value || "");
                    }}
                    onBlur={() => formik.setFieldTouched("modelYear", true)}
                    placeholder={block?.modelYearLabel || "Choose Model Year"}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={block?.modelYearLabel || "Choose Model Year"}
                    className="input-style borderBlueFocus"
                    disabled
                  />
                )}
                {formik.touched.modelYear && formik.errors.modelYear ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.modelYear}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Service Center */}
            <div>
              <label htmlFor="serviceCenter" className="block text-sm font-medium text-gray-700">
                {block?.serviceCenterLabel || "Choose A Service Center:"} <span className="text-red-500">*</span>
              </label>
              {isMounted ? (
                <Select
                  id="serviceCenter"
                  name="serviceCenter"
                  className="input-style borderBlueFocus"
                  styles={customStyles}
                  options={serviceCenterOptions}
                  value={serviceCenterOptions.find((option) => option.value === formik.values.serviceCenter)}
                  onChange={(selectedOption) => {
                    formik.setFieldValue("serviceCenter", (selectedOption as { value: string })?.value);
                  }}
                  onBlur={() => formik.setFieldTouched("serviceCenter", true)}
                  placeholder={block?.serviceCenterLabel || "Choose A Service Center"}
                />
              ) : (
                <input
                  type="text"
                  placeholder={block?.serviceCenterLabel || "Choose A Service Center"}
                  className="input-style borderBlueFocus"
                  disabled
                />
              )}
              {formik.touched.serviceCenter && formik.errors.serviceCenter ? (
                <div className="error-field" style={{ color: "red" }}>
                  {formik.errors.serviceCenter}
                </div>
              ) : null}
            </div>

            {/* Terms and Conditions */}
            <div className="flex space-x-2 rtl:space-x-reverse">
              <input
                id="agreed"
                name="agreed"
                type="checkbox"
                className="form-checkbox h-4 w-4"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.agreed}
              />
              <label htmlFor="agreed" className="text-sm font-medium text-gray-700">
                {block?.termsAndConditionsLabel || "I have read and accept"}{" "}
                <a href={block?.termsAndConditionsLink} className="text-[#0070b7] hover:underline">
                  {block?.termsAndConditionsLinkText || "Terms & Conditions"}
                </a>
              </label>
            </div>
            {formik.touched.agreed && formik.errors.agreed ? (
              <div className="error-field" style={{ color: "red" }}>
                {formik.errors.agreed}
              </div>
            ) : null}

            {/* Submit Button */}
            <button type="submit" className={`${isSubmitting ? "cursor-not-allowed opacity-65" : ""} w-32 bg-black hover:bg-black/90 text-white py-2 px-4 rounded-sm`}>
              {block?.submitLabel || "Submit"}
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
    </>
  );
}