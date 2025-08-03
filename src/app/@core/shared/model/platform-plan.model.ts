import { ICompany } from './company.model';
import { IPlan } from './plan.model';
import { IPlatform } from './platform.model';

export interface IPlatformPlan {
  id: string;
  Plan?: IPlan;
  Platform?: IPlatform;
  price?: number;
  isEnabled?: boolean;
  isActive?: boolean;
  platformId?: string;
  platformName?: string;
  platformImage?: string;
  platformCost?: string;
}
