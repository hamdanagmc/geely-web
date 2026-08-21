import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";

type VehicleFeature = {
  image?: {
    image?: {
      asset?: {
        _ref?: string;
      };
    };
  } | null;
  title?: string | null;
  description?: string | null;
};

type VehicleFeatureGridProps = {
  block: {
    features?: VehicleFeature[] | null;
  };
};

export default function VehicleFeatureGrid({
  block,
}: VehicleFeatureGridProps) {
  const features = block?.features || [];

  console.log("VehicleFeatureGrid features:", JSON.stringify(features, null, 2));

  if (!features.length) {
    return null;
  }

  return (
    <section className="w-full bg-white max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 px-6 py-12 md:grid-cols-2 md:px-10 lg:px-[42px] lg:gap-x-12">
        {features.map((feature, index) => {
          // customImage usually nests the asset in `.image`
          const imgRef = feature?.image?.image || feature?.image;
          const imageUrl = imgRef ? urlForImage(imgRef)?.url() : "";

          return (
            <div key={index} className="w-full flex flex-col items-start">
              {/* Image */}
              {imageUrl && (
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={feature?.title || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="mt-5 w-full">
                {feature?.title && (
                  <h3 className="text-[22px] md:text-[24px] font-bold leading-tight text-black uppercase tracking-wide">
                    {feature.title}
                  </h3>
                )}

                {feature?.description && (
                  <p className="mt-2 text-[18px] md:text-[20px] leading-snug text-black/90">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}