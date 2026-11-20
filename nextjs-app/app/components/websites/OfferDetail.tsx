"use client";
import PortableText from "@/app/components/PortableText";
import { Offer } from "@/sanity.types";
import axios from "axios";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { type PortableTextBlock, PortableText as SanityPortableText } from "next-sanity";
import ResolvedLink from "@/app/components/ResolvedLink";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import useDeviceDetection from "../../hooks/useDeviceDetection";
import ImageComp from "../CustomImage";
import { saveLeads } from "@/app/actions/sanity/leads";
import { identifyWebEngageUser, offerFromPath, setWebEngageAttributes, slugify, trackPageEvent, uaeDate, useWebEngageForm } from "@/app/lib/webengage";
import { modelRef, modelsIn, showroomRef } from "@/app/lib/webengage-reference";
import { getCookie } from "cookies-next";
import DefaultTermsLabel from "./DefaultTermsLabel";
import type {SettingsQueryResult } from "@/sanity.types"

type OfferListProps = {
  offer: Offer;
  siteSettingData : SettingsQueryResult;
};

interface FormValues {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  vehicle: string;
  phoneNo: string;
  comment: string;
  privacyPolicy: boolean;
  pageUrl: string;
  referring_url?: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  location: Yup.string().required("Location is required"),
  vehicle: Yup.string().required("Vehicle is required"),
  phoneNo: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be only digits")
    .min(9, "Phone number must be at least 9 digits")
    .required("Phone number is required"),
  comment: Yup.string(),
  privacyPolicy: Yup.boolean().oneOf(
    [true],
    "You must accept the privacy policy"
  ),
});

