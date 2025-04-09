import { type PortableTextBlock } from "next-sanity";
import PortableText from "@/app/components/PortableText";
import { ImageTextRightLeft } from "@/sanity.types";
import ImageComp from "../CustomImage";

type ImageTextRightLeftProps = {
  block: ImageTextRightLeft;
  index: number;
};

export default function ImageTextRightLeftComponent({
  block,
}: ImageTextRightLeftProps) {
  return (
    <section className={`w-full md:h-[690px] imageTextRightLeft overflow-hidden mb-10`}>
      <div className={`h-full w-full flex flex-col ${block?.imagePosition == 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
        {/* Image Section - 60% width on desktop */}
        <div className="relative w-full lg:w-[60%] h-1/2 lg:h-full">
          {block?.image?.altText && (
            <ImageComp
              block={block?.image}
              imageClassName="object-cover"
              width={1440}
              height={566}
            />
          )}
        </div>

        {/* Content Section - 40% width on desktop */}
        <div className="w-full lg:w-[40%] bg-[#9d99986e] h-1/2 lg:h-full flex lg:block">
          <div className="w-full p-8 md:p-12 lg:p-20 flex flex-col justify-center lg:justify-start">
            {block?.content?.length && (
              <PortableText
                className=""
                value={block.content as PortableTextBlock[]}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
