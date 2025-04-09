"use client";
import { HeroBrochureDownload } from "@/sanity.types";
import ImageComp from "../CustomImage";

type HeroBrochureDownloadProps = {
  block: HeroBrochureDownload;
  index: number;
};

export default function HeroBrochureDownloadComponent({
  block,
}: HeroBrochureDownloadProps) {
  return (
    <div className="heroBrochureDownload pt-[6rem]">
      <div className="heroBrochureInn relative">
        {block?.backgroundImage?.altText && (
          <ImageComp
            block={block?.backgroundImage}
            imageClassName="md:object-fit object-center object-cover md:min-h-auto min-h-[300px] ob w-full"
            width={1520}
            height={300}
          />
        )}
        <h1 className="text-center md:text-[3rem] text-[2rem] geelybold absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          {block?.title}
        </h1>
      </div>
    </div>
  );
}
