"use client"
import { useFormik } from "formik"
import * as Yup from "yup"
import dynamic from "next/dynamic"
import type { RootState } from "@/app/lib/redux/store"
import { useSelector } from "react-redux"
import type { Customer, VehicleDetails } from "@/app/lib/types/types"
import { usePersistHydration } from "@/app/hooks/usePersistHydration"
import { getServiceLocations } from "@/app/actions/serviceBooking/serviceLocations"
import { useEffect, useState } from "react"
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { getRecommendedServices } from "@/app/actions/serviceBooking/recommendedServices"
import { getAppointmentDates } from "@/app/actions/serviceBooking/getAppointmentDates"
import { getAppointmentTimeSlots } from "@/app/actions/serviceBooking/getAppointmentTime"
import { createAppointment } from "@/app/actions/serviceBooking/createAppointment"
import type { AppointmentDatesPayload, AppointmentTimeSlotsPayload, CreateAppointmentPayload } from "../../actions/serviceBooking/types"
import Image from "next/image"
import { setAppointmentDetails } from "../../lib/redux/slices/carSlice"
import { useDispatch } from 'react-redux';
import { CustomerDetails } from '@/sanity.types';
import Link from "next/link"
import { sendContactCustomerEmail, sendServiceBookingCustomerEmail } from "@/app/services/email/contact";
import { sendCRMServideBookingEmail } from "@/app/services/email/crm";
import { ServiceBookingProps } from "@/app/types/email";

type customerDetailsProps = {
  block: CustomerDetails
  index: number
}

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
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

