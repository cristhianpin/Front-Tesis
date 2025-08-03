import { IAccount } from './account.model';
import { ICompany } from './company.model';

export interface ITicket {
  id: string;
  code: string;
  reference: string;
  description: string;
  status: string;
  note?: string;
  noteIntern?: string;
  isActive?: boolean;
  Company?: ICompany;
  Account?: IAccount;
}
