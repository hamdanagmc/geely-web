export interface AppointmentDatesPayload {
    dealershipLocationId: number;
    make: string;
    serviceProductIds: string[];
}

export interface AppointmentTimeSlotsPayload {
    selectedDate: string;
    dealershipLocationId: number;
    make: string;
    serviceProductIds: string[];
}

export interface CreateAppointmentPayload {
    advisorId: string;
    customerNotes: string;
    dealershipLocationId: number;
    dropOffTime: string;
    licensePlateNo: string;
    mileage: number;
    mileageUnit: string;
    serviceProductIds: string[];
    startDate: string;
    vehicleId: number;
    startDateTime : string;
}