export interface PaymentOrderParams {
  amount: number;
  currency: string;
  reference: string;
  customerEmail: string;
  customerName?: string;
  mobile?: string;
  location?: string;
  pageUrl?: string;
  redirectUrl?: string;
}

export interface PaymentOrderResponse {
  _id: string;
  reference: string;
  _links: {
    payment: {
      href: string;
    };
  };
}

class NGeniusService {
  private apiUrl: string;
  private apiKey: string;
  private outletId: string;
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.apiUrl = process.env.NGENIUS_API_URL || 'https://api-gateway.sandbox.ngenius-payments.com';
    this.apiKey = process.env.NGENIUS_API_KEY || '';
    this.outletId = process.env.NGENIUS_OUTLET_ID || '';

    if (!this.apiKey || !this.outletId) {
      console.warn('nGenius API Key or Outlet ID is not set in environment variables.');
    }
  }

  /**
   * Fetch an access token using the API Key
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if valid
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    const response = await fetch(`${this.apiUrl}/identity/auth/access-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.ni-identity.v1+json',
        Authorization: `Basic ${this.apiKey}`,
      },
      // nGenius documentation typically requires a specific body format for token generation if using realm, 
      // but usually Basic Auth with API key is sufficient for the default realm token endpoint.
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Failed to authenticate with nGenius:', errorData);
      throw new Error(`nGenius Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.token = data.access_token;
    // Set expiry 5 minutes before actual expiration for buffer
    this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

    return this.token!;
  }

  /**
   * Create a new payment order
   */
  public async createPaymentOrder(params: PaymentOrderParams): Promise<PaymentOrderResponse> {
    const token = await this.getAccessToken();

    const orderPayload = {
      action: 'SALE',
      amount: {
        currencyCode: params.currency,
        value: params.amount * 100, // nGenius expects minor units (e.g. fils/cents)
      },
      merchantOrderReference: params.reference,
      emailAddress: params.customerEmail,
      billingAddress: {
        firstName: params.customerName || 'Customer',
      },
      merchantDefinedData: {
        mobile: params.mobile || 'N/A',
        location: params.location || 'N/A',
        email: params.customerEmail || '',
      },
      merchantAttributes: {
        redirectUrl: params.redirectUrl || 'https://geely.ae/en/prebook-thankyou',
        skipConfirmationPage: true, // Optional: useful for direct redirects
      },
    };

    const response = await fetch(`${this.apiUrl}/transactions/outlets/${this.outletId}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.ni-payment.v2+json',
        Accept: 'application/vnd.ni-payment.v2+json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Failed to create nGenius order:', errorData);
      throw new Error(`nGenius order creation failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Verify the status of an existing order
   */
  public async getPaymentStatus(orderRef: string): Promise<any> {

    //using proxy to retrieve order data
    const response = await fetch(
            `${process.env.NGENIUS_APISIX_URL}/geely/ngenius/orders/${orderRef}`,
            {
                method: 'GET',
                cache: 'no-store',
            }
        );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Failed to fetch nGenius order status:', errorData);
      throw new Error(`nGenius order status fetch failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const nGeniusService = new NGeniusService();
