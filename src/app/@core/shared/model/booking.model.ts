export interface IBooking {
  id: string;
  count: number;
  fromAt: string;
  untilAt: string;
  isActived?: boolean;
  createdAt?: string;
  companyId?: string;
  platformId?: string;
}
