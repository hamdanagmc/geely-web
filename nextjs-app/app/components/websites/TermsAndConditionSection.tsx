import { type PortableTextBlock } from "next-sanity";
import PortableText from "@/app/components/PortableText";
import { TermsAndConditionSection } from "@/sanity.types";
import Image from "next/image";

type TermsAndConditionSectionProps = {
  block: TermsAndConditionSection;
  index: number;
};

export default function TermsAndConditionComp({
  block,
}: TermsAndConditionSectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-2 bg-white">
      <h2 className="text-center geelyBold uppercase text-4xl font-bold mb-8 tracking-wider">
        {block?.title || "TERMS & CONDITIONS"}
      </h2>

      <div className="bg-[#f0ece9] p-8 mb-6 rounded-sm">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6 md:min-w-[450px]">
            {block?.richText1?.length && (
              <PortableText
                className=""
                value={block.richText1 as PortableTextBlock[]}
              />
            )}
          </div>

          <div className="space-y-6">
            {block?.richText2?.length && (
              <PortableText
                className=""
                value={block.richText2 as PortableTextBlock[]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
