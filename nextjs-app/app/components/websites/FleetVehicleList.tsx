"use client";
import { FleetVehicleList } from "@/sanity.types";
import ImageComp from "../CustomImage";

type FleetVehicleListProps = {
  block: FleetVehicleList;
};

export default function FleetVehicleListComp({ block }: FleetVehicleListProps) {
  return (
    <div className={`bg-white py-16 px-4 md:px-8`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-[#313d48] text-3xl md:text-4xl font-bold mb-12">
          {block?.title}
        </h2>

        <div className="space-y-6">
          {block?.vehicles?.map((car) => (
            <div
              key={car?._key}
              className="flex flex-col md:flex-row bg-[#f5f5f5] border border-[#e4e4e4] relative"
            >
              <div className="md:w-1/3 md:h-auto relative p-0 bg-[#fff]">
                {car?.image?.altText && (
                  <ImageComp
                    block={car?.image}
                    imageClassName="object-contain h-full w-full"
                    width={360}
                    height={380}
                  />
                )}
              </div>

              <div className="md:w-2/3 p-6 flex flex-col justify-center">
                <h3 className="text-[#313d48] text-2xl font-bold mb-3">
                  {car.name}
                </h3>
                <p className="text-[#606060] mb-6">{car.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 border-t border-[#e4e4e4] pt-4">
                  {car?.features?.map((spec, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-10 h-10 mb-2">
                        {spec?.icon?.altText && (
                          <ImageComp
                            block={spec?.icon}
                            imageClassName="object-contain"
                            width={40}
                            height={40}
                          />
                        )}
                      </div>
                      <span className="text-[#313d48] text-sm font-medium">
                        {spec?.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