export default function OfferDetail({ offer,siteSettingData }: OfferListProps) {
  const t = useTranslations("offerForm");
  const carModels = t("carModels").split(",") || [];
  const title = t("titleOptions").split(",") || [];
  const locations = t("location").split(",") || [];
  const { currentLocale } = useDeviceDetection();
  const [isSubmitting, setSubmitting] = useState(false);
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const inlineComponents: any = {
    block: {
      normal: ({ children }: any) => <span>{children}</span>,
    },
    marks: {
      link: ({ children, value }: any) => {
        return (
          <ResolvedLink link={value} className="text-[#06398F] hover:underline">
            {children}
          </ResolvedLink>
        );
      },
    },
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Offer Viewed (page event). offer_type and the end date come from the offer in Sanity.
  const offer_id = offerFromPath(pathname);
  const offer_type = offer?.offerType;
  const offer_end_date = uaeDate(offer?.endDate && `${offer.endDate}T23:59:59`); // end of the last day, UAE time
  const eligibleModels = modelsIn(`${offer_id} ${offer?.title}`);
  useEffect(() => {
    trackPageEvent("Offer Viewed", {
      offer_id,
      offer_name: offer?.title,
      offer_type,
      model_id: eligibleModels.length === 1 ? eligibleModels[0] : undefined,
      eligible_models: eligibleModels.join(","),
      offer_end_date,
    });
  }, [offer_id]); // eslint-disable-line react-hooks/exhaustive-deps

  const vehicleTypeOptions = offer?.offerDetailForm?.vehicleDropdownValues?.map((option) => ({ value: option, label: option }));
  const titleOptions = offer?.offerDetailForm?.titleDropdownValues?.map((option) => ({ value: option, label: option })) || [];
  const locationOption = offer?.offerDetailForm?.locationDropdownValues?.map((option) => ({ value: option, label: option }));

  useEffect(() => {
    const savedRef = getCookie('referring_url');
    if (savedRef) {
      formik.setFieldValue("referring_url", savedRef);
    }
  }, [isMounted]);

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
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      vehicle: "",
      phoneNo: '',
      comment: "",
      privacyPolicy: false,
      pageUrl: pathname,
      referring_url: ''
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

      const leadData = {
        title: values.title || "",
        firstName: values.firstName || "",
        lastName: values.lastName || "",
        email: values.email || "",
        phone: values.phoneNo || "",
        fleetSize: "",
        companyName: "",
        comments: values.comment || "",
        formType: "Offer Form",
        vehicleMake: "",
        vehicleModel: values.vehicle || "",
        location: values.location || "",
        modelYear: "",
        serviceCenter: "",
        type: "",
        contactYou: "",
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
      // offer_type service marks an owner; leasing records the finance preference.
      setWebEngageAttributes({
        is_geely_owner_web: offer_type === "service" || undefined,
        finance_preference: offer_type === "leasing" ? "leasing" : undefined,
      });
      weForm.submitted("Offer Enquiry Submitted", {
        offer_id,
        offer_type,
        model_id: modelRef(values.vehicle)?.id ?? slugify(values.vehicle),
        showroom_id: showroomRef(values.location)?.id,
        offer_end_date,
        terms_accepted: values.privacyPolicy,
      });

      const slug = (offer?.link as any)?._ref || "";
      window.location.href = currentLocale == 'en' ? `/${currentLocale}/${slug}` : `/${slug}`;
      setSubmitting(false);
      resetForm();
    },
  });
  const weForm = useWebEngageForm(formik, "offer_enquiry", { offer_id });
  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      />
      <div className="offer-details__hero pt-[6rem] relative">
        
        <div className="relative">
          {offer?.mainImage?.altText && (
            <ImageComp
              block={offer.mainImage}
              imageClassName="object-cover w-full"
              width={1600}
              height={700}
            />
          )}
          {(offer as any)?.enablePreBookCta && (offer as any)?.preBookLink?.slug && (
            <div className={`md:absolute md:mt-0 mt-8 z-50 inset-0 flex flex-col md:flex-row gap-4 items-center justify-center pointer-events-none w-full md:px-6 px-4 ${
              (offer as any)?.preBookButtonAlignment === 'top-left' ? 'md:justify-start md:items-start md:pt-10' :
              (offer as any)?.preBookButtonAlignment === 'top-right' ? 'md:justify-end md:items-start md:pt-10' :
              (offer as any)?.preBookButtonAlignment === 'bottom-left' ? 'md:justify-start md:items-end md:pb-10' :
              (offer as any)?.preBookButtonAlignment === 'bottom-right' ? 'md:justify-end md:items-end md:pb-10' :
              'md:justify-center md:items-center'
            }`}>
               <div className="pointer-events-auto w-full md:w-auto flex justify-center">
                 <Link 
                   data-we-cta="pre_book"
                   href={`/${currentLocale}${(offer as any).preBookLink._type === 'car' ? '/car' : ''}/${(offer as any).preBookLink.slug.replace(/^ar\//, "")}`} 
                   className="w-full md:w-auto px-6 md:px-[55px] py-[13px] text-[17px] font-medium leading-[1] md:bg-white md:text-black border md:border-white md:hover:border-[#194bff] md:hover:bg-[#194bff] md:hover:text-white transition-colors duration-300 rounded-[3px] bg-[#194bff] border-[#194bff] text-white hover:bg-transparent hover:border-black hover:text-black text-center"
                 >
                   {(offer as any).preBookButtonTitle?.replace('{prebookAmount}', siteSettingData?.preBookingAmountGeelyM9?.toString() || '')}
                 </Link>
               </div>
            </div>
          )}
          <div className="md:absolute inset-x-0 bottom-0 h-[100%] bg-[#000]/20" />
        </div>
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
              <form {...weForm.startProps} onSubmit={formik.handleSubmit} className="space-y-6">
                {/* referring url hidden field */}
                <input
                  type="hidden"
                  name="referring_url"
                  value={formik.values.referring_url}
                />
                <select
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full h-10 neoSansArabic rounded-md border border-input bg-white px-4 py-[10px] text-sm"
                >
                  <option value="">{offer?.offerDetailForm?.titlePlaceholder}</option>
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
                      placeholder={offer?.offerDetailForm?.firstNamePlaceholder}
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
                      placeholder={offer?.offerDetailForm?.lastNamePlaceholder}
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
                      placeholder={offer?.offerDetailForm?.emailPlaceholder}
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
                      <option value="">{offer?.offerDetailForm?.locationPlaceholder}</option>
                      {(locationOption ?? []).map((location, index) => (
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
                      <option value="">{offer?.offerDetailForm?.vehiclePlaceholder}</option>
                      {(vehicleTypeOptions ?? []).map((model, index) => (
                        <option
                          key={index}
                          value={model.value.toLowerCase()}
                        >
                          {model.label}
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
                      name="phoneNo"
                      placeholder={offer?.offerDetailForm?.phonePlaceholder}
                      value={formik.values.phoneNo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full neoSansArabic bg-white border-none h-10 rounded-md px-4 py-[13px]"
                      min="1"
                    />
                    {formik.touched.phoneNo &&
                      formik.errors.phoneNo && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.phoneNo}
                        </div>
                      )}
                  </div>
                </div>

                <textarea
                  name="comment"
                  placeholder={offer?.offerDetailForm?.commentsPlaceholder}
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
                    {offer?.offerDetailForm?.privacyPolicyLabel ? (
                      <SanityPortableText value={offer.offerDetailForm.privacyPolicyLabel} components={inlineComponents} />
                    ) : (
                     <DefaultTermsLabel currentLocale={currentLocale} />
                    )}
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
                  {offer?.offerDetailForm?.submitButtonLabel}
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
