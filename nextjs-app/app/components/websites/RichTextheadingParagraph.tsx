import { type PortableTextBlock } from "next-sanity";
import PortableText from "@/app/components/PortableText";
import { RichTextheadingPara } from "@/sanity.types";

type RichTextheadingParaProps = {
  block: RichTextheadingPara;
  index: number;
};

export default function RichTextheadingParaComponent({
  block,
}: RichTextheadingParaProps) {
  return (
    <section id={`${block?.htmlId}`} className={`py-12 mx-[30px] text-black richTextheadingPara`}>
      <div className="max-w-[1360px] mx-auto">
        {block?.content?.length && (
          <PortableText
            className="text-center"
            value={block.content as PortableTextBlock[]}
          />
        )}
      </div>
    </section>
  );
}
