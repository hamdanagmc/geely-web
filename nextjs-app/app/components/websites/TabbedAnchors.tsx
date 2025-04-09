import { useEffect, useState } from "react";
import { type PortableTextBlock } from "next-sanity";
import PortableText from "@/app/components/PortableText";
import { TabbedAnchors } from "@/sanity.types";

type TabbedAnchorsProps = {
  block: TabbedAnchors;
  index: number;
};

export default function TabbedAnchorsComponent({ block }: TabbedAnchorsProps) {
  const [activeSection, setActiveSection] = useState<string | null>(
    block?.tabs?.[0]?.anchorId || null // Default to the first tab
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Adjust for offset
      let currentActive = block?.tabs?.[0]?.anchorId || null; // Default first tab

      block?.tabs?.forEach((section) => {
        const element = document.getElementById(section?.anchorId ?? "");
        if (element) {
          const { top } = element.getBoundingClientRect();
          if (top <= 100) {
            currentActive = section?.anchorId ?? null;
          }
        }
      });

      if (currentActive !== activeSection) {
        setActiveSection(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [block?.tabs, activeSection]);

  return (
    <section className="relative activeAnchorList my-12 md:mt-0 bg-[#FAF8F9]">
      <div className="max-w-[1220px] mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Side Navigation - Hidden on Mobile */}
          <div className="hidden md:block w-80 flex-shrink-0 bg-[#FAF8F9] px-4 py-12 md:py-16">
            <nav className="sticky top-24">
              <ul className="">
                {block?.tabs?.map((section) => (
                  <li key={section?._key} className={`${activeSection === section?.anchorId ? "activeAnchor" : ""}`}>
                    <a
                      href={`#${section?.anchorId}`}
                      className={`transition-colors leading-[26px] ${
                        activeSection === section?.anchorId
                          ? "text-[#194bff] font-medium text-[17px]"
                          : "text-[#303030] text-[1rem] font-medium hover:text-[#194bff]"
                      }`}
                    >
                      {section?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {block?.tabs?.map((section, index) => (
              <div
                key={section?._key}
                id={section?.anchorId}
                className={`px-4 md:px-8 py-12 md:py-16 ${
                  index % 2 === 0 ? "bg-[#FAFAFA]" : "bg-white"
                }`}
              >
                <h2 className="text-[24px] geelyBold uppercase font-bold mb-6">
                  {`${index + 1}. ${section?.label}`}
                </h2>
                {section?.content?.length && (
                  <PortableText
                    className="text-[18px] leading-[26px]"
                    value={section.content as PortableTextBlock[]}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
