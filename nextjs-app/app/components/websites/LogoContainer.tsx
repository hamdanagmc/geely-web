import { LogoContainer } from "@/sanity.types";
import ImageComp from "../CustomImage";
import Link from "next/link";

type LogoContainerProps = {
  block: LogoContainer;
  index: number;
};

export default function LogoContainerComponent({ block }: LogoContainerProps) {
  return (
    <section className="pb-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0">
          {block?.logos?.map((logo, index) => (
            <div key={index} className="flex items-center">
              <div className="relative">
                {logo?.image?.altText && (
                  <Link href={logo?.link || "#"}>
                    <ImageComp
                      block={logo?.image}
                      imageClassName="object-cover"
                      width={142}
                      height={50}
                    />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
