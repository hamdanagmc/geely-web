"use client"
import Image from "next/image";
import { ShoppingTools } from "@/sanity.types";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/utils";
import useDeviceDetection from "../../hooks/useDeviceDetection";

type ShoppingToolsProps = {
  block: ShoppingTools;
  index: number;
};

export default function ShoppingToolsComponent({ block }: ShoppingToolsProps) {
  const { currentLocale } = useDeviceDetection();
  return (
    <section className={`md:py-20 py-12 px-4`} data-we-nav="shopping_tools" data-we-nav-cat="shopping_tools">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-[32px] md:leading-[39px] font-bold geelyBold uppercase text-center mb-8">
          {block?.title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {block.tools?.map((tool) => (
            <Link
              key={tool._key}
              href={`/${currentLocale}/${tool.link}` || "#"}
              className="flex flex-col items-center justify-center p-4 bg-[#F5F8FF] border border-[#E2E9FA] rounded-[3px] text-center group hover:border-[#E2E9FA]/70 transition-colors"
            >
              <div className="relative w-8 h-8 mb-3">
                {tool.image?.asset && (
                  <Image
                    src={urlForImage(tool.image)?.url() || ""}
                    alt={tool.altText || ""}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <span className="text-[18px] font-normal">{tool.label}</span>
            </Link>
          ))}

          
        </div>
      </div>
    </section>
  );
}
