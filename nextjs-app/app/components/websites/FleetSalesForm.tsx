"use client";
import { saveFleetSalesForm } from "@/app/actions/keyloop/fleetSales";
import { saveLeads } from "@/app/actions/sanity/leads";
import { countryCodeOptions } from "@/app/lib/constants/countryCodeOptions";
import { sendContactCustomerEmail } from "@/app/services/email/contact";
import { sendCRMFleetSalesEmail } from "@/app/services/email/crm";
import { FleetSalesFormProps } from "@/app/types/email";
import { FleetContactFormSection } from "@/sanity.types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import * as Yup from "yup";


type FleetContactFormSectionProps = {
  block: FleetContactFormSection;
};

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});


interface FormValues {
  fname: string;
  lname: string;
  title: string;
  email: string;
  phone: string;
  fleetSize: string;
  companyName: string;
  comments: string;
  agreed: boolean;
  countrymobileNoCode: string;
  referring_url: string;
}

const validationSchema = Yup.object({
  fname: Yup.string().required("First Name is required"),
  lname: Yup.string().required("Last Name is required"),
  title: Yup.string().required("Title is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be only digits")
    .min(9, "Phone number must be at least 9 digits")
    .required("Phone number is required"),
  fleetSize: Yup.string().required("Please select Fleet Size"),
  companyName: Yup.string().required("Company Name is required"),
  agreed: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
  comments: Yup.string().required("Comments are required"),
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

export default function FleetSalesForm({ block }: FleetContactFormSectionProps) {
  const [phone, setPhone] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
      const savedRef = getCookie('referring_url');
      if (savedRef) {
        formik.setFieldValue("referring_url", savedRef);
      }
    }, [isMounted]);

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
      fname: "",
      lname: "",
      title: "",
      email: "",
      phone: "",
      fleetSize: "",
      comments: "",
      companyName: "",
      agreed: false,
      countrymobileNoCode: "",
      referring_url: "",
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
      const response = await saveFleetSalesForm(values, csrfToken, token, currentLocale);
      console.log(response);
      const responseData = response.data as KeyloopResponse;
      if (responseData.InboundEnquiryResponse.status === "1") {
        //email logic
        await sendContactCustomerEmail(values.fname, values.email, currentLocale, "fleetSales");
        const crmEmailProps = values as FleetSalesFormProps;
        const pageUrl = window.location.href;
        await sendCRMFleetSalesEmail(crmEmailProps, currentLocale, "Fleet Sales Form", pageUrl);
        // Save the lead data to Sanity
        const leadData = {
          title: values.title,
          firstName: values.fname,
          lastName: values.lname,
          email: values.email,
          phone: `${values.countrymobileNoCode} ${values.phone}`,
          fleetSize: values.fleetSize,
          companyName: values.companyName,
          comments: values.comments,
          formType: "Fleet Sales Form",
          vehicleMake: "",
          vehicleModel: "",
          location: "",
          modelYear:"",
          serviceCenter:  "",
          type: "",
          contactYou: "",
          pageUrl,
          referring_url: values.referring_url || "",
        };
        await saveLeads(leadData);

        //zapier logic
        await fetch("/api/zap/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formName: "Fleet Sales Form",
            utmUrl : pageUrl,
            ...values,
          }),
        });
        
        setSubmitting(false);
        const slug = (block?.form?.link as any)?.slug || "";
        window.location.href = currentLocale == 'en' ?`/${currentLocale}/${slug}` : `/${slug}`;
      }

      resetForm();
    },
  });

  // Convert options to react-select format
  const typeOptions = block?.form?.fleetSizeDropdownValues?.map((option) => ({
    value: option,
    label: option,
  })) || [];
  const titleOptions = block?.form?.titleDropdownValues?.map((option) => ({
    value: option,
    label: option,
  })) || [];

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      />
      <div id="registerForm" className={`w-full max-w-7xl mx-auto px-4 md:py-16 py-10`}>
        <div className="bg-[#f5f2f0] md:p-8 pt-8 rounded-sm">
          <h2 className="text-2xl md:text-3xl pt-5 font-semibold text-center">
            {block?.title || "Contact Us"}
          </h2>

          {/* Contact Form */}
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-[1000px] mx-auto bg-[#f5f2f0] md:p-8 py-4 px-4 rounded-sm"
          >
            {/* referring url hidden field */}
            <input
              type="hidden"
              name="referring_url"
              value={formik.values.referring_url}
            />
            <div className="grid gap-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  {block?.form?.titleLabel || "Title"} <span className="text-red-500">*</span>
                </label>
                {isMounted ? (
                  <Select
                    id="title"
                    name="title"
                    className="input-style borderBlueFocus"
                    styles={customStyles}
                    options={titleOptions}
                    value={titleOptions.find(
                      (option) => option.value === formik.values.title
                    )}
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "title",
                        (selectedOption as { value: string })?.value || ""
                      );
                    }}
                    onBlur={() => formik.setFieldTouched("title", true)}
                    placeholder={block?.form?.titlePlaceholder || "Select Title"}
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
                  <label
                    htmlFor="fname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {block?.form?.firstNameLabel || ' First Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fname"
                    name="fname"
                    type="text"
                    className="input-style borderBlueFocus p-2 w-full"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fname}
                    placeholder={block?.form?.firstNamePlaceholder || ''}
                    style={{
                      borderColor:
                        formik.touched.fname && formik.errors.fname ? "red" : "",
                    }}
                  />
                  {formik.touched.fname && formik.errors.fname ? (
                    <div className="error-field" style={{ color: "red" }}>
                      {formik.errors.fname}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="lname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {block?.form?.lastNameLabel || 'Last Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lname"
                    name="lname"
                    type="text"
                    className="input-style borderBlueFocus p-2 w-full"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lname}
                    placeholder={block?.form?.lastNamePlaceholder || ''}
                    style={{
                      borderColor:
                        formik.touched.lname && formik.errors.lname ? "red" : "",
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {block?.form?.emailLabel || 'Email'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input-style borderBlueFocus p-2 w-full"
                    placeholder={block?.form?.emailPlaceholder || ''}
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
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {block?.form?.phoneLabel || 'Phone Number'} <span className="text-red-500">*</span>
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
                            formik.setFieldValue(
                              "countrymobileNoCode",
                              (selectedOption as { value: string })?.value || ""
                            );
                          }}
                          onBlur={() =>
                            formik.setFieldTouched("countrymobileNoCode", true)
                          }
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
                      {formik.touched.countrymobileNoCode &&
                        !formik.values.countrymobileNoCode && (
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
                        placeholder={block?.form?.phonePlaceholder || ''}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="fleetSize"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {block?.form?.fleetSizeLabel || 'Fleet Size'} <span className="text-red-500">*</span>
                  </label>
                  {isMounted ? (
                    <Select
                      id="fleetSize"
                      name="fleetSize"
                      className="input-style borderBlueFocus"
                      styles={customStyles}
                      options={typeOptions}
                      value={typeOptions.find(
                        (option) => option.value === formik.values.fleetSize
                      )}
                      onChange={(selectedOption) => {
                        formik.setFieldValue(
                          "fleetSize",
                          (selectedOption as { value: string } | null)?.value ||
                          ""
                        );
                      }}
                      onBlur={() => formik.setFieldTouched("fleetSize", true)}
                      placeholder={block?.form?.fleetSizePlaceholder || 'Select Option'}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="Select Option"
                      className="input-style borderBlueFocus"
                      disabled
                    />
                  )}
                  {formik.touched.fleetSize && formik.errors.fleetSize ? (
                    <div className="error-field" style={{ color: "red" }}>
                      {formik.errors.fleetSize}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {block?.form?.companyNameLabel || 'Company Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    className="input-style borderBlueFocus p-2 w-full"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyName}
                    placeholder={block?.form?.companyNamePlaceholder || ''}
                    style={{
                      borderColor:
                        formik.touched.companyName && formik.errors.companyName ? "red" : "",
                    }}
                  />
                  {formik.touched.companyName && formik.errors.companyName ? (
                    <div className="error-field" style={{ color: "red" }}>
                      {formik.errors.companyName}
                    </div>
                  ) : null}
                </div>

              </div>



              {/* Comments */}
              <div className="space-y-2">
                <label
                  htmlFor="comments"
                  className="block text-sm font-medium text-gray-700"
                >
                  {block?.form?.commentsLabel || 'Comments'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.comments}
                  className="input-style borderBlueFocus w-full min-h-[120px]"
                  style={{
                    borderColor:
                      formik.touched.comments && formik.errors.comments
                        ? "red"
                        : "",
                  }}
                />
                {formik.touched.comments && formik.errors.comments ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.comments}
                  </div>
                ) : null}
              </div>

              {/* Terms and Conditions */}
              <div>
                <div className="flex ltr:space-x-2 rtl:space-x-reverse">
                  <input
                    id="agreed"
                    name="agreed"
                    type="checkbox"
                    className="h-4 w-4 rtl:ml-2"
                    onChange={formik.handleChange}
                    checked={formik.values.agreed}
                  />
                  <label htmlFor="agreed" className="text-sm font-medium text-gray-700">
                    I have read the<a href={`/en/privacy-policy`} className="text-[#0070b7] mx-1 hover:underline">
                      privacy policy</a>and agree.
                  </label>
                </div>
                {formik.touched.agreed && formik.errors.agreed ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.agreed}
                  </div>
                ) : null}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`${isSubmitting ? "cursor-not-allowed opacity-65" : ""} w-32 bg-black hover:bg-black/90 text-white py-2 px-4 rounded-sm`}
              >
                {block?.form?.submitButtonLabel || 'Submit'}
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