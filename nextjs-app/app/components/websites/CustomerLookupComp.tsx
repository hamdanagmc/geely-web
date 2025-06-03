"use client"
import { useFormik } from "formik"
import * as Yup from "yup"
import type { CustomerLookup } from "@/sanity.types"
import PortableText from "../PortableText"
import type { PortableTextBlock } from "next-sanity"
import { getVehicleDetailByVin, getVehicleDetailByVehicleNumber } from "@/app/actions/serviceBooking/vehicleDetail"
import { useEffect, useState } from "react"
import Image from "next/image"
import { setVehicleDetails } from "../../lib/redux/slices/carSlice"
import { useDispatch } from "react-redux"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import dynamic from "next/dynamic"
import Link from "next/link"

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

type customerLookupProps = {
  block: CustomerLookup
  index: number
}

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

const sourceOptions = [
  { value: "AUH", label: "Abu Dhabi" },
  { value: "DXB", label: "Dubai" },
  { value: "SHJ", label: "Sharjah" },
  { value: "AJM", label: "Ajman" },
  { value: "UAQ", label: "Umm Al Quwain" },
  { value: "FUJ", label: "Fujairah" },
  { value: "RAK", label: "Ras al-Khaimah" },
]

export default function CustomerLookupComp({ block }: customerLookupProps) {
  const [vinNo, setVinNo] = useState<string>("")
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState<string>("")
  const [isSubmitting, setSubmitting] = useState(false)
  const dispatch = useDispatch()
  const { currentLocale } = useDeviceDetection()
  const [isMounted, setIsMounted] = useState(false)
  const [formErrorMessegeStatus, setFormErrorMessegeStatus] = useState(false)

  const validationSchema = Yup.object({
    /*vinNo: Yup.string()
      .matches(/^[A-HJ-NPR-Z0-9]{17}$/, "VIN must be 17 alphanumeric characters")
      .optional(),*/

    plateNumber: Yup.string().required("Plate number is required"),

    plateCode: Yup.string().required("Plate code is required"),

    source: Yup.string().required("Please select Source"),

    agreed: Yup.boolean().oneOf([true], "You must accept the terms and conditions").required(),

    /*formLevelCheck: Yup.mixed().test(
      'vin-or-plate-group',
      'Please Enter Plate Number Plate Code and Source dropdown',
      function (_, context) {
        const { vinNo, plateNumber, plateCode, source } = context.parent;

    const vinValid = /^[A-HJ-NPR-Z0-9]{17}$/.test(vinNo || '');
        const plateValid =
          /^\d{5}$/.test(plateNumber || '') &&
          /^[A-Z]{1}$/.test(plateCode || '') &&
          /^[A-Z]{3}$/.test(source || '');

        return plateValid;
      }
    )*/
  })

  const formik = useFormik({
    initialValues: {
      vinNo: "",
      plateNumber: "",
      plateCode: "",
      source: "",
      formLevelCheck: "",
      agreed: false,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values)
      const { vinNo, plateNumber, plateCode, source } = values
      if (vinNo) {
        setVinNo(vinNo)
      } else if (plateNumber && plateCode && source) {
        const vehiclePlateNumber = `${plateNumber}-${plateCode}-${source}`
        setVehiclePlateNumber(vehiclePlateNumber)
      }
    },
  })

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setSubmitting(true)
      try {
        if (vinNo) {
          const vehicleDetails = await getVehicleDetailByVin(vinNo)
          console.log(vehicleDetails)
          if (vehicleDetails?.status) {
            dispatch(setVehicleDetails(vehicleDetails?.data?.data))
            window.location.href = `/${currentLocale}/customer-details`
            /*const response = await findCustomerByPhone(vehicleDetails?.data?.data?.mobile);
            console.log(response);
            if (response?.status) {
              dispatch(setCustomerDetails(response?.data?.result))
              window.location.href = `/${currentLocale}/customer-details`;
            }*/
          } else {
            formik.setFieldError("formLevelCheck", vehicleDetails?.message)
            setFormErrorMessegeStatus(true)
          }
        } else if (vehiclePlateNumber.length > 0) {
          console.log(vehiclePlateNumber)
          const vehicleDetails = await getVehicleDetailByVehicleNumber(vehiclePlateNumber)
          console.log(vehicleDetails)
          if (vehicleDetails?.status) {
            dispatch(setVehicleDetails(vehicleDetails?.data?.data))
            window.location.href = `/${currentLocale}/customer-details`
            /*const response = await findCustomerByPhone(vehicleDetails?.data?.data?.mobile);
            console.log(response);
            if (response?.status) {
              dispatch(setCustomerDetails(response?.data?.result))
              window.location.href = `/${currentLocale}/customer-details`;
            }*/
          } else {
            formik.setFieldError("formLevelCheck", vehicleDetails?.message)
             setFormErrorMessegeStatus(true)
          }
        }
      } catch (error) {
        console.error("Error fetching vehicle details:", error)
      } finally {
        setSubmitting(false)
      }
    }

    // Call the function only if one of the conditions is met
    if (vinNo.length > 0 || vehiclePlateNumber.length > 0) {
      fetchVehicleDetails()
    }
  }, [vinNo, vehiclePlateNumber])
  console.log(block)

  return (
    <>
      <div>
        <div className="max-w-[1200px] mx-auto px-4 md:py-16 py-8">
          <div className="text-center mb-8">
            <h1 className="md:text-4xl text-[1.5rem] font-bold mb-4">{block?.Heading}</h1>
            {block?.subHeading?.length && (
              <PortableText
                className="md:text-[16px] max-w-full text-center text-[14px]"
                value={block.subHeading as PortableTextBlock[]}
              />
            )}
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-[1000px] mx-auto bg-[#f5f2f0] md:p-8 py-8 px-12 rounded-sm"
          >
            <div className="md:flex md:justify-center gap-5 relative">
              {/* input fiels */}
              <div className="flex flex-col flex-1 items-start">
                <label htmlFor="numberPlate" className="block text-sm font-medium text-gray-700 text-[#383D51]">
                  {block.form?.licensePlateLabel}
                  <span className="text-red-500">*</span>
                </label>

                <div className="md:flex gap-2 w-full justify-between">
                  {/* input source */}
                  <div className="md:w-[30%] w-full mb-5 md:mb-0">
                    <Select
                      id="source"
                      name="source"
                      options={sourceOptions}
                      styles={customStyles}
                      placeholder={block.form?.sourcePlaceholder || "Select source"}
                      className="flex w-full input-style borderBlueFocus"
                      onChange={(newValue: unknown, _actionMeta: any) => {
                        const option = newValue as { value: string; label: string } | null
                        formik.setFieldValue("source", option?.value || "")
                      }}
                      onBlur={() => formik.setFieldTouched("source", true)}
                      value={sourceOptions.find((option) => option.value === formik.values.source) || null}
                    />
                    {formik.touched.source && formik.errors.source ? (
                      <div className="error-field" style={{ color: "red" }}>
                        {formik.errors.source}
                      </div>
                    ) : null}
                  </div>
                  {/* Plate Code */}
                  <div className="md:w-[30%] w-full mb-5 md:mb-0">
                    <input
                      type="text"
                      id="plateCode"
                      name="plateCode"
                      placeholder={block.form?.plateNoPlaceholder}
                      className=" flex w-full input-style borderBlueFocus px-4 placeholder:text-[14px] placeholder:font-[400] leading-[21px] "
                      onChange={(e) => {
                        formik.setFieldValue("plateCode", e.target.value.toUpperCase())
                      }}
                      value={formik.values.plateCode}
                    />
                    {formik.touched.plateCode && formik.errors.plateCode ? (
                      <div className="error-field" style={{ color: "red" }}>
                        {formik.errors.plateCode}
                      </div>
                    ) : null}
                  </div>

                  {/* Plate number */}
                  <div className="md:w-[30%] w-full mb-2 md:mb-0">
                    <input
                      type="text"
                      id="plateNumber"
                      name="plateNumber"
                      placeholder={block.form?.licensePlatePlaceholder}
                      className=" flex w-full input-style borderBlueFocus px-4 placeholder:text-[14px] placeholder:font-[400] leading-[21px] "
                      onChange={formik.handleChange}
                      value={formik.values.plateNumber}
                    />
                    {formik.touched.plateNumber && formik.errors.plateNumber ? (
                      <div className="error-field" style={{ color: "red" }}>
                        {formik.errors.plateNumber}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <span className="flex hidden justify-center items-center pt-7 md:pb-0 pb-7 text-sm font-medium text-gray-700 text-[#383D51]">
                {block.form?.orLabel}
              </span>

              <div className="flex flex-col flex-1 items-start hidden">
                {/* Vin Number */}
                <label htmlFor="vinNo" className="block text-sm font-medium text-gray-700 text-[#383D51]">
                  {block?.form?.vinNumberLabel}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  className="flex w-full input-style borderBlueFocus px-4 placeholder:text-[14px] placeholder:font-[400] leading-[21px]"
                  type="text"
                  name="vinNo"
                  id="vinNo"
                  placeholder={block.form?.vinNoPlaceholder}
                  onChange={formik.handleChange}
                  value={formik.values.vinNo}
                />
                {formik.touched.vinNo && formik.errors.vinNo ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.vinNo}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="my-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4"
                  id="agreed"
                  name="agreed"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.agreed}
                />

                {/* Terms and conditions */}
                <p className="mx-1 text-sm font-medium text-gray-7 ">
                  {block.form?.termsAndCondition}{" "}
                  <Link href={`/${currentLocale}/${(block?.form?.termsAndConditionLink as any)?.slug?.replace(/^ar\//, "") || ""}`} className="text-[#0070B7]">{block.form?.termsAndConditionColor}</Link>
                </p>
              </div>
              {formik.touched.agreed && formik.errors.agreed ? (
                <div className="error-field" style={{ color: "red" }}>
                  {formik.errors.agreed}
                </div>
              ) : null}
            </div>

            {/* Proceed button */}
            <button
              type="submit"
              className={`${isSubmitting ? "cursor-not-allowed opacity-65" : ""} min-w-[100px] bg-[#0D0E12] text-[white] px-4 py-2 md:text-[16px] text-[12px] mx-auto`}
            >
              {block.form?.buttomText}
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
            {/* Global error from custom test */}
          </form>
        </div>
      </div>

      {formErrorMessegeStatus && (
        <div>
          <div className="errorMessge-layer fixed top-0 left-0 w-full h-[100%]"></div>
          <div
            className="w-full errorMessge rounded-3xl bg-[#ffffff42] border-2 border-white/50 p-10"
          >
            <Image
              className="absolute ltr:right-6 rtl:left-6 top-[1.5rem] cursor-pointer"
              src="/images/close-icon.svg"
              width={24}
              height={24}
              alt=""
              onClick={() => setFormErrorMessegeStatus(false)}
            />
            <div className="errorMsg-top relative">
              <Image src="/images/website-error.svg" alt="errorIcon" className="" width={54} height={48} />
              <h3 className="text-[#00285F] md:text-[1.8rem] text-[1.5rem] font-bold mt-[1.2rem]">We could not find a vehicle matching the data you entered. Please try again.</h3>
            </div>
            <div className="errorMsg-btm mt-10">
              <Image
                className="absolute ltr:right-[0px] rtl:left-[0px] bottom-0"
                src="/images/red-car.png"
                width={347}
                height={147}
                alt="result not found"
              />
            </div>
          </div>
        </div>
      )}

    </>
  )
}
