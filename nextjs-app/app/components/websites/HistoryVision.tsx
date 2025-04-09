"use client";
import { useState } from "react";
import { HistoryVision } from "@/sanity.types";
import ImageComp from "../CustomImage";
import Link from "next/link";
import { urlForPDF } from "@/sanity/lib/utils";

type HistoryVisionProps = {
  block: HistoryVision;
  index: number;
};

export default function HistoryVisionComp({ block }: HistoryVisionProps) {
  const [hoverClass, setHoverClass] = useState("");
  console.log("file", block.historyFile);
  return (
    <section
      className={`w-full vision_history ${block?.spacing ? "md:py-14 py-10" : ""} ${hoverClass}`}
    >
      <div className="mx-16 vh_container overflow-hidden relative">
        {/* Vision Section */}
        <div className="vision flex justify-between">
          <div
            className="vision_cover h-full"
            onMouseEnter={() => setHoverClass("visionHover")}
            onMouseLeave={() => setHoverClass("")}
          >
            {block?.historyImage?.altText && (
              <ImageComp
                block={block?.historyImage}
                imageClassName="object-cover h-[548px]"
                width={680}
                height={548}
              />
            )}
          </div>
          <div className="vision_txt bg-orange-50 p-10">
            <h2 className="geelyBold md:text-[30px] text-2xl">
              {block.historyTitle}
            </h2>
            <p className="text-[18px] md:mt-4">{block.historyDescription}</p>
            {block.visionFile && (
              <Link
                href={urlForPDF(block.visionFile) || ""}
                target="_blank"
                className="text-center m-auto border hover:bg-blue-500 hover:text-white hover:border-none w-[110px] border-black block rounded-sm px-4 py-2 mt-4"
              >
                {block?.historyFileTitle || "Download"}
              </Link>
            )}
          </div>
        </div>

        {/* History Section */}
        <div
          className="history flex justify-between flex-row-reverse"
          onMouseEnter={() => setHoverClass("historyHover")}
          onMouseLeave={() => setHoverClass("")}
        >
          <div className="history_cover">
            {block?.visionImage?.altText && (
              <ImageComp
                block={block?.visionImage}
                imageClassName="object-cover h-[548px]"
                width={680}
                height={548}
              />
            )}
          </div>
          <div className="history_txt bg-orange-50 p-10">
            <h2 className="geelyBold md:text-[30px] text-2xl">
              {block?.visionTitle}
            </h2>
            <p className="text-[18px] md:mt-4">{block?.visionDescription}</p>
            {block.historyFile && (
              <Link
                href={urlForPDF(block.historyFile) || ""}
                target="_blank"
                className="text-center m-auto border hover:bg-blue-500 hover:text-white hover:border-none w-[110px] border-black block rounded-sm px-4 py-2 mt-4"
              >
                {block?.visionFileTitle || "Download"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
