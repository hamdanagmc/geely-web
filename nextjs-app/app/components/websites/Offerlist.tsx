"use client";
import { Phone } from "lucide-react";
import { Offer } from "@/sanity.types";
import ImageComp from "../CustomImage";
import Link from "next/link";
import { usePathname } from "next/navigation";

type OfferListProps = {
  offers: Offer[];
};

export default function Offerlist({ offers }: OfferListProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const currentLocale = pathSegments[1] || "en";

  return (
    <>
      <section className={`py-16 px-4 md:px-6 lg:px-8`} data-we-section="offer_card">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers?.map((offer) => (
              <div
                key={offer?._id}
                data-we-offer={offer?.slug?.current?.split("/").filter(Boolean).pop()}
                className="group bg-white rounded-lg overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  {offer?.thumbnail?.altText && (
                    <ImageComp
                      block={offer.thumbnail}
                      imageClassName="object-cover transform group-hover:scale-105 transition-transform duration-300"
                      width={465}
                      height={260}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="py-6">
                  <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                  <p className="text-black text-base font-normal mb-6">
                    {offer?.subTitle}
                  </p>
                  <Link
                    data-we-cta
                    href={`/${currentLocale}/offers/${offer?.slug?.current?.split('/').filter(segment => segment !== '').pop() ?? ''}`}
                    className="w-full bg-black text-white hover:bg-blue-600 transition-colors rounded-[3px] py-2 px-4 flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    {offer?.offerDetailLabel || "OFFER DETAILS"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
