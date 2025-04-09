import { type PortableTextBlock } from "next-sanity";
import PortableText from "@/app/components/PortableText";
import { OrderServiceSection } from "@/sanity.types";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";

type OrderServiceSectionProps = {
  block: OrderServiceSection;
  index: number;
};

export default function OrderServiceSectionComp({
  block,
}: OrderServiceSectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-8 bg-white">
      <div className="bg-[#f0ece9] p-4 sm:p-8 rounded-sm">
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="flex flex-col md:min-w-[450px] sm:flex-row gap-8 sm:gap-6">
            <div className="w-32 h-32 mx-auto sm:mx-0">
              {block?.orderService?.qrImage?.asset?._ref && (
                <Image
                  src={urlForImage(block.orderService.qrImage)?.url() || ""}
                  alt="QR Code"
                  width={128}
                  height={128}
                  className="w-full h-full"
                />
              )}
            </div>

            <div>
              {block?.orderService?.instructions?.length && (
                <PortableText
                  className=""
                  value={
                    block?.orderService?.instructions as PortableTextBlock[]
                  }
                />
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-4 mt-6 sm:mt-0">
            {block?.contactDetails?.website && (
              <div className="flex items-center gap-2">
                {block?.contactDetails?.website?.icon?.asset?._ref && (
                  <Image
                    src={
                      urlForImage(block.contactDetails.website.icon)?.url() ||
                      ""
                    }
                    alt="Website Icon"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                )}
                <span className="font-medium">www.morniksa.com</span>
              </div>
            )}

            {block?.contactDetails?.phone && (
              <div className="flex items-center gap-2">
                {block?.contactDetails?.phone?.icon?.asset?._ref && (
                  <Image
                    src={
                      urlForImage(block.contactDetails.phone.icon)?.url() || ""
                    }
                    alt="Phone Icon"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                )}
                <span className="font-medium">
                  {block?.contactDetails?.phone?.tel}
                </span>
              </div>
            )}

            <div className="flex gap-4 mt-2">
              {block?.appDownloads?.appleApp?.image?.asset?._ref && (
                <div className="border border-[#242424] rounded-md p-1">
                  <Image
                    src={
                      urlForImage(block.appDownloads.appleApp.image)?.url() ||
                      ""
                    }
                    alt="App Store"
                    width={120}
                    height={40}
                    className="h-8 sm:h-10"
                  />
                </div>
              )}

              {block?.appDownloads?.googlePlay?.image?.asset?._ref && (
                <div className="border border-[#242424] rounded-md p-1">
                  <Image
                    src={
                      urlForImage(block.appDownloads.googlePlay.image)?.url() ||
                      ""
                    }
                    alt="Google Play"
                    width={120}
                    height={40}
                    className="h-8 sm:h-10"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
