import { ICompany } from './company.model';

export interface ISale {
  id: string;
  code: string;
  count: number;
  price: number;
  priceUnit: number;
  cost: number;
  costUnit: number;
  profit: number;
  note: string;
  isActive: boolean;
  Company: ICompany;
}
