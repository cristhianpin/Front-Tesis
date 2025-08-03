import { ICompany } from './company.model';
import { IUserPreference } from './user-preference.model';

export interface IUser {
  id: string;
  rut: string;
  firstName: string;
  lastName: string;
  fullName: string;
  details?: unknown;
  picture?: string;
  phone: string;
  username: string;
  nickname: string;
  avatar?: string;
  email: string;
  mobile: string;
  password: string;
  usingMFA?: boolean;
  role: string;
  terms: boolean;
  enabled: boolean;
  createdBySystem: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  lastPasswordResetDate: Date;
  lastPasswordResetDateTxt?: string;
  lastLoginAt: string;
  Company: ICompany;
  userPreference: IUserPreference;
  // accounts: IAccount[];
  // beneficiaries: IBeneficiary[];
}
