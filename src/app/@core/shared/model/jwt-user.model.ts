export interface IJwtUser {
  id: string;
  email: string;
  iss: string;
  companyId: string;
  scopes: any[];
  exp: Date;
  iat: Date;
}
