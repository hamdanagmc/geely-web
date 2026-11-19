export type leaseVehicleParams = {
    leaseType: string;
    bodyType: string;
    locale: string;
}

export type paginationParams = {
    skip : number;
    limit : number;
    locale?: string;
    toBeSharedInLease?: boolean;
    toBeSharedInRent?: boolean;
}
export type storyListParams = {
  skip : number;
  limit : number;
  toBeSharedInLease : boolean;
  toBeSharedInRent : boolean;
}
