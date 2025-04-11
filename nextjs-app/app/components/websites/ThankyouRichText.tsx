import { type PortableTextBlock } from "next-sanity";

import PortableText from "@/app/components/PortableText";
import { ThankyouRichText } from "@/sanity.types";
import Link from "next/link";
import useDeviceDetection from "../../hooks/useDeviceDetection";

type ThankyouRichTextProps = {
  block: ThankyouRichText;
  index: number;
};

export default function ThankyouRichTextComponent({
  block,
}: ThankyouRichTextProps) {
  const { currentLocale } = useDeviceDetection();
  console.log("block", block);

  const getLinkHref = (link: any) => {
    if (link?.linkType === "href") {
      return link.href ?? "#";
    } else if (link?.linkType === "path") {
      return link.path ?? "#";
    } else if (link?.linkType === "car") {
      return `/${currentLocale}/car/${link.car.slug}`;
    } else if (link?.page?.slug) {
      let slug = link.page.slug;
      // Remove locale prefix if it exists (e.g., "ar/pagelink" -> "pagelink")
      if (slug.startsWith(`${currentLocale}/`)) {
        slug = slug.replace(`${currentLocale}/`, "");
      }
      return `/${currentLocale}/${slug}`;
    } else {
      return "#";
    }
  };
  return (
    <section className={`py-[50px] mx-5 md:mx-[30px] lg:mx-10 text-center thankyouRichText  richTextPara`}>
      <div className="">
        {block?.content?.length && (
          <PortableText
            className=""
            value={block.content as PortableTextBlock[]}
          />
        )}
      </div>
      <div className="exploreBtn">
        {block?.callToActionButton?.buttonText && (
          <Link
          href={getLinkHref(block.callToActionButton.link)}
            className="inline-flex items-center min-w-[249px] text-center justify-center px-4 py-2 mt-5 text-[17px] font-medium text-white bg-[#000] border border-transparent rounded-[3px] shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {block.callToActionButton.buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
