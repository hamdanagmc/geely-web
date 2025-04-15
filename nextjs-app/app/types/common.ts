export type CommonResponse = {
    status : boolean;
    message : string;
    data : any ,
}

export type CommonValidationResponse = {
    status : boolean;
    message : string;
}

export interface CaptchaVerificationResponse {
    success: boolean;
    score: number;
    action: string;
    challenge_ts: string;
    hostname: string;
    [key: string]: any;
  }

 export type CRMEmailProps = {
    fname: string;
    lname : string;
    email: string;
    phone: string;
}