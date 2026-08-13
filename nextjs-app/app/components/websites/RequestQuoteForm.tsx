"use client"
import { saveRequestQuoteForm } from "@/app/actions/keyloop/requestQuote"
import { saveLeads } from "@/app/actions/sanity/leads"
import { countryCodeOptions } from "@/app/lib/constants/countryCodeOptions"
import { sendContactCustomerEmail } from "@/app/services/email/contact"
import { sendCRMRequestQuoteEmail } from "@/app/services/email/crm"
import { RequestQuoteProps } from "@/app/types/email"
import type { RequestQuoteForm } from "@/sanity.types"
import { PortableText } from "next-sanity"
import ResolvedLink from "@/app/components/ResolvedLink"
import DefaultTermsLabel from "./DefaultTermsLabel"
import { urlForImage } from "@/sanity/lib/utils"
import axios from "axios"
import { useFormik } from "formik"
import { ArrowLeft, ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Script from "next/script"
import { useEffect, useRef, useState } from "react"
import "swiper/css"
import "swiper/css/navigation"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import * as Yup from "yup"
import { useTestDrive } from "../../context/TestDriveContext"
import { getCookie } from "cookies-next"

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

type RequestQuoteFormProps = {
  block: RequestQuoteForm
  index: number
}

const validationSchema = Yup.object({
  carTypes: Yup.array().min(1, "Select at least one car type"),
  selectedModel: Yup.string().required("Please select a model"),
  fname: Yup.string().required("First Name is required"),
  lname: Yup.string().required("Last Name is required"),
  title: Yup.string().required("Title is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be only digits")
    .min(9, "Phone number must be at least 9 digits")
    .required("Phone number is required"),
  location: Yup.string().required("Location is required"),
  agreed: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
  countrymobileNoCode: Yup.string().required("Country code is required"),
})

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
}

