"use client";
import { useState, useEffect } from "react";
import { countryCodeOptions } from "@/app/lib/constants/countryCodeOptions";
import type { CustomerCareFormSection } from "@/sanity.types";
import { useFormik } from "formik";
import * as Yup from "yup";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

type CustomerCareFormSectionProps = {
  block: CustomerCareFormSection;
  index: number;
};

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  complaintType: Yup.string().required("Type is required"),
  complaintLabel: Yup.string().required("Complaint is required"),
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

export default function ServiceBookingFormComp({
  block,
}: CustomerCareFormSectionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      complaintType: "",
      complaintLabel: "",
      countrymobileNoCode: "+971",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Handle form submission
      console.log(values);
      resetForm();
    },
  });

  return (
    <div className={`w-full max-w-[1200px] mx-auto px-4 py-16`}>
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-[1000px] mx-auto bg-[#f5f2f0] p-8 rounded-sm"
      >
        <div className="grid gap-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block capitalize text-sm font-medium text-gray-700"
            >
              {block?.nameLabel || "Full Name"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="input-style borderBlueFocus p-2 w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fullName}
              style={{
                borderColor:
                  formik.touched.fullName && formik.errors.fullName
                    ? "red"
                    : "",
              }}
            />
            {formik.touched.fullName && formik.errors.fullName ? (
              <div className="error-field" style={{ color: "red" }}>
                {formik.errors.fullName}
              </div>
            ) : null}
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {block?.emailLabel || "Email Address"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-style borderBlueFocus p-2 w-full"
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
                {block?.phoneLabel || "Phone Number"}
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
                    placeholder={block?.phonePlaceholder || "050 123XXXX"}
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
          <div className="grid">
            <div>
              <label
                htmlFor="complaintType"
                className="block text-sm font-medium text-gray-700"
              >
                {block?.complaintTypeLabel || "Type"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="complaintType"
                name="complaintType"
                className="input-style borderBlueFocus p-2 w-full"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.complaintType}
                style={{
                  borderColor:
                    formik.touched.complaintType && formik.errors.complaintType
                      ? "red"
                      : "",
                }}
              >
                <option value="">
                  {block?.complaintPlaceholder || "Choose Vehicle Type / Model"}
                </option>
                {block?.complaintTypes?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {formik.touched.complaintType && formik.errors.complaintType ? (
                <div className="error-field" style={{ color: "red" }}>
                  {formik.errors.complaintType}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              {block?.complaintLabel || "Your Complaint *"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="complaintLabel"
              name="complaintLabel"
              className="input-style borderBlueFocus w-full mt-2 p-2 border border-gray-300 rounded-sm"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.complaintLabel}
              style={{
                borderColor:
                  formik.touched.complaintLabel && formik.errors.complaintLabel
                    ? "red"
                    : "",
              }}
            />
            {formik.touched.complaintLabel && formik.errors.complaintLabel ? (
              <div className="error-field" style={{ color: "red" }}>
                {formik.errors.complaintLabel}
              </div>
            ) : null}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-32 bg-black hover:bg-black/90 text-white py-2 px-4 rounded-sm"
          >
            {block?.submitButtonLabel || "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
