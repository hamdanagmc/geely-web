"use client";
import {
  Mail,
  Facebook,
  Twitter,
  PhoneIcon as WhatsApp,
  LayoutGrid,
  List,
} from "lucide-react";
import { useState } from "react";
import { News } from "@/sanity.types";
import ImageComp from "../CustomImage";
import Link from "next/link";
import { usePathname} from "next/navigation";

type NewsListProps = {
  news: News[];
};

export default function NewsList({ news }: NewsListProps) {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const currentLocale = pathSegments[1] || "en";

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl font-bold"
            style={{
              backgroundImage:
                "linear-gradient(270deg,#b31d2f .68%,#7550a8 36.18%,#685ab4 51.41%,#2e75d8 66%,#94b0e8 83.6%,#50bbca 98.86%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Geely News
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewType("list")}
              className={`p-2 rounded-md ${viewType === "list" ? "bg-gray-100" : ""}`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewType("grid")}
              className={`p-2 rounded-md ${viewType === "grid" ? "bg-gray-100" : ""}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* News Grid */}
        <div
          className={`grid gap-[30px] ${viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {news?.map((item, index) => (
            <div
              key={index}
              className={`${viewType === "list" ? "flex gap-6" : ""}`}
            >
              <div
                className={`relative ${viewType === "list" ? "w-[300px] flex-shrink-0" : "w-full"} aspect-[3/2]`}
              >
                {item?.thumbnail?.altText && (
                  <ImageComp
                    block={item.thumbnail}
                    imageClassName="object-cover w-full h-full"
                    width={600}
                    height={500}
                  />
                )}
              </div>
              <div className="pt-4 flex-grow">
                <h2 className="text-[20px] font-medium mb-4 line-clamp-2">
                  <Link href={`/${currentLocale}/news/${item?.slug?.current?.split('/').filter(segment => segment !== '').pop()}`}> {item.title}</Link>
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#242424]">
                    {item?.publishDate}
                  </span>
                  <div className="flex items-center">
                    <span className="text-[12px] mr-2">SHARE:</span>
                    <div className="flex items-center">
                      <button className="p-1 hover:text-[#ea4335] transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-[#54595f]/20 mx-2" />
                      <button className="p-1 hover:text-[#25d366] transition-colors">
                        <WhatsApp className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-[#54595f]/20 mx-2" />
                      <button className="p-1 hover:text-black transition-colors">
                        <Twitter className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-[#54595f]/20 mx-2" />
                      <button className="p-1 hover:text-[#3b5998] transition-colors">
                        <Facebook className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
