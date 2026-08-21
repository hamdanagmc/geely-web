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
  const bgColorClass =
    block?.backgroundColor === "black" ? "bgBlackTextW" : "";
  return (
    <section id={`${block?.htmlId}`} className={`md:py-12 py-8 mx-[30px] text-black richTextheadingPara ${bgColorClass}`}>
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
