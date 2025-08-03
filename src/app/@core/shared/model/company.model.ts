import { IUser } from './user.model';

export interface ICompany {
  id: string;
  code: string;
  desciption: string;
  name: string;
  nick: string;
  // representante: string;
  // address: string;
  phone: string;
  planSlug?: string;
  // companyType: string;
  isEnabled: boolean;
  isHaveApiKey: boolean;
  apiKey: string;
  users: IUser[];
}
