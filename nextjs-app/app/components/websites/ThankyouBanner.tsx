"use cleint";
import { ThankyouBanner } from "@/sanity.types";
import ImageComp from "../CustomImage";
import Image from "next/image";
import useDeviceDetection from "../../hooks/useDeviceDetection";

type ThankyouBannerProps = {
  block: ThankyouBanner;
  index: number;
};

export default function ThankyouBannerComp({
  block,
}: ThankyouBannerProps) {
  const { isMobileDevice } = useDeviceDetection();
  return (
    <section className="relative w-full min-h-[500px] overflow-hidden">
      {!isMobileDevice &&
        block?.backgroundImage?.altText &&
        <ImageComp
          block={block.backgroundImage}
          imageClassName="object-cover w-full h-full"
          width={1600}
          height={600}
        />}
      {isMobileDevice && block?.mobileImage?.altText && (
        <ImageComp
          block={block.mobileImage}
          imageClassName="object-cover w-full h-screen"
          width={430}
          height={932}
        />
      )}
    </section>
  );
}
