
import { CardsCollectionWithIcons } from "@/sanity.types";
import ImageComp from "../CustomImage";

type CardsCollectionWithIconsProps = {
  block: CardsCollectionWithIcons;
  index: number;
};

export default function CardsCollectionWithIconsComponent({
  block,
}: CardsCollectionWithIconsProps) {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 uppercase geelyBold">{block?.title}</h2>
          <p className="text-lg text-gray-600">{block?.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {block?.cards?.map((feature, index) => (
            <div
              key={index}
              className="bg-[#f0ece9] p-8 flex flex-col items-center text-center rounded-lg"
            >
              {feature?.icon?.altText && (
                <ImageComp
                  block={feature?.icon}
                  imageClassName="object-cover"
                  width={65}
                  height={65}
                />
              )}
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
