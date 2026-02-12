"use client";

import Image from "next/image";
import { ImageServiceDetail } from "@/sanity.types";
import ImageComp from "../CustomImage";

type ImageServiceDetailProps = {
  block: ImageServiceDetail;
  index: number;
};

export default function ImageServiceDetailComp({
  block,
}: ImageServiceDetailProps) {
  return (
    <section className="w-full imageServiceDetailComp max-w-[1200px] mx-auto px-4 md:py-16 py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-center md:text-[20px] text-[18px] mb-10">{block?.heading}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-y-6 lg:gap-x-24">
          {block?.listItem?.map((item, index) => (
            <div key={index} className="md:flex items-center gap-5">
              <div className="min-w-[60px] h-[60px] rounded-full flex items-center justify-center">
                {item.image?.altText && (
                  <ImageComp
                    block={item.image}
                    imageClassName="object-contain"
                    width={60}
                    height={60}
                  />
                )}
              </div>

              <p className="text-[#419AF2] text-[16px] leading-[26px]">
                {item.title}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
