export interface IPlatform {
  id: string;
  name: string;
  description: string;
  code: string;
  order?: number;
  cost: number;
  price?: number;
  pricePublic: number;
  expirationDays?: number;
  stockMin: number;
  duration: string;
  isEnabled: boolean;
  image: string;
  isActive?: boolean;
}
