import { CardHoverComponent } from "@/sanity.types";
import ImageComp from "../CustomImage";

type CardHoverComponentProps = {
  block: CardHoverComponent;
  index: number;
};

export default function CardHoverComponentComponent({
  block,
}: CardHoverComponentProps) {
  return (
    <section className={`w-full`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-10 md:px-[40px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[600px]">
          {block?.cards?.map((item) => (
            <div key={item?._key} className="relative w-full h-full">
              {item?.image?.altText && (
                <ImageComp
                  block={item?.image}
                  imageClassName="object-cover"
                  width={680}
                  height={603}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
