import { IconTextList } from "@/sanity.types";
import ImageComp from "../CustomImage";

type IconTextListProps = {
  block: IconTextList;
};

export default function IconTextListComp({ block }: IconTextListProps) {
  return (
    <div className="iconTextListComp">
      <section className={`py-12 m-auto max-w-[1090px] text-black`}>
        <div className="max-w-[1360px] mx-auto text-center">
          <h1>{block?.titleText}</h1>
        </div>
      </section>

      <div className={`bg-white pt-2 md:py-16 pb-4 px-4 md:px-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {block.items?.map((item, index) => (
              <div
                key={item._key}
                className={`px-6 pb-12 flex flex-col items-center ${
                  index % 3 !== 2 ? "border-r border-[#e4e4e4]" : ""
                }`}
              >
                <div className="mb-4">
                  {item.icon?.image?.asset && (
                    <ImageComp
                      block={item.icon}
                      imageClassName="object-cover"
                      width={55}
                      height={55}
                    />
                  )}
                </div>
                <h2 className="text-[#313d48] text-xl font-bold mb-4 text-center">
                  {item.title}
                </h2>
                <p className="text-[#606060] text-center">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
