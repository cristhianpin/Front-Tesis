export interface IMovement {
  id: string;
  name: string;
  description: string;
  code: string;
  action: string;
  type: string;
  value: number;
  isActive?: boolean;
  companyId?: string;
  createdAt?: string;
}
