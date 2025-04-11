"use client";
import { Offer } from "@/sanity.types";
import { useState } from "react";
import ImageComp from "../CustomImage";
import Link from "next/link";
import { type PortableTextBlock } from "next-sanity";
import PortableText from "@/app/components/PortableText";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import useDeviceDetection from "../../hooks/useDeviceDetection";
import Image from "next/image";

type OfferListProps = {
  offer: Offer;
};

interface FormValues {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  vehicle: string;
  numberOfVehicles: string;
  comment: string;
  privacyPolicy: boolean;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  location: Yup.string().required("Location is required"),
  vehicle: Yup.string().required("Vehicle is required"),
  numberOfVehicles: Yup.string()
    .required("Phone No is required"),
  comment: Yup.string(),
  privacyPolicy: Yup.boolean().oneOf(
    [true],
    "You must accept the privacy policy"
  ),
});

export default function OfferDetail({ offer }: OfferListProps) {
  const t = useTranslations("offerForm");
  const carModels = t("carModels").split(",") || [];
  const title = t("titleOptions").split(",") || [];
  const locations = t("location").split(",") || [];
  const { currentLocale } = useDeviceDetection();
  const [isSubmitting, setSubmitting] = useState(false);

  const vehicleTypeOptions = carModels.map((option) => ({ value: option, label: option }));
  const titleOptions = title.map((option) => ({ value: option, label: option }));
  const locationOption = locations.map((option) => ({ value: option, label: option }));
  console.log(offer);

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      vehicle: "",
      numberOfVehicles: '',
      comment: "",
      privacyPolicy: false,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      console.log(values);
      const slug = (offer?.link as any)?._ref || "";
      window.location.href = `/${currentLocale}/${slug}`;
      setSubmitting(false);
      resetForm();
    },
  });
  return (
    <>
      <div className="offer-details__hero pt-[6rem]">
        {offer?.mainImage?.altText && (
          <ImageComp
            block={offer.mainImage}
            imageClassName="object-cover w-full"
            width={1600}
            height={700}
          />
        )}
      </div>
      <div className={`offer-details`}>
        <div className="offer-details__grid">
          {/* Left Column - Offer Details */}
          <div className="offer-details__content">
            <h1 className="offer-details__title">{offer?.title}</h1>

            <div className="offer-details__model-list">
              {offer?.content?.length && (
                <PortableText
                  className=""
                  value={offer.content as PortableTextBlock[]}
                />
              )}
            </div>


          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:sticky lg:top-8 self-start">
            <div className="bg-[#E9E9E9] p-[30px] rounded-sm">
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <select
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full h-10 neoSansArabic rounded-md border border-input bg-white px-4 py-[10px] text-sm"
                >
                  <option value="">{t("titlePlaceholder")}</option>
                  {titleOptions.map((title, index) => (
                    <option
                      key={index}
                      value={title.value.toLowerCase()}
                    >
                      {title.label}
                    </option>
                  ))}
                </select>
                {formik.touched.title && formik.errors.title && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.title}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder={t("firstName")}
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full neoSansArabic bg-white border-none h-10 rounded-md px-4 py-[13px]"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.firstName}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder={t("lastName")}
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full neoSansArabic bg-white border-none h-10 rounded-md px-4 py-[13px]"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.lastName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder={t("email")}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full neoSansArabic bg-white border-none h-10 rounded-md px-4 py-[13px]"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>
                  <div>
                    <select
                      name="location"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full neoSansArabic h-10 rounded-md border border-input bg-white px-4 py-[10px] text-sm"
                    >
                      <option value="">{t("locationPlaceholder")}</option>
                      {locationOption.map((location, index) => (
                        <option
                          key={index}
                          value={location.value.toLowerCase()}
                        >
                          {location.label}
                        </option>
                      ))}
                    </select>
                    {formik.touched.location && formik.errors.location && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <select
                      name="vehicle"
                      value={formik.values.vehicle}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full neoSansArabic h-10 rounded-md border border-input bg-white px-4 py-[10px] text-sm"
                    >
                      <option value="">{t("carModelsPlaceholder")}</option>
                      {carModels.map((model, index) => (
                        <option
                          key={index}
                          value={model.toLowerCase()}
                        >
                          {model}
                        </option>
                      ))}
                    </select>
                    {formik.touched.vehicle && formik.errors.vehicle && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.vehicle}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="numberOfVehicles"
                      placeholder={t("phoneNo")}
                      value={formik.values.numberOfVehicles}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full neoSansArabic bg-white border-none h-10 rounded-md px-4 py-[13px]"
                      min="1"
                    />
                    {formik.touched.numberOfVehicles &&
                      formik.errors.numberOfVehicles && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.numberOfVehicles}
                        </div>
                      )}
                  </div>
                </div>

                <textarea
                  name="comment"
                  placeholder={t("comments")}
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full neoSansArabic bg-white border-none min-h-[120px] rounded-md px-4 py-[10px]"
                ></textarea>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="privacyPolicy"
                    name="privacyPolicy"
                    checked={formik.values.privacyPolicy}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1"
                  />
                  <label htmlFor="privacyPolicy" className="text-sm neoSansArabic">
                    {t("readText")}{" "}
                    <Link href={`/${currentLocale}/privacy-policy`} className="text-[#06398F]">
                      {t("privacyPolicyText")}
                    </Link>{" "}
                    {t("readText2")} *
                  </label>
                </div>
                {formik.touched.privacyPolicy &&
                  formik.errors.privacyPolicy && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.privacyPolicy}
                    </div>
                  )}

                <button
                  type="submit"
                  className={`${isSubmitting ? "cursor-not-allowed opacity-65" : ""} w-full neoSansArabic bg-black hover:bg-black/90 text-white rounded-none h-12`}
                  disabled={formik.isSubmitting}
                >
                  {t("submit")}
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
      </div>
    </>
  );
}
