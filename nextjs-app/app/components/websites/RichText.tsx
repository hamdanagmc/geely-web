import { type PortableTextBlock } from "next-sanity";

import PortableText from "@/app/components/PortableText";
import { RichText } from "@/sanity.types";

type RichTextProps = {
  block: RichText;
  index: number;
};

export default function RichTexComponent({
  block,
}: RichTextProps) {
  return (
    <section className={`py-[50px] mx-5 md:mx-[30px] lg:mx-10 richTextPara`}>
      <div className="">
        {block?.content?.length && (
          <PortableText
            className=""
            value={block.content as PortableTextBlock[]}
          />
        )}
      </div>
    </section>
  );
}