export default function CustomerDetailsComp({ block }: customerDetailsProps) {
  const [serviceLocations, setServiceLocations] = useState<
    Array<{
      label: string
      value: number
    }>
  >([])

  const [recommendedServices, setRecommendedServices] = useState<
    Array<{
      label: string
      value: string
    }>
  >([])

  const [availableDates, setAvailableDates] = useState<
    Array<{
      label: string
      value: string
    }>
  >([])

  const [timeSlots, setTimeSlots] = useState<
    Array<{
      label: string
      value: string
      advisorId: string
      startDateTime: string
    }>
  >([])

  const [isLoadingDates, setIsLoadingDates] = useState(false)
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)

  const isHydrated = usePersistHydration()
  /*const customerDetails = useSelector((state: RootState) => state.carBooking.customerDetails) as unknown as Customer[]*/
  const vehicleDetails = useSelector((state: RootState) => state.carBooking.vehicleDetails) as VehicleDetails
  const { currentLocale } = useDeviceDetection()
  const [isSubmitting, setSubmitting] = useState(false);
  const [finalSubmit, setFinalSubmit] = useState(false);
  const dispatch = useDispatch()
  const [formServiceCenter, setFormServiceCenter] = useState('');
  const [formRecommendedService, setFormRecommendedService] = useState('');
  const [allLocation, setAllLocation] = useState<Array<{ name: string;[key: string]: any }>>([]);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: '',
    longitude: '',
    country: '',
    city: '',
  });
  const [formErrorMessegeStatus, setFormErrorMessegeStatus] = useState(false)
  const [appointmentErrorMessage, setAppointmentErrorMessage] = useState('')

  const getMaskedName = (fullName: unknown): string => {
    if (typeof fullName !== "string" || fullName.trim().length === 0) {
      return ""; // return empty if fullName is undefined, null, or not a string
    }

    const parts = fullName.trim().split(" ");
    if (parts.length < 2) return fullName;

    const firstName = parts[0];
    const lastName = parts[1]; // Second word only

    const maskedLastName = lastName.length > 2
      ? lastName.substring(0, 2) + "XXXX"
      : lastName + "XXXX";

    return `${firstName} ${maskedLastName}`;
  };


  const phone = vehicleDetails?.mobile || "";
  const maskedPhone = phone.length >= 7 ? phone.substring(0, 6) + 'XXXX' : phone;

  function maskEmail(email: string | undefined | null): string {
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return ""; // Return empty string for missing or invalid input
    }

    const [username, domain] = email.split("@");
    if (!username || !domain) return email; // Invalid structure, return as-is

    let maskedUser;
    if (username.length <= 2) {
      maskedUser = username[0] + "*";
    } else {
      maskedUser = username.slice(0, 3) + "*".repeat(username.length - 3);
    }

    return `${maskedUser}@${domain}`;
  }




  const user = [
    { key: block?.customerdetails?.customerNameLabel, value: getMaskedName(vehicleDetails?.givenName) },
    { key: block?.customerdetails?.PhoneNumberLabel, value: maskedPhone },
    { key: block?.customerdetails?.rigisterEmailAddressLabel, value: maskEmail(vehicleDetails?.email) }
  ]

  const vehicle = [
    { key: block?.customerdetails?.vehicleLabel, value: vehicleDetails?.vehicleMakeCode + " " + vehicleDetails?.vehicleVariantCode },
    { key: block?.customerdetails?.vinLabel, value: vehicleDetails?.chassisNumber },
    { key: block?.customerdetails?.licensePlateNo, value: vehicleDetails?.plateNumber },
  ]

  const [serviceBookingPayload, setServiceBookingPayload] = useState<CreateAppointmentPayload>({
    advisorId: '',
    customerNotes: '',
    dealershipLocationId: 0,
    dropOffTime: '',
    licensePlateNo: '',
    mileage: 0,
    mileageUnit: '',
    serviceProductIds: [],
    startDate: '',
    startDateTime: '',
    vehicleId: 0
  })

  const validationSchema = Yup.object({
    serviceCenter: Yup.number().required("Please select service center"),
    serviceType: Yup.string().required("Please select your service type"),
    dateAndTime: Yup.string().when(["serviceCenter", "serviceType"], {
      is: (serviceCenter: any, serviceType: any) => serviceCenter && serviceType,
      then: () => Yup.string().required("Please select date and time"),
      otherwise: () => Yup.string().notRequired(),
    }),
    timeSlot: Yup.string().when("dateAndTime", {
      is: (dateAndTime: string) => !!dateAndTime,
      then: () => Yup.string().required("Please select a time slot"),
      otherwise: () => Yup.string().notRequired(),
    }),
    mileage: Yup.number().required("Please enter mileage").positive("Must be a positive number"),
  })

  const formik = useFormik({
    initialValues: {
      serviceCenter: "",
      serviceType: "",
      dateAndTime: "",
      timeSlot: "",
      advisorId: "",
      mileage: "",
      startDateTime: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values)
      setServiceBookingPayload({
        advisorId: values.advisorId,
        customerNotes: '',
        dealershipLocationId: Number(values.serviceCenter),
        dropOffTime: values.timeSlot,
        licensePlateNo: vehicleDetails?.plateNumber,
        mileage: Number(values?.mileage),
        mileageUnit: "KM",
        serviceProductIds: [values.serviceType],
        startDate: values.dateAndTime,
        vehicleId: vehicleDetails?.sabVehicleId,
        startDateTime: values.startDateTime,
      })
      setFinalSubmit(true)
    },
  })

  useEffect(() => {
    const fetchServiceLocations = async () => {
      try {
        const response = await getServiceLocations(currentLocale)
        console.log("Service Locations: ", response)

        if (response?.status && response?.data?.data) {
          setAllLocation(response?.data?.data);
          const locations = response.data.data.map((location: any) => ({
            label: location.name,
            value: location.id,
          }));
          setServiceLocations(locations)
        }
      } catch (error) {
        console.error("Error fetching service locations: ", error)
      }
    }
    fetchServiceLocations()
    if (!vehicleDetails?.mobile) {
      window.location.href = `/${currentLocale}/service-booking`
    }
  }, [currentLocale])

  useEffect(() => {
    const fetchRecommendedServices = async () => {
      try {
        const response = await getRecommendedServices(currentLocale)
        console.log("Recommended Services: ", response)

        if (response?.status && response?.data?.result) {
          const services = response.data.result.map((service: any) => ({
            label: service.description,
            value: service.serviceProductId,
          }))
          setRecommendedServices(services)
        }
        const selectedServiceCenter = allLocation.find((location) => location.id === formik.values.serviceCenter);
        console.log(selectedServiceCenter);
        setSelectedLocation({
          latitude: selectedServiceCenter?.location?.latitude,
          longitude: selectedServiceCenter?.location?.longitude,
          country: selectedServiceCenter?.country,
          city: selectedServiceCenter?.city,
        })
      } catch (error) {
        console.error("Error fetching recommended Services: ", error)
      }
    }
    fetchRecommendedServices()
  }, [currentLocale, formik.values.serviceType])

  // Fetch available dates when both service center and service type are selected
  useEffect(() => {
    const fetchAvailableDates = async () => {
      const { serviceCenter, serviceType } = formik.values

      // Only fetch if both values are selected
      if (serviceCenter && serviceType) {
        setIsLoadingDates(true)
        try {
          const payload: AppointmentDatesPayload = {
            dealershipLocationId: Number(serviceCenter),
            make: vehicleDetails?.vehicleMakeCode,
            serviceProductIds: [serviceType],
          }
          const response = await getAppointmentDates(payload)
          console.log("Available Dates: ", response)

          if (response?.status && response?.data?.result?.availableDates) {
            const dates = response?.data?.result?.availableDates.map((date: string) => {
              const formattedDate = new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })

              return {
                label: formattedDate,
                value: date,
              }
            })
            setAvailableDates(dates)
          }
        } catch (error) {
          console.error("Error fetching available dates: ", error)
        } finally {
          setIsLoadingDates(false)
        }
      } else {
        // Reset available dates if either selection is cleared
        setAvailableDates([])
      }
    }

    fetchAvailableDates()
  }, [formik.values.serviceCenter, formik.values.serviceType, vehicleDetails?.vehicleMakeCode])

  // Fetch time slots when a date is selected
  useEffect(() => {
    const fetchTimeSlots = async () => {
      const { serviceCenter, serviceType, dateAndTime } = formik.values

      // Only fetch if date is selected
      if (serviceCenter && serviceType && dateAndTime) {
        setIsLoadingTimeSlots(true)
        try {
          const payload: AppointmentTimeSlotsPayload = {
            dealershipLocationId: Number(serviceCenter),
            make: vehicleDetails?.vehicleMakeCode,
            serviceProductIds: [serviceType],
            selectedDate: dateAndTime,
          }
          const response = await getAppointmentTimeSlots(payload)
          console.log("Time Slots: ", response)

          if (response?.status && response?.data?.result?.timeSlots) {
            const slots = response?.data?.result?.timeSlots.map((slot: any) => ({
              label: slot.timeSlot,
              value: slot.timeSlot,
              advisorId: slot.advisorId,
              startDateTime: slot.startDateTime,
            }))
            setTimeSlots(slots)
          }
        } catch (error) {
          console.error("Error fetching time slots: ", error)
        } finally {
          setIsLoadingTimeSlots(false)
        }
      } else {
        // Reset time slots if date is cleared
        setTimeSlots([])
      }
    }

    fetchTimeSlots()
    // Reset time slot selection when date changes
    formik.setFieldValue("timeSlot", "")
    formik.setFieldValue("advisorId", "")
  }, [
    formik.values.dateAndTime,
    formik.values.serviceCenter,
    formik.values.serviceType,
    vehicleDetails?.vehicleMakeCode,
  ])

  useEffect(() => {
    const createNewAppointment = async () => {
      setSubmitting(true)
      try {
        console.log("Service Booking Payload: ", serviceBookingPayload)
        const response = await createAppointment(serviceBookingPayload)
        // Handle the response as needed
        console.log("Create Appointment Response: ", response)
        const referenceNumber = response?.data?.result?.data?.appointmentId.split("-").pop();
        if (response?.status) {
          dispatch(setAppointmentDetails({
            appointmentId: referenceNumber,
            serviceCenter: formServiceCenter,
            recommendedService: formRecommendedService,
            dateAndTime: formik.values.dateAndTime,
            timeSlot: formik.values.timeSlot,
            latitude: selectedLocation?.latitude,
            longitude: selectedLocation?.longitude,
            country: selectedLocation?.country,
            city: selectedLocation?.city
          }))
          const serviceEmailData = {
            fname: vehicleDetails?.givenName,
            email: vehicleDetails?.email,
            phone: vehicleDetails?.mobile,
            vehicleType: vehicleDetails?.vehicleMakeCode + " " + vehicleDetails?.vehicleVariantCode,
            serviceCenter: formServiceCenter,
            recommendedService: formRecommendedService,
            dateAndTime: formik.values.dateAndTime,
            timeSlot: formik.values.timeSlot,
            appointmentId: referenceNumber,
            country: selectedLocation?.country,
            mileage: formik.values?.mileage
          }
          const customerEmailProps = {
            bookingId: referenceNumber,
            licensePlateNo: vehicleDetails?.plateNumber,
            serviceName: serviceEmailData?.recommendedService,
            startDate: serviceEmailData?.dateAndTime,
            time: serviceEmailData?.timeSlot,
            workshop: serviceEmailData?.serviceCenter,
          }
          await sendServiceBookingCustomerEmail(customerEmailProps, vehicleDetails?.email, currentLocale);
          const crmEmailProps = serviceEmailData as ServiceBookingProps;
          const pageUrl = window.location.href;
          await sendCRMServideBookingEmail(crmEmailProps, currentLocale, "Service Booking Form", pageUrl);
          //zapier logic
          await fetch("/api/zap/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              formName: "Service Booking Form",
              lname : vehicleDetails?.familyName,
              ...crmEmailProps,
            }),
          });
          window.location.href = `/${currentLocale}/appointment-booked`
        } else {
          /*window.location.href = `/${currentLocale}/appointment-not-found`;*/
          setFormErrorMessegeStatus(true)
          setAppointmentErrorMessage(response?.message || "An error occurred while creating the appointment. Please try again later.");
        }
      } catch (error) {
        console.error("Error creating appointment: ", error)
      }
      finally {
        setSubmitting(false)
      }
    }
    if (serviceBookingPayload && serviceBookingPayload?.advisorId) {
      createNewAppointment()
    }
  }
    , [serviceBookingPayload, finalSubmit])

  // Check if both service center and service type are selected
  const showDateSelection = formik.values.serviceCenter && formik.values.serviceType
  // Check if date is selected
  const showTimeSelection = showDateSelection && formik.values.dateAndTime


  if (!isHydrated) {
    return <div></div>
  }


  return (
    <>
      <div className="max-w-[1200px] md:py-16 py-8 mx-auto px-4">
        <div className="text-center">
          <h1 className="md:text-4xl text-[1.5rem] font-bold mb-4">{block?.heading}</h1>
          <p className="font-[400] text-[16px] leading-[24px]">
            {block?.customerNameFull},{" "}
            <span className="font-[700]">{getMaskedName(vehicleDetails?.givenName)}</span>
          </p>
          <Link href={`/${currentLocale}/${(block?.restartButtonLink as any)?.slug?.replace(/^ar\//, "") || ""}`} className="min-w-[100px] bg-[#0D0E12] text-[white] px-4 py-2 md:text-[16px] text-[12px] inline-block mx-auto mt-5 mb-5">
            {block?.restartButton}
          </Link>
        </div>

        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] justify-center bg-[#FAFAFA] p-4  my-4 rounded-sm md:gap-5 gap-3">
            {user.map((user, index) => (
              <div key={index} className="">
                <p key={index} className="font-[500] text-[12px] leading-[20px] text-[#383D51]">
                  {user.key}
                </p>
                <h1 className="md:font-[700] md:text-[18px] leading-[20px] text-[14px] font:[600] mt-1">
                  {user.value}
                </h1>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] justify-center bg-[#FAFAFA] p-4  my-4 rounded-sm md:gap-5 gap-3">
            {vehicle.map((car, index) => (
              <div key={index} className="">
                <p key={index} className="font-[500] text-[12px] leading-[20px] text-[#383D51] ">
                  {car.key}
                </p>
                <h1 className="md:font-[700] md:text-[18px] leading-[20px] text-[14px] font:[600] mt-1">{car.value}</h1>
              </div>
            ))}
          </div>

          <form onSubmit={formik.handleSubmit} className="bg-[#F5F2F0] flex flex-col p-8 gap-3 rounded-sm mt-5">
            {/* service center */}
            <div className="flex flex-col mb-4">
              <label htmlFor="" className="font-[500] text-[14px] leading-[20px] text-[#383D51] ">
                {block?.detailForm?.serviceCenterLebel} <span className="text-red-500">*</span>
              </label>
              <Select
                styles={customStyles}
                options={serviceLocations}
                name="serviceCenter"
                id="serviceCenter"
                value={serviceLocations.find((option) => option.value === Number(formik.values.serviceCenter))}
                onChange={(selectedOption) => {
                  formik.setFieldValue("serviceCenter", (selectedOption as { value: number })?.value || "")
                  // Reset date and time selection when service center changes
                  formik.setFieldValue("dateAndTime", "")
                  formik.setFieldValue("timeSlot", "")
                  formik.setFieldValue("advisorId", "")
                  setFormServiceCenter((selectedOption as { label: string })?.label || "")
                }}
                onBlur={() => formik.setFieldTouched("serviceCenter", true)}
                placeholder={block?.detailForm?.serviceCenterPlaceholder}
              />
              {formik.touched.serviceCenter && formik.errors.serviceCenter ? (
                <div className="error-field" style={{ color: "red" }}>
                  {formik.errors.serviceCenter}
                </div>
              ) : null}
            </div>

            {/* select service */}
            <div className="flex flex-col mb-4">
              <label htmlFor="" className="font-[500] text-[14px] leading-[20px] text-[#383D51]">
                {block?.detailForm?.serviceLabel} <span className="text-red-500">*</span>
              </label>
              <Select
                styles={customStyles}
                options={recommendedServices}
                name="serviceType"
                id="serviceType"
                value={recommendedServices.find((option) => option.value === formik.values.serviceType)}
                onChange={(selectedOption) => {
                  formik.setFieldValue("serviceType", (selectedOption as { value: string })?.value || "")
                  // Reset date and time selection when service type changes
                  formik.setFieldValue("dateAndTime", "")
                  formik.setFieldValue("timeSlot", "")
                  formik.setFieldValue("advisorId", "")
                  setFormRecommendedService((selectedOption as { label: string })?.label || "")
                }}
                onBlur={() => formik.setFieldTouched("serviceType", true)}
                placeholder={block?.detailForm?.servicePlaceholder}
              />
              {formik.touched.serviceType && formik.errors.serviceType ? (
                <div className="error-field" style={{ color: "red" }}>
                  {formik.errors.serviceType}
                </div>
              ) : null}
            </div>

            {/* input for date - only show when both service center and service type are selected */}
            {showDateSelection && (
              <div className="flex flex-col mb-4">
                <label htmlFor="" className="font-[500] text-[14px] leading-[20px] text-[#383D51]">
                  {block?.detailForm?.dateLabel} <span className="text-red-500">*</span>
                </label>
                {isLoadingDates ? (
                  <div className="py-2">Loading available dates...</div>
                ) : availableDates.length > 0 ? (
                  <Select
                    styles={customStyles}
                    options={availableDates}
                    name="dateAndTime"
                    id="dateAndTime"
                    value={availableDates.find((option) => option.value === formik.values.dateAndTime)}
                    onChange={(selectedOption) => {
                      formik.setFieldValue("dateAndTime", (selectedOption as { value: string })?.value || "")
                    }}
                    onBlur={() => formik.setFieldTouched("dateAndTime", true)}
                    placeholder={block?.detailForm?.datePlaceholder}
                  />
                ) : (
                  <div className="py-2">No available dates found for the selected service and location.</div>
                )}
                {formik.touched.dateAndTime && formik.errors.dateAndTime ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.dateAndTime}
                  </div>
                ) : null}
              </div>
            )}

            {/* input for time - only show when date is selected */}
            {showTimeSelection && (
              <div className="flex flex-col mb-4">
                <label htmlFor="" className="font-[500] text-[14px] leading-[20px] text-[#383D51]">
                  {block?.detailForm?.timeLabel} <span className="text-red-500">*</span>
                </label>
                {isLoadingTimeSlots ? (
                  <div className="py-2">Loading available time slots...</div>
                ) : timeSlots.length > 0 ? (
                  <Select
                    styles={customStyles}
                    options={timeSlots}
                    name="timeSlot"
                    id="timeSlot"
                    value={timeSlots.find((option) => option.value === formik.values.timeSlot)}
                    onChange={(selectedOption) => {
                      const selected = selectedOption as { value: string; advisorId: string; startDateTime: string } | null
                      console.log("Selected Time Slot: ", selected)
                      formik.setFieldValue("timeSlot", selected?.value || "")
                      formik.setFieldValue("advisorId", selected?.advisorId || "")
                      formik.setFieldValue("startDateTime", selected?.startDateTime || "")
                    }}
                    onBlur={() => formik.setFieldTouched("timeSlot", true)}
                    placeholder={block?.detailForm?.timePlaceholder}
                  />
                ) : (
                  <div className="py-2">No available time slots found for the selected date.</div>
                )}
                {formik.touched.timeSlot && formik.errors.timeSlot ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.timeSlot}
                  </div>
                ) : null}
              </div>
            )}

            {/* input for mileage - only show when time is selected */}
            {showTimeSelection && (
              <div className="flex flex-col mb-4">
                <label htmlFor="mileage" className="font-[500] text-[14px] leading-[20px] text-[#383D51]">
                  {block?.mileageDropdown?.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="mileage"
                  id="mileage"
                  placeholder={block?.mileagePlaceholder}
                  value={formik.values.mileage || ''}
                  onChange={(e) => formik.setFieldValue("mileage", e.target.value ? parseInt(e.target.value, 10) : '')}
                  onBlur={() => formik.setFieldTouched("mileage", true)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    width: "100%",
                    ...customStyles,
                  }}
                />

                {formik.touched.mileage && formik.errors.mileage ? (
                  <div className="error-field" style={{ color: "red" }}>
                    {formik.errors.mileage}
                  </div>
                ) : null}
              </div>
            )}



            <button
              type="submit"
              className={`${isSubmitting ? "cursor-not-allowed opacity-65" : ""} min-w-[100px] bg-[#0D0E12] text-[white] px-4 py-2 md:text-[16px] text-[12px] mx-auto`}
            >
              {block?.submitButton?.buttonText}
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
              <h3 className="text-[#00285F] md:text-[1.4rem] text-[1.2rem] font-bold mt-[1.2rem]">{appointmentErrorMessage}</h3>
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
