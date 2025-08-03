export interface IPlan {
  id: string;
  name: string;
  description?: string;
  code?: string;
  order?: number;
  isEnabled?: boolean;
  isActive?: boolean;
}
