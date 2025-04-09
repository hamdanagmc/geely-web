import React from "react";

import { dataAttr } from "@/sanity/lib/utils";
import Cta from "@/app/components/Cta";
import Info from "@/app/components/InfoSection";
import BannerCarousel from "@/app/components/websites/BannerCarousel";
import RichTextheadingParagraph from "@/app/components/websites/RichTextheadingParagraph";
import RichText from "@/app/components/websites/RichText";
import HistoryVision from "@/app/components/websites/HistoryVision";
import ShoppingToolsComponent from "@/app/components/websites/ShoppingTools";
import ListCars from "@/app/components/websites/ListCars";
import ImageGallery from "@/app/components/websites/ImageGallery";
import SpotlightSection from "@/app/components/websites/SpotlightSection";
import ParallaxSection from "@/app/components/websites/ParallaxSection";
import BackgroundWithCaption from "@/app/components/websites/BackgroundWithCaption";
import ImageTextSlider from "@/app/components/websites/ImageTextSlider";
import ParallaxWithRichText from "@/app/components/websites/ParallaxWithRichText";
import CarModelComponent from "@/app/components/websites/CarModelComponent";
import HeroCenteredHeading from "@/app/components/websites/HeroCenteredHeading";
import TabbedAnchors from "@/app/components/websites/TabbedAnchors";
import CardHoverComponent from "@/app/components/websites/CardHoverComponent";
import ImageTextRightLeft from "@/app/components/websites/ImageTextRightLeft";
import CardsCollectionWithIcons from "@/app/components/websites/CardsCollectionWithIcons";
import LogoContainer from "@/app/components/websites/LogoContainer";
import ContactFormSection from "@/app/components/websites/ContactFormSection";
import CustomerCareFormSection from "@/app/components/websites/CustomerCareFormSection";
import PageBackground from "@/app/components/websites/PageBackground";
import NetworkListSection from "@/app/components/websites/NetworkListSection";
import HistorySection from "@/app/components/websites/HistorySection";
import TermsAndConditionSection from "@/app/components/websites/TermsAndConditionSection";
import OrderServiceSection from "@/app/components/websites/OrderServiceSection";
import ImagesAndVideosSection from "@/app/components/websites/ImagesAndVideosSection";
import ServiceBookingForm from "@/app/components/websites/ServiceBookingForm";
import RequestQuoteForm from "@/app/components/websites/RequestQuoteForm";
import HeroFleetSales from "@/app/components/websites/HeroFleetSales";
import IconTextList from "@/app/components/websites/IconTextList";
import FleetTextImage from "@/app/components/websites/FleetTextImage";
import ContactInfo from "@/app/components/websites/ContactInfo";
import FleetVehicleList from "@/app/components/websites/FleetVehicleList";
import FleetSalesForm from "@/app/components/websites/FleetSalesForm";
import HeroBrochureDownload from "@/app/components/websites/HeroBrochureDownload";
import BrochureDownloadFormSection from "@/app/components/websites/BrochureDownloadForm";

import HeroVideoComponent from "@/app/components/car/HeroVideoComponent";
import HeroBannerComponent from "@/app/components/car/HeroBannerComponent";
import ComfortSlider from "@/app/components/car/ComfortSlider";
import OwlStageOuter from "@/app/components/car/OwlStageOuterComponent";
import FeatureHighlightsComponent from "@/app/components/car/FeatureHighlightsComponent";
import StickyTabsComponent from "@/app/components/car/StickyTabsComponent";
import Car360Section from "@/app/components/car/Car360Section";

type BlocksType = {
  [key: string]: React.FC<any>;
};

type BlockType = {
  _type: string;
  _key: string;
};

type BlockProps = {
  index: number;
  block: BlockType;
  pageId: string;
  pageType: string;
};

const Blocks: BlocksType = {
  callToAction: Cta,
  infoSection: Info,
  bannerCarousel: BannerCarousel,
  richTextheadingPara: RichTextheadingParagraph,
  richText : RichText,
  historyVision: HistoryVision,
  shoppingTools : ShoppingToolsComponent,
  listCars : ListCars,
  imageGallery : ImageGallery,
  spotlightSection : SpotlightSection,
  parallaxSection : ParallaxSection,
  backgroundWithCaption : BackgroundWithCaption,
  imageTextSlider : ImageTextSlider,
  parallaxWithRichText : ParallaxWithRichText,
  carModelComponent : CarModelComponent,
  heroCenteredHeading : HeroCenteredHeading,
  heroVideoComponent : HeroVideoComponent,
  heroBannerComponent : HeroBannerComponent,
  tabbedAnchors :TabbedAnchors,
  cardHoverComponent : CardHoverComponent,
  imageTextRightLeft : ImageTextRightLeft,
  cardsCollectionWithIcons : CardsCollectionWithIcons,
  logoContainer : LogoContainer,  
  comfortSlider : ComfortSlider,
  owlStageOuter : OwlStageOuter,
  featureHighlightsComponent : FeatureHighlightsComponent,
  stickyTabsComponent : StickyTabsComponent,
  contactFormSection : ContactFormSection,
  pageBackground : PageBackground,
  customerCareFormSection : CustomerCareFormSection,
  networkListSection : NetworkListSection,
  car360 : Car360Section,
  historySection : HistorySection,
  termsAndConditionSection : TermsAndConditionSection,
  orderServiceSection : OrderServiceSection,
  imagesAndVideosSection : ImagesAndVideosSection,
  serviceBookingForm : ServiceBookingForm,
  requestQuoteForm : RequestQuoteForm,
  heroFleetSales: HeroFleetSales,
  iconTextList: IconTextList,
  fleetTextImage : FleetTextImage,
  contactInfo : ContactInfo,
  fleetVehicleList : FleetVehicleList,
  fleetContactFormSection : FleetSalesForm,
  heroBrochureDownload : HeroBrochureDownload,
  brochureDownloadFormSection : BrochureDownloadFormSection,
};

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({
  block,
  index,
  pageId,
  pageType,
}: BlockProps) {
  // Block does exist
  if (typeof Blocks[block._type] !== "undefined") {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
          index: index,
        })}
      </div>
    );
  }
  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    { key: block._key },
  );
}
