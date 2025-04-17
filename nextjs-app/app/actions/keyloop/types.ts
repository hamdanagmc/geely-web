type ContactForm = {
    fname: string;
    lname: string;
    title: string;
    email: string;
    phone: string;
    type: string;
    comments: string;
    location: string;
    countrymobileNoCode: string;
  };

  type RequestQuoteForm = {
    carTypes: string[];
    selectedFilter: string;
    selectedModel: string;
    selectedModelTitle: string;
    title: string;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    agreed: boolean;
    location: string;
    countrymobileNoCode: string;
  };

  type ServiceBookingFormPayload = {
    fname: string;
    lname: string;
    title: string;
    email: string;
    phone: string;
    vehicleType: string;
    modelYear: number;
    serviceCenter: string;
    agreed: boolean;
    countrymobileNoCode: string;
  };

  type OfferDetailFormPayload = {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    location: string;
    vehicle: string;
    phoneNo: string;
    comment: string;
    privacyPolicy: boolean;
    pageUrl? : string
  };

  type FleetSalesFormPayload = {
    fname: string;
    lname: string;
    title: string;
    email: string;
    phone: string;
    fleetSize: string;
    comments: string;
    companyName: string;
    countrymobileNoCode: string;
  };

  type InboundEnquiryResponse = {
    status: string;
    desc: string;
  };

  type BrochureFormProps = {
    fname: string;
    lname: string;
    title: string;
    email: string;
    phone: string;
    fleetSize: string;
    companyName: string;
    comments: string;
    agreed: boolean;
    brochure_check: string[];
    countrymobileNoCode: string;
    contactYou: string;
  }

  type KeyloopResponse = {
    InboundEnquiryResponse: InboundEnquiryResponse;
  }
  