import { ICompany } from './company.model';
import { IPlatform } from './platform.model';

export interface IPlatformCompany {
  id: string;
  Company?: ICompany;
  Platform?: IPlatform;
  cost?: number;
  pricePublic?: number;
  isEnabled?: boolean;
  isActive?: boolean;
  companyId?: string;
  companyName?: string;
  platformId?: string;
  platformName?: string;
  platformImage?: string;
  platformCost?: string;
}
