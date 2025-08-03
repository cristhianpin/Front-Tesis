export interface IAccount {
  id: string;
  account: string;
  password: string;
  screen: string;
  code: string;
  reference: string;
  phone: string;
  status: string;
  isEnabled?: boolean;
  isActived?: boolean;
  isVerifed?: boolean;
  isBooking?: boolean;
  createdAt?: string;
  companyId?: string;
  companyTxt?: string;
  platformId?: string;
  platformTxt?: string;
  cost?: number;
  validityUntil?: number;
  // Platform?: IPlatform;
  // Company?: ICompany;
}