export default function RequestQuoteFormCmp({ block }: RequestQuoteFormProps) {
  const [isClient, setIsClient] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const swiperRef = useRef<any>(null)
  const { selectedTestDrive } = useTestDrive()
  const [isSubmitting, setSubmitting] = useState(false);

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const currentLocale = pathSegments[1] || "en";

  const inlineComponents: any = {
    block: {
      normal: ({ children }: any) => <span>{children}</span>,
    },
    marks: {
      link: ({ children, value }: any) => {
        return (
          <ResolvedLink link={value} className="text-[#0070b7] hover:underline">
            {children}
          </ResolvedLink>
        );
      },
    },
  };

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
  }, [])

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

  useEffect(() => {
    if (selectedTestDrive && block?.models) {
      // Find the model that matches the selectedTestDrive
      const matchedModel = block.models.find((model) => model.title === selectedTestDrive)

      if (matchedModel) {
        // Set the selected model
        formik.setFieldValue("selectedModel", matchedModel._key)

        // Set the car type based on the matched model's category
        const category = matchedModel.category?.toUpperCase() || ""
        if (category === "SEDAN" || category === "SUV") {
          formik.setFieldValue("selectedFilter", category)
          formik.setFieldValue("carTypes", [category])
        }
      }
    }
  }, [selectedTestDrive, block?.models])

  const formik = useFormik({
    initialValues: {
      carTypes: ["SEDAN", "SUV"],
      selectedFilter: "ALL",
      selectedModel: "",
      selectedModelTitle: selectedTestDrive || "",
      fname: "",
      lname: "",
      title: "",
      email: "",
      phone: "",
      comments: "",
      agreed: false,
      location: "",
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
      const formType = pathname.includes("request-test-drive") ? { name: 'testDrive', title: "Test Drive" } : { name: 'requestQuote', title: "Request A Quote" };
      const response = await saveRequestQuoteForm(values, csrfToken, token, currentLocale, formType.title);
      console.log(response);
      const responseData = response.data as KeyloopResponse;
      if (responseData.InboundEnquiryResponse.status === "1") {
        //email logic
        await sendContactCustomerEmail(values.fname, values.email, currentLocale, formType.name);
        const crmEmailProps = values as RequestQuoteProps;
        const pageUrl = window.location.href;
        await sendCRMRequestQuoteEmail(crmEmailProps, currentLocale, formType.title, pageUrl);

        // Save the lead data to Sanity
        const leadData = {
          title: values.title || "",
          firstName: values.fname || "",
          lastName: values.lname || "",
          email: values.email || "",
          phone: `${values.countrymobileNoCode} ${values.phone}`,
          fleetSize: "",
          companyName: "",
          comments: values.comments || "",
          formType: formType.title,
          vehicleMake: values.selectedFilter === "ALL" ? values.carTypes.toString() : values.selectedFilter,
          vehicleModel: values.selectedModelTitle || "",
          location: values.location || "",
          modelYear: "",
          serviceCenter: "",
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
            formName: formType.title,
            utmUrl: pageUrl,
            ...values,
          }),
        });

        setSubmitting(false);
        const slug = (block?.link as any)?.slug || "";
        window.location.href = currentLocale == 'en' ? `/${currentLocale}/${slug}` : `/${slug}`;
      }

      resetForm()
    },
  })

  const locationOptions =
    block?.locationTypes?.map((location) => ({
      value: location,
      label: location,
    })) || []

  const titleOptions =
    block?.formTitleTypes?.map((option) => ({
      value: option,
      label: option,
    })) || []

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev()
    }
  }

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext()
    }
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      />
      <div className={`w-full max-w-[1180px] reqTestForm mx-auto px-4 py-16`}>
        {/* selectedTestDrive: {selectedTestDrive} */}
        {/* Step 1 */}
        <div className="bg-[#F5F2F0] p-8 flex">
          <div className="flex rotateText flex-row items-center text-[#D0D0D0] w-32 mr-2">
            <div className="text-[44px] rotateText-hdg font-black tracking-tighter">{block?.stepOneLabel || "STEP"}</div>
            <div className="text-[65px] rotateText-count font-black leading-none">1</div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl geelyBold font-normal mb-6 text-center">
              {block?.chooseYourCarLabel || "Choose Your Car"}
            </h2>
            <div className="flex justify-center">
              <div className="inline-flex border border-black rounded-sm overflow-hidden">
                <button
                  className={`px-8 py-2 text-sm transition-colors ${formik.values.selectedFilter === "ALL" ? "bg-black text-white" : "bg-white text-black"
                    }`}
                  onClick={() => {
                    formik.setFieldValue("selectedFilter", "ALL")
                    formik.setFieldValue("carTypes", ["SEDAN", "SUV"])
                  }}
                  type="button"
                >
                  ALL
                </button>
                <button
                  className={`px-8 py-2 text-sm transition-colors ${formik.values.selectedFilter === "SEDAN" ? "bg-black text-white" : "bg-white text-black"
                    }`}
                  onClick={() => {
                    formik.setFieldValue("selectedFilter", "SEDAN")
                    formik.setFieldValue("carTypes", ["SEDAN"])
                  }}
                  type="button"
                >
                  {block?.sedanLabel || "SEDAN"}
                </button>
                <button
                  className={`px-8 py-2 text-sm transition-colors ${formik.values.selectedFilter === "SUV" ? "bg-black text-white" : "bg-white text-black"
                    }`}
                  onClick={() => {
                    formik.setFieldValue("selectedFilter", "SUV")
                    formik.setFieldValue("carTypes", ["SUV"])
                  }}
                  type="button"
                >
                  {block?.suvLabel || "SUV"}
                </button>
              </div>
            </div>
            {formik.touched.carTypes && formik.errors.carTypes ? (
              <div className="error-field text-center mt-2" style={{ color: "red" }}>
                {formik.errors.carTypes}
              </div>
            ) : null}
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#ECE8E4] md:p-8 px-4 py-8 flex">
          <div className="flex rotateText flex-row items-center text-[#D0D0D0] w-32 mr-2">
            <div className="text-[44px] rotateText-hdg font-black tracking-tighter">{block?.stepTwoLabel || "STEP"}</div>
            <div className="text-[65px] rotateText-count font-black leading-none">2</div>
          </div>
          <div className="flex-1 md:px-5 overflow-hidden">
            <h2 className="text-2xl font-normal mb-6 text-center">{block?.selectModelLabel || "Select Model"}</h2>
            <div className="flex items-center justify-center gap-3">
              {/* Left Navigation Button - Desktop */}
              {!isMobileDevice && (
                <button className="swiper-button-prev static bg-transparent p-2 rounded-full" onClick={handlePrev}>
                  <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
                </button>
              )}

              {/* Swiper Slider */}
              <Swiper
                ref={swiperRef}
                modules={[Navigation]}
                spaceBetween={7}
                slidesPerView={4}
                breakpoints={{
                  0: { slidesPerView: 2, spaceBetween: 5 },
                  768: { slidesPerView: 2, spaceBetween: 6 },
                  1024: { slidesPerView: 3, spaceBetween: 7 },
                  1200: { slidesPerView: 4, spaceBetween: 7 },
                }}
              >
                {block?.models
                  ?.filter((model) => formik.values.carTypes.includes(model?.category?.toUpperCase() || ""))
                  .map((model) => (
                    <SwiperSlide key={model._key}>
                      <div className="relative my-3 mx-1">
                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("selectedModel", model._key);
                            formik.setFieldValue("selectedModelTitle", model.title);
                          }}
                          className={`w-full h-[200px] bg-white rounded-sm transition-shadow hover:shadow-md relative ${formik.values.selectedModel === model._key ? "outline outline-2 outline-black" : ""
                            }`}
                        >
                          <div className="relative w-[170] h-[100px] mx-auto mt-4 mb-2">
                            {model?.image?.image?.asset && (
                              <Image
                                src={urlForImage(model?.image?.image)?.url() || ""}
                                alt={model.title || ""}
                                width={170}
                                height={100}
                                className="object-contain"
                              />
                            )}
                          </div>
                          <div className="text-center font-medium mt-2">{model.title}</div>
                          <div className="text-center opacity-7 text-[12px] text-[#000] font-medium mt-2">
                            Body Type : {model?.category?.toLocaleUpperCase()}
                          </div>
                        </button>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>

              {/* Right Navigation Button - Desktop */}
              {!isMobileDevice && (
                <button className="swiper-button-next static bg-transparent p-2 rounded-full" onClick={handleNext}>
                  <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>

            {/* Mobile Navigation Buttons */}
            {isMobileDevice && (
              <div className="mobileSwiperNav flex justify-center mt-4 gap-4">
                <button className="swiper-button-prev static bg-transparent p-2 rounded-full" onClick={handlePrev}>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </button>

                <button className="swiper-button-next static bg-transparent p-2 rounded-full" onClick={handleNext}>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}

            {formik.touched.selectedModel && formik.errors.selectedModel ? (
              <div className="error-field text-center mt-2" style={{ color: "red" }}>
                {formik.errors.selectedModel}
              </div>
            ) : null}
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#F5F2F0] md:p-8 px-4 py-8 flex">
          <div className="flex flex-row rotateText items-center text-[#D0D0D0] w-32 mr-2">
            <div className="text-[44px] rotateText-hdg font-black tracking-tighter">
              {block?.stepThreeLabel || "STEP"}
            </div>
            <div className="text-[65px] rotateText-count font-black leading-none">3</div>
          </div>
          <div className="flex-1">
            <form onSubmit={formik.handleSubmit} className="max-w-[600px] mx-auto space-y-6">
              {/* referring url hidden field */}
              <input
                type="hidden"
                name="referring_url"
                value={formik.values.referring_url}
              />
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  {block?.formTitle || "Title"} <span className="text-red-500">*</span>
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
                      formik.setFieldValue("title", (selectedOption as { value: string })?.value || "")
                    }}
                    onBlur={() => formik.setFieldTouched("title", true)}
                    placeholder={block?.formTitlePlaceholder || "Select Title"}
                  />
                ) : (
                  <input type="text" placeholder="Select Title" className="input-style borderBlueFocus" disabled />
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
                    {block?.firstNameLabel || " First Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fname"
                    name="fname"
                    type="text"
                    className="input-style borderBlueFocus p-2 w-full"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fname}
                    placeholder={block?.firstNamePlaceholder || ""}
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
                    {block?.lastNameLabel || "Last Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lname"
                    name="lname"
                    type="text"
                    className="input-style borderBlueFocus p-2 w-full"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lname}
                    placeholder={block?.lastNamePlaceholder || ""}
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
              <div className="">
                <div className="">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    {block?.phone?.label || "Phone"} <span className="text-red-500">*</span>
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
                              (selectedOption as { value: string })?.value || "",
                            )
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
                        placeholder={block?.phone?.placeholder || "(201) 555-0123"}
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {block?.emailPlaceholder?.label || "Email"} <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={block?.emailPlaceholder?.placeholder || ""}
                  className="input-style borderBlueFocus p-2 w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  {block?.locationLabel || "Select the location"} <span className="text-red-500">*</span>
                </label>
                {isMounted ? (
                  <Select
                    id="location"
                    name="location"
                    className="input-style borderBlueFocus"
                    styles={customStyles}
                    options={locationOptions}
                    value={locationOptions.find((option) => option.value === formik.values.location)}
                    onChange={(selectedOption) => {
                      formik.setFieldValue("location", (selectedOption as { value: string })?.value)
                    }}
                    onBlur={() => formik.setFieldTouched("serviceCenter", true)}
                    placeholder={block?.locationPlaceholder || "Select Location"}
                  />
                ) : (
                  <input type="text" placeholder={"Select Location"} className="input-style borderBlueFocus" disabled />
                )}
                {formik.touched.location && formik.errors.location ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.location}
                  </div>
                ) : null}
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                  {block?.commentsLabel || "Comments"}
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.comments}
                  className="input-style borderBlueFocus w-full min-h-[120px]"
                  style={{
                    borderColor: formik.touched.comments && formik.errors.comments ? "red" : "",
                  }}
                />
                {formik.touched.comments && formik.errors.comments ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.comments}
                  </div>
                ) : null}
              </div>

              {/* Terms and Conditions */}
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
                  {block?.termsAndConditionsLabel ? (
                    <PortableText value={block.termsAndConditionsLabel} components={inlineComponents} />
                  ) : (
                    <DefaultTermsLabel currentLocale={currentLocale} termsHref={block?.termsAndConditions?.link} />
                  )}
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
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

