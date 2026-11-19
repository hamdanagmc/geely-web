"use client";

import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/app/lib/webengage";
import { urlForImage } from "@/sanity/lib/utils";
import useDeviceDetection from "@/app/hooks/useDeviceDetection";

type VehicleFeature = {
    value?: string | null;
    label?: string | null;
};

type VehiclePromoBannerProps = {
    block: {
        backgroundImage?: any;
        mobileImage?: any;
        vehicleName?: string | null;
        description?: string | null;
        features?: VehicleFeature[] | null;
        cta?: {
            buttonText?: string | null;
            link?: { slug?: string; _type?: string } | null;
        } | null;
        showDarkOverlay?: boolean;
        buttonAlignment?: string | null;
        paddingTop?: boolean;
    };
};

export default function VehiclePromoBanner({
    block,
}: VehiclePromoBannerProps) {
    const { isMobileDevice, currentLocale } = useDeviceDetection();

    // customImage type in Sanity usually nests the actual image under `.image`
    const mobileImg = block?.mobileImage?.image || block?.mobileImage;
    const desktopImg = block?.backgroundImage?.image || block?.backgroundImage;

    const activeImage = isMobileDevice && mobileImg?.asset
        ? mobileImg
        : desktopImg;

    const buttonAlignment = block?.buttonAlignment || 'bottom';

    const renderCTA = () => {
        if (!block?.cta?.buttonText || !block?.cta?.link?.slug) return null;

        const slug = block.cta.link.slug.replace(/^ar\//, "");
        const prefix = block.cta.link._type === 'car' ? '/car' : block.cta.link._type === 'offer' ? '/offers' : '';

        return (
            <Link
                href={`/${currentLocale}${prefix}/${slug}`}
                className="bg-white rounded-[3px] px-6 md:px-[55px] py-[13px] text-[17px] leading-[1] font-medium text-black transition hover:bg-black hover:text-white"
            >
                {block.cta.buttonText}
            </Link>
        );
    };

    return (
        <section
            className={`${(block as any)?.paddingBottom ? 'mb-12' : 'mb-0'} relative w-full min-h-[650px] h-[100vh] overflow-hidden bg-[#e6e7eb]`}
            data-we-banner={`promo_${slugify(block?.vehicleName)}`}
            data-we-banner-name={block?.vehicleName ?? ""}
            data-we-model={block?.cta?.link?._type === 'car' ? block.cta.link.slug?.replace(/^ar\//, "") : undefined}
            data-we-offer={block?.cta?.link?._type === 'offer' ? block.cta.link.slug?.replace(/^ar\//, "") : undefined}
        >
            {/* Background Image */}
            {activeImage?.asset && (
                <Image
                    src={urlForImage(activeImage)?.url() || ""}
                    alt={block?.vehicleName || "Vehicle"}
                    fill
                    priority
                    className="object-cover"
                />
            )}

            {/* Dark Overlay */}
            {block?.showDarkOverlay && (
                <div className="absolute inset-0 bg-black/40 z-[5]" />
            )}

            {/* Content */}
            <div className={`relative z-10 w-full h-full flex flex-col items-center justify-between px-6 pb-12 md:pb-20 ${block?.paddingTop ? 'pt-24 md:pt-[140px]' : 'pt-12 md:pt-20'} pointer-events-none`}>
                {/* Top Section: Title & Description */}
                <div className={`flex flex-col items-center text-center pointer-events-auto ${buttonAlignment === 'center' ? 'flex-1 justify-center w-full' : ''}`}>
                    {block?.vehicleName && (
                        <h2 className="md:text-4xl text-[30px] leading-tight font-bold text-white uppercase tracking-wide">
                            {block.vehicleName}
                        </h2>
                    )}

                    {block?.description && (
                        <p className="mt-2 text-xl md:text-[28px] font-medium text-white">
                            {block.description}
                        </p>
                    )}

                    {/* CTA Rendered in Center */}
                    {buttonAlignment === 'center' && (
                        <div className="mt-6 md:mt-8">
                            {renderCTA()}
                        </div>
                    )}
                </div>

                {/* Bottom Section: Features & CTA */}
                <div className="flex flex-col items-center w-full max-w-[900px] pointer-events-auto">
                    {/* Features */}
                    {block?.features && block.features.length > 0 && (
                        <div className={`flex flex-wrap justify-center md:flex-nowrap md:w-full md:justify-between items-start md:items-end gap-y-8 gap-x-4 md:gap-8 ${buttonAlignment === 'bottom' ? 'mb-10 md:mb-12' : ''}`}>
                            {block.features.map((feature, index) => (
                                <div key={index} className="flex flex-col items-center text-center w-[45%] sm:w-[30%] md:w-auto md:flex-1">
                                    {feature?.value && (
                                        <div className="text-[22px] md:text-[28px] font-bold text-white mb-1">
                                            {feature.value}
                                        </div>
                                    )}

                                    {feature?.label && (
                                        <div className="text-[14px] md:text-[16px] font-medium text-white opacity-90 leading-tight">
                                            {feature.label}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTA Rendered at Bottom */}
                    {buttonAlignment === 'bottom' && renderCTA()}
                </div>
            </div>
        </section>
    );
}