export interface Car360 {
  _type: "car360"
  _key: string
  selectedCar: Vehicle
  heading?: string;
  subHeading?: string;
  exteriorLabel?: string;
  interiorLabel?: string;
  specificationTitle?: string;
  specificationSubTitle?: string;
  specList?: SpecificationItem[];
  htmlId: string
}

export interface Vehicle {
  _id: string
  name: string
  exteriorImages: ExteriorImage[]
  interiorImages: InteriorImage[] // Update this if you have a specific structure for interior images
  
}

export interface SpecificationItem {
  label: string
  unit: string
  value: string
}

export interface ExteriorImage {
  color: Color
  images360: Image360[]
}
export interface InteriorImage {
  _key: string
  asset: {
    url: string
  }
}
export interface Color {
  _id: string
  name: string
  hexCode: string
}
export interface Image {
  asset: {
    url: string
  }
}
export interface Image360 {
  asset: {
    url: string
  }
}

export interface Feature {
  icon: {
    asset: {
      url: string
    }
  }
  description: string
}

