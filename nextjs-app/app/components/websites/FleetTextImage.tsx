import { FleetTextImage } from "@/sanity.types";

type FleetTextImageProps = {
  block: FleetTextImage;
};

export default function FleetTextImageComp({ block }: FleetTextImageProps) {
  return (
    <>
    <div className={`bg-black py-16 px-4`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-center text-2xl md:text-3xl lg:text-4xl font-medium leading-tight">
          {block?.text}
        </h2>
      </div>
    </div>
    </>
    
  );
}
