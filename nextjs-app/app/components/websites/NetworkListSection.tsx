"use client";
import { getGeelyNetwork } from "@/app/actions/common/sanityData";
import { NetworkListSection, GeelyNetwork } from "@/sanity.types";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { urlForImage } from "@/sanity/lib/utils";
import { type PortableTextBlock } from "next-sanity";
import PortableText from "@/app/components/PortableText";
import { locationType, showroomRef } from "@/app/lib/webengage-reference";

type NetworkListSectionProps = {
  block: NetworkListSection;
  locale: string;
};

export default function NetworkListSectionComp({
  block,
  locale,
}: NetworkListSectionProps) {
  const [networks, setNetworks] = useState<GeelyNetwork[]>([]);
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const currentLocale = pathSegments[1] || "en";

  useEffect(() => {
    const fetchNetworks = async () => {
      const data = await getGeelyNetwork(currentLocale);
      setNetworks(data || []);
    };

    fetchNetworks();
  }, [locale]);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">
        {block?.foundLabel}
      </h2>

      <div className="flex items-center gap-2 mb-8">
        <span className="text-[#06398F] text-[18px] font-medium">
          ({networks.length})
        </span>
        <span className="text-[18px] font-normal">Locations Found</span>
      </div>

      <div className="space-y-8">
        {networks?.map((network, index) => (
          <div
            key={index}
            // Location Interaction (directions / call) reads these.
            data-we-showroom={showroomRef(network.title)?.id}
            data-we-emirate={showroomRef(network.title)?.emirate}
            data-we-location-type={locationType(network.title)}
            className={`bg-white rounded-lg overflow-hidden ${
              index !== networks.length - 1
                ? "border-b border-gray-200 pb-8"
                : ""
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">{network.title}</h2>
            <div className="flex networkList flex-col md:flex-row md:gap-6">
              {/* Image */}
              <div className="md:w-1/3 relative">
                <div className="aspect-w-16 aspect-h-9 relative">
                  {network.mapImage?.asset && (
                    <Image
                      src={urlForImage(network.mapImage)?.url() || ""}
                      alt={network.title || ""}
                      width={458}
                      height={344}
                      className="object-cover static"
                    />
                  )}
                </div>
                <div className="p-4 flex justify-center items-baseline">
                    <a
                      href={network?.googleMapsLink || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#000] hover:text-[#06398F] text-[12px] leading-5"
                    >
                      <Image
                      src="/images/direction_updated.png"
                      alt="direction icon"
                      width={14}
                      height={15}
                      className="object-cover inline-block ltr:mr-2 rtl:ml-2"
                    />
                      Get Directions
                    </a>
                </div>
              </div>

              {/* Details */}
              <div className="md:w-2/3 flex flex-col md:flex-row">
                <div className="flex-1 bg-[#EAE9E8] p-6 md:p-[34px]">
                  <div className="flex items-start gap-3">
                    
                    <div>
                    <p className="font-medium flex items-center mb-1">
                    <MapPin className="w-4 h-4 ltr:mr-2 rtl:ml-2 inline-block flex-shrink-0" /> {String(network?.addresslabelLocale || "")}
                      </p>
                      {network?.addressField?.length && (
                        <PortableText
                          className=""
                          value={network?.addressField as PortableTextBlock[]}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-[#F1F1F1] md:p-[34px] p-6">
                  <div className="flex items-start gap-3">
                    
                    <div>
                      <p className="font-medium mb-1">
                      <Clock className="w-4 h-4 ltr:mr-2 rtl:ml-2 inline-block flex-shrink-0" />
                        {String(network?.showroomTimingsLabelLocale || "")}
                      </p>
                      {network?.showroomTimings?.length && (
                        <PortableText
                          className=""
                          value={
                            network?.showroomTimings as PortableTextBlock[]
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
