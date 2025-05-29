import { car } from './documents/car'
import color from './documents/color'
import { footer } from './documents/fragments/footer'
import { fragment } from './documents/fragments/fragment'
import { header } from './documents/fragments/header'
import { sideKickSection } from './documents/fragments/sideKickSection'
import { geelyNetwork } from './documents/geelyNetwork'
import { model } from './documents/model'
import news from './documents/news'
import { page } from './documents/page'
import { offer } from './documents/offer'
import { person } from './documents/person'
import { post } from './documents/post'
import showrooms from './documents/showrooms'
import { vehicle } from './documents/vehicle'
import backgroundWithCaption from './objects/backgroundWithCaption'
import bannerCaraousel from './objects/bannerCaraousel'
import { blockContent } from './objects/blockContent'
import { callToAction } from './objects/callToAction'
import car360 from './objects/car360'
import carModelComponent from './objects/carModelComponent'
import cardHoverComponent from './objects/cardHoverComponent'
import cardsCollectionWithIcons from './objects/cardsCollectionWithIcons'
import comfortSlider from './objects/comfortSlider'
import { contactFormSection } from './objects/contactFormSection'
import { customImage } from './objects/customImage'
import { customerCareFormSection } from './objects/customerCareFormSection'
import featureHighlightsComponent from './objects/featureHighlightsComponent'
import heroBannerComponent from './objects/heroBannerComponent'
import heroCenteredHeading from './objects/heroCenteredHeading'
import heroImageSlider from './objects/heroImageSlider'
import heroVideoComponent from './objects/heroVideo'
import { historyItem } from './objects/historyItem'
import { historySection } from './objects/historySection'
import historyVision from './objects/historyVision'
import { iconLinkItem } from './objects/iconLinkItem'
import { iconLinkList } from './objects/iconLinkList'
import iconsWithBackground from './objects/iconsWithBackground'
import { iframe } from './objects/iframe'
import image from './objects/image'
import imageTextRightLeft from './objects/imageTextRightLeft'
import imageTextSlider from './objects/imageTextSlider'
import imageGallery from './objects/imagegallery'
import { imagesAndVideosSection } from './objects/imagesAndVideosSection'
import { infoSection } from './objects/infoSection'
import { link } from './objects/link'
import { linkItem } from './objects/linkItem'
import { linkList } from './objects/linkList'
import listCars from './objects/listCars'
import logoContainer from './objects/logoContainer'
import { modelGallery } from './objects/modelGallery'
import { navItem } from './objects/navItem'
import { navigation } from './objects/navigation'
import { networkListSection } from './objects/networkListSection'
import newsList from './objects/newsList'
import { orderServiceSection } from './objects/orderServiceSection'
import {owlStageOuter} from './objects/owlStageOuter'
import pageBackground from './objects/pageBackground'
import parallaxSection from './objects/parallaxSection'
import parallaxWithRichText from './objects/parallaxWithRichText'
import { referenceComponent } from './objects/referenceComponent'
import { requestQuoteForm } from './objects/requestQuoteForm'
import richText from './objects/richText'
import richTextheadingPara from './objects/richTextheadingPara'
import { serviceBookingForm } from './objects/serviceBookingForm'
import shoppingTools from './objects/shoppingTools'
import spotlightSection from './objects/spotlightSection'
import stickyTabsComponent from './objects/stickyTabsComponent'
import tabbedAnchors from './objects/tabbedAnchors'
import { termsAndConditionSection } from './objects/termsAndConditionSection'
import { vehicleListSection } from './objects/vehicleListSection'
import { settings } from './singletons/settings'
import { heroFleetSales } from './objects/heroFleetSales'
import { iconTextList } from './objects/iconTextList'
import { fleetTextImage } from './objects/fleetTextImage'
import { contactInfo } from './objects/contactInfo'
import { fleetVehicleList } from './objects/fleetVehicleList'
import { iconTextItem } from './objects/iconTextItem'
import { localeString } from './utils/localeString'
import { localeText } from './utils/localeText'
import { localeBlockContent } from './utils/localeBlockContent'
import { fleetContactFormSection } from './objects/fleetContactFormSection'
import { heroBrochureDownload } from './objects/heroBrochureDownload'
import { brochureDownloadFormSection } from './objects/brochureDownloadFormSection'
import { thankyouRichText } from './objects/thankyouRichText'
import { thankyouBanner } from './objects/thankyouBanner'
import { offerDetailForm } from './objects/offerDetailForm'
import { lead } from './documents/lead'
import { optOutForm } from './objects/optOutForm'
import customerLookup from './objects/customerLookup'
import customerDetails from './objects/customerDetails'
import appointmentBooked from './objects/appointmentBooked'
import {appointmentError} from './objects/appointmentError'
import { optOutLead } from './documents/optOutLead'


export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  post,
  person,
  fragment,
  car,
  model, 
  showrooms,
  color,
  vehicle,
  news,
  geelyNetwork,
  offer,
  lead,
  optOutLead,
  
  // Objects
  blockContent,
  infoSection,
  callToAction,
  link,
  customImage,
  linkItem,
  linkList,
  header,
  footer,
  navItem,
  navigation,
  bannerCaraousel,
  richTextheadingPara,
  historyVision,
  shoppingTools,
  listCars,
  imageGallery,
  pageBackground,
  spotlightSection,
  parallaxSection,
  richText,
  backgroundWithCaption,
  imageTextSlider,
  parallaxWithRichText,
  heroImageSlider,
  cardHoverComponent,
  carModelComponent,
  heroVideoComponent,
  heroBannerComponent,
  stickyTabsComponent,
  featureHighlightsComponent,
  car360,
  owlStageOuter,
  comfortSlider,
  image,
  newsList,
  tabbedAnchors,
  imageTextRightLeft,
  iconsWithBackground,
  logoContainer,
  cardsCollectionWithIcons,
  heroCenteredHeading,
  iframe,
  contactFormSection,
  customerCareFormSection,
  iconLinkItem,
  iconLinkList,
  referenceComponent,
  sideKickSection,

  vehicleListSection,
  networkListSection,
  requestQuoteForm,
  serviceBookingForm,
  modelGallery,
  imagesAndVideosSection,
  termsAndConditionSection,
  historyItem,
  historySection,
  orderServiceSection,
  heroFleetSales,
  iconTextItem,
  iconTextList,
  fleetTextImage,
  contactInfo,
  fleetVehicleList,
  localeString,
  localeText,
  localeBlockContent,
  fleetContactFormSection,
  heroBrochureDownload,
  brochureDownloadFormSection,
  thankyouRichText,
  thankyouBanner,
  offerDetailForm,
  optOutForm,
  customerLookup,
  customerDetails,
  appointmentBooked,
  appointmentError
]
