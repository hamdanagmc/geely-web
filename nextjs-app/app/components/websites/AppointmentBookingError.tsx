"use client"
import { AppointmentError } from '@/sanity.types';
import Link from 'next/link';
import useDeviceDetection from "../../hooks/useDeviceDetection"

type AppointmentBookingErrorProps =
    {
        block: AppointmentError
        index: number
    }

export default function AppointmentBookingError({ block }: AppointmentBookingErrorProps) {
    const { currentLocale } = useDeviceDetection()
    return (
        <div>
            <div className="max-w-[1000px] mx-auto md:py-16 py-8 ">
                <div className="text-center flex flex-col gap-4 md:py-2 py-1 px-4">
                    <h1 className="md:text-4xl text-[1.5rem] font-bold mb-4">{block?.heading}</h1>

                    <div>
                        <p className="md:text-[18px] text-[16px] leading-[28px ]">{block?.subHeadingOne}</p>
                        <p className="md:text-[18px] text-[16px] leading-[28px ]">{block?.subHeadingTwo}</p>
                    </div>

                    <h2 className="md:text-[20px] text-[16px] ">{block?.helpText} </h2>
                    <Link href={`/${currentLocale}/${(block?.tryAgainLink as any)?.slug?.replace(/^ar\//, "") || ""}`} className="min-w-[100px] bg-[#0D0E12] text-[white] px-5 py-2 md:text-[16px] text-[12px] mx-auto" >{block?.tryAgainButton}</Link>
                </div>
            </div>
        </div>
    )
}