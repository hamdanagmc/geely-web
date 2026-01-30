"use client";
import { useSelector } from 'react-redux';
import type { RootState } from "@/app/lib/redux/store"
import { usePersistHydration } from "@/app/hooks/usePersistHydration"
import type { VehicleDetails, AppointmentData } from "@/app/lib/types/types"
import { AppointmentBooked } from "@/sanity.types";
import Link from 'next/link';
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { useEffect } from 'react';
import type { PortableTextBlock } from "next-sanity"
import PortableText from "@/app/components/PortableText"
import Image from 'next/image';

type appointmentBookedProps = {
    block: AppointmentBooked
    index: number
}

export default function AppointmentBookedComp({ block }: appointmentBookedProps) {
    console.log("AppointmentBookedComp block : ", block);
    const isHydrated = usePersistHydration()
    const vehicleDetails = useSelector((state: RootState) => state.carBooking.vehicleDetails) as VehicleDetails
    const appointmentDetails = useSelector((state: RootState) => state.carBooking.appointmentDetails) as AppointmentData;
    const { currentLocale } = useDeviceDetection();

    const appointment = [{ key: block?.confirmationDetails?.bookingIDLabel, value: appointmentDetails?.appointmentId },
    { key: block?.confirmationDetails?.licensePlateNoLabel, value: vehicleDetails?.plateNumber },
    { key: block?.confirmationDetails?.serviceLabel, value: appointmentDetails?.recommendedService },
    { key: block?.confirmationDetails?.startDateLabel, value: appointmentDetails?.dateAndTime },
    { key: block?.confirmationDetails?.dropOffTime, value: appointmentDetails?.timeSlot },
    ];

    const center = [{ key: block?.confirmationDetails?.workshopLabel, value: appointmentDetails?.serviceCenter },
    { key: block?.confirmationDetails?.CityCountryLabel, value: appointmentDetails?.country },
    { key: block?.confirmationDetails?.locationLabel, value: "Get Directions" }
    ]
    const mapUrl = `https://www.google.com/maps?q=${appointmentDetails?.latitude},${appointmentDetails?.longitude}`;

    const getLinkHref = (link: any) => {
        if (link?.linkType === "href") {
            return link.href ?? "#";
        } else if (link?.linkType === "path") {
            return link.path ?? "#";
        } else if (link?.linkType === "car") {
            return `/${currentLocale}/car/${link.car.slug}`;
        } else if (link?.page) {
            let slug = link.page;
            // Remove locale prefix if it exists (e.g., "ar/pagelink" -> "pagelink")
            if (slug.startsWith(`${currentLocale}/`)) {
                slug = slug.replace(`${currentLocale}/`, "");
            }
            return `/${currentLocale}/${slug}`;
        } else {
            return "#";
        }
    };

    useEffect(() => {
        if (!appointmentDetails?.appointmentId) {
            window.location.href = `/${currentLocale}/service-booking`
        }
    }, [currentLocale])

    if (!isHydrated) {
        return <div></div>
    }

    if(!appointmentDetails?.appointmentId){
        return <div>Something went wrong, please try again later.</div>
    }

    return (
        <div>
            <div className="max-w-[1200px] mx-auto px-4 md:py-16 py-8">
                <div className="text-center mb-16 appText">
                    {block?.subHeading && (
                        <PortableText
                            className="md:text-[18px] text-center w-full max-w-[100%] md:leading-[26px] text-[15px] leading-[23px]"
                            value={block?.subHeading as PortableTextBlock[]}
                        />
                    )}
                </div>


                <div className="max-w-[1000px] mx-auto">
                    <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] justify-center bg-[#FAFAFA] p-4  my-4 rounded-sm md:gap-3 gap-2">
                        {appointment.map((apt, index) => (
                            <div key={index} className="">
                                <p className="font-[500] text-[12px] leading-[20px] ">{apt.key}</p>
                                <h2 className="md:font-[700] md:text-[18px] text-[16px] font-[600] leading-[20px] mt-1">{apt.value}</h2>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] justify-center bg-[#FAFAFA] p-4  my-4 rounded-sm md:gap-3 gap-2">

                        <div className="">
                            <p className="font-[500] text-[12px] leading-[20px] ">{center?.[0]?.key}</p>
                            <h1 className="md:font-[700] md:text-[18px] text-[16px] font-[600] leading-[20px mt-1">{center?.[0]?.value}</h1>
                        </div>

                        <div className="">
                            <p className="font-[500] text-[12px] leading-[20px] ">{center?.[1]?.key}</p>
                            <h1 className="md:font-[700] md:text-[18px] text-[16px] font-[600] leading-[20px mt-1">{center?.[1]?.value}</h1>
                        </div>

                        <div className="">
                            <p className="font-[500] text-[12px] leading-[20px] ">{center?.[2]?.key}</p>
                            <Link target='_blank' href={`${mapUrl}`} className="md:font-[700] md:text-[18px] text-[16px] font-[600] leading-[20px mt-1">
                                <Image
                                    src="/images/direction_updated.png"
                                    alt="direction icon"
                                    width={14}
                                    height={15}
                                    className="object-cover inline-block ltr:mr-2 rtl:ml-2"
                                /> {center?.[2]?.value}</Link>
                        </div>

                    </div>
                </div>

                <div className="flex flex-col items-center mt-6">
                    <h2 className=" text-[16px] md:text-[20px] text-center">{block?.helpText} </h2>

                    <div className="flex px-4 justify-between gap-4 mt-4">
                        <Link href={getLinkHref(block?.bookButton?.link)} className="min-w-[100px] bg-[#0D0E12] text-[white] px-5 py-2 md:text-[16px] text-[12px] mx-auto">{block?.bookButton?.buttonText}</Link>
                        <Link href={getLinkHref(block?.exploreButton?.link)} className="min-w-[100px] bg-[#0D0E12] text-[white] px-5 py-2 md:text-[16px] text-[12px] mx-auto">{block?.exploreButton?.buttonText}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}