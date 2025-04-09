"use cleint";
import { PageBackground } from "@/sanity.types";
import ImageComp from "../CustomImage";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import useDeviceDetection from "../../hooks/useDeviceDetection";

type PageBackgroundProps = {
  block: PageBackground;
  index: number;
};

export default function PageBackgroundComp({ block }: PageBackgroundProps) {
  const { isMobileDevice } = useDeviceDetection();
  return (
    <section className="relative w-full min-h-[600px] heroBgImg h-screen overflow-hidden">
      {!isMobileDevice &&
        block?.desktopImage?.altText &&
        urlForImage(block?.desktopImage?.image)?.url() && (
          <div className="w-full h-full">
            <Image
              className="shadow-md transition-shadow object-cover"
              alt={block?.desktopImage?.altText}
              width={1440}
              height={900}
              src={urlForImage(block?.desktopImage?.image)?.url() as string}
              style={{
                objectPosition: block?.position || "center",
                objectFit:
                  block?.size === "100% 100%" || block?.size === "auto"
                    ? "cover"
                    : block?.size,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        )}
      {isMobileDevice && block?.mobileImage?.altText && (
        <ImageComp
          block={block.mobileImage}
          imageClassName="object-cover w-full h-full"
          width={430}
          height={932}
        />
      )}
    </section>
  );
}
