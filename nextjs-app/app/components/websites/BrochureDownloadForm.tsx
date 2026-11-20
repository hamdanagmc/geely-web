"use client";
import { countryCodeOptions } from "@/app/lib/constants/countryCodeOptions";
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
import { identifyWebEngageUser, slugify, useWebEngageForm } from "@/app/lib/webengage";
import { modelRef } from "@/app/lib/webengage-reference";
import { getCookie } from "cookies-next";

type BrochureDownloadFormSectionProps = {
  block: BrochureDownloadFormSection;
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
  brochure_check: string[];
  countrymobileNoCode: string;
  contactYou: string;
  referring_url?: string;
}

const validationSchema = Yup.object({
  fname: Yup.string().required("First Name is required"),
  lname: Yup.string().required("Last Name is required"),
  title: Yup.string().required("Title is required"),
  contactYou: Yup.string().required("Contact field is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be only digits")
    .min(9, "Phone number must be at least 9 digits")
    .required("Phone number is required"),
  agreed: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
  brochure_check: Yup.array()
    .min(1, "Please select a brochure to download.")
    .required("Selection is required"),
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

  useEffect(() => {
    const savedRef = getCookie('referring_url');
    if (savedRef) {
      formik.setFieldValue("referring_url", savedRef);
    }
  }, [isMounted]);

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
      brochure_check: [],
      countrymobileNoCode: "",
      contactYou: "",
      referring_url: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        console.log("Recpatcha site key not found!");
        return;
      }
      const token = await grecaptcha.execute(siteKey, {
        action: "geelyContactForm",
      });
      if (!token) {
        console.log("Recpatch failed");
        return;
      }
      if (!csrfToken) {
        console.log("CSRF token not found");
        return;
      }
      const leadData = {
        title: values.title || "",
        firstName: values.fname || "",
        lastName: values.lname || "",
        email: values.email || "",
        phone: `${values.countrymobileNoCode || ""} ${values.phone || ""}`,
        fleetSize: "",
        companyName: "",
        comments: values.comments || "",
        formType: "Brochure Download Form",
        vehicleMake: "",
        vehicleModel: values.brochure_check.join(", ") || "",
        location: "",
        modelYear: "",
        serviceCenter: "",
        type: "",
        contactYou: values.contactYou || "",
        pageUrl: window.location.href,
        referring_url: values.referring_url || "",
      };
      const response = await saveLeads(leadData, csrfToken, token);
      if (!response.status) {
        console.log(response.message);
        weForm.failed(response.message);
        setSubmitting(false);
        return;
      }
      identifyWebEngageUser(leadData);
      weForm.submitted("Brochure Requested", {
        model_id: modelRef(values.brochure_check[0])?.id ?? slugify(values.brochure_check[0]),
        contact_requested: values.contactYou === "yes",
        terms_accepted: values.agreed,
      });

      // Trigger PDF downloads
      downloadValues
        .filter((item) => item.title && selectedValues.includes(item.title))
        .map((item) => urlForPDF(item.brochureFile) || "")
        .forEach((pdfUrl) => {
          if (pdfUrl) {
            window.open(pdfUrl, "_blank");
          }
        });

      // Reset form and selected values
      resetForm();
      setSelectedValues([]);

      //redirect to thankyou page
      const slug = (block?.form?.link as any)?.slug || "";
      window.location.href = currentLocale == 'en' ? `/${currentLocale}/${slug}` : `/${slug}`;
      setSubmitting(false);

    },
  });

  // Convert options to react-select format
  const titleOptions =
    block?.form?.titleDropdownValues?.map((option) => ({
      value: option,
      label: option,
    })) || [];

  useEffect(() => {
    formik.setFieldValue("brochure_check", selectedValues);
  }, [selectedValues]);

  const weForm = useWebEngageForm(formik, "brochure");
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
        <div id="registerForm" className={`w-full md:pt-16 pt-10`}>
          <div className="bg-[#f5f2f0] md:p-8 py-8 rounded-sm md:px-0 px-4">
            <h2 className="text-2xl md:text-3xl pt-5 font-semibold text-center">
              {block?.form?.heading}
            </h2>
            <p className="text-[1rem] md:[18px]pt-5 font-medium text-center">
              {block?.form?.subHeading}
            </p>

            {/* Contact Form */}
            <form {...weForm.startProps}
              onSubmit={formik.handleSubmit}
              className="max-w-[1000px] mx-auto bg-[#f5f2f0] md:p-8 py-4 rounded-sm"
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
                    {block?.form?.titleLabel || "Title"}{" "}
                    <span className="text-red-500">*</span>
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
                      placeholder={
                        block?.form?.titlePlaceholder || "Select Title"
                      }
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
                      {block?.form?.firstNameLabel || " First Name"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fname"
                      name="fname"
                      type="text"
                      className="input-style borderBlueFocus p-2 w-full"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.fname}
                      placeholder={block?.form?.firstNamePlaceholder || ""}
                      style={{
                        borderColor:
                          formik.touched.fname && formik.errors.fname
                            ? "red"
                            : "",
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
                      {block?.form?.lastNameLabel || "Last Name"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lname"
                      name="lname"
                      type="text"
                      className="input-style borderBlueFocus p-2 w-full"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lname}
                      placeholder={block?.form?.lastNamePlaceholder || ""}
                      style={{
                        borderColor:
                          formik.touched.lname && formik.errors.lname
                            ? "red"
                            : "",
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
                      {block?.form?.emailLabel || "Email"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="input-style borderBlueFocus p-2 w-full"
                      placeholder={block?.form?.emailPlaceholder || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      style={{
                        borderColor:
                          formik.touched.email && formik.errors.email
                            ? "red"
                            : "",
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
                      {block?.form?.phoneLabel || "Phone Number"}{" "}
                      <span className="text-red-500">*</span>
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
                          placeholder={block?.form?.phonePlaceholder || ""}
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

                <div className="space-y-2">
                  <label
                    htmlFor="contactYou"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {block?.form?.contactYouLabel ||
                      "Do you want us to contact you?"}{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div>
                    <input
                      type="radio"
                      id="contactYes"
                      name="contactYou"
                      value="yes"
                      checked={formik.values.contactYou === "yes"}
                      onChange={formik.handleChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="contactYes"
                      className="text-sm font-medium text-gray-700 mr-4"
                    >
                      {block?.form?.contactYouYes || "Yes"}
                    </label>

                    <input
                      type="radio"
                      id="contactNo"
                      name="contactYou"
                      value="no"
                      checked={formik.values.contactYou === "no"}
                      onChange={formik.handleChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="contactNo"
                      className="text-sm font-medium text-gray-700"
                    >
                      {block?.form?.contactYouNo || "No"}
                    </label>
                  </div>

                  {formik.touched.contactYou && formik.errors.contactYou ? (
                    <div className="error-field" style={{ color: "red" }}>
                      {formik.errors.contactYou}
                    </div>
                  ) : null}
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  <label
                    htmlFor="comments"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {block?.form?.messagelabel || "Message"}{" "}

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
                    <label
                      htmlFor="agreed"
                      className="text-sm font-medium text-gray-700"
                    >
                      {block?.form?.termsAndConditions?.label ||
                        "I have read and accept"}{" "}
                      <a
                        href={block?.form?.termsAndConditions?.link || "#"}
                        className="text-[#0070b7] hover:underline"
                      >
                        {block?.form?.termsAndConditions
                          ?.termsAndConditionsTitle || "Terms & Conditions"}
                      </a>
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
                  className={`${isSubmitting ? "cursor-not-allowed opacity-65 brochure-submit-btn" : ""} w-32 bg-black hover:bg-black/90 text-white py-2 px-4 rounded-sm`}
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}