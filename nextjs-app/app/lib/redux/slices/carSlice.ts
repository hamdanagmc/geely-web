import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VehicleDetails, CustomerResponse, AppointmentData } from "../../types/types";
import { set } from "date-fns";
import { clear } from "console";

type CarState = {
  vehicleDetails: VehicleDetails;
  customerDetails: CustomerResponse;
  appointmentDetails: AppointmentData
};

const initialState: CarState = {
  vehicleDetails: {
    modalYear: 0,
    chassisNumber: '',
    plateNumber: '',
    vehicleMakeCode: '',
    vehicleVariantCode: '',
    vehicleModal: '',
    modelCode: '',
    variantCode: '',
    familyName: '',
    givenName: '',
    mobile: '',
    email: ' ',
    sabVehicleId: 0,
    userId: 0
  },
  customerDetails: {
    result: [],
  },
  appointmentDetails: {
    appointmentId: '',
    serviceCenter: '',
    recommendedService: '',
    dateAndTime: '',
    timeSlot: '',
    latitude: '',
    longitude: '',
    country: '',
    city: '',
  }
};

const carSlice = createSlice({
  name: "carBooking",
  initialState,
  reducers: {
    setVehicleDetails(state, action: PayloadAction<VehicleDetails>) {
      state.vehicleDetails = action.payload;
    },
    clearVehicleDetails(state) {
      state.vehicleDetails = {
        modalYear: 0,
        chassisNumber: '',
        plateNumber: '',
        vehicleMakeCode: '',
        vehicleVariantCode: '',
        vehicleModal: '',
        modelCode: '',
        variantCode: '',
        familyName: '',
        givenName: '',
        mobile: '',
        email: ' ',
        sabVehicleId: 0,
        userId: 0
      };
    },
    setCustomerDetails(state, action: PayloadAction<CustomerResponse>) {
      state.customerDetails = action.payload;
    },
    clearCustomerDetails(state) {
      state.customerDetails = {
        result: [],
      };
    },
    setAppointmentDetails(state, action: PayloadAction<AppointmentData>) {
      state.appointmentDetails = action.payload;
    },
    clearAppointmentId(state) {
      state.appointmentDetails = {
        appointmentId: '',
        serviceCenter: '',
        recommendedService: '',
        dateAndTime: '',
        timeSlot: '',
        latitude: '',
        longitude: '',
        country: '',
        city: '',
      }
    }
  }
});

export const {
  setVehicleDetails,
  clearVehicleDetails,
  setCustomerDetails,
  clearCustomerDetails,
  setAppointmentDetails,
  clearAppointmentId
} = carSlice.actions;

export default carSlice.reducer;
