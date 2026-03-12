export type ProductType = "box" | "per-kg" | "per-piece" | "per-pack" | "contact-only" | "bundle";

export interface ProductOption {
  label: string;
  choices: string[];
  default?: string;
}

export interface ProductComponent {
  name: string;
  detail: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  type: ProductType;
  price: number;
  priceLabel?: string;
  description: string;
  details?: string[];
  components?: ProductComponent[];
  halfBoxComponents?: ProductComponent[];
  weightRange?: { min: number; max: number; avg: number; unit: string };
  options?: ProductOption[];
  packSizes?: string[];
  unitLabel?: string;
  minQty?: number;
  image?: string;
  badge?: string;
  contactOnly?: boolean;
  note?: string;
  halfBoxAvailable?: boolean;
  halfBoxPrice?: number;
  weeklyDrop?: boolean;
  recommendedFor?: string[];
  depositAmount?: number;
  depositRefundable?: boolean;
  pricePerKg?: number;
  halfBoxPricePerKg?: number;
  competitorPricePerKg?: number;
  comingSoon?: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  selectedOptions: Record<string, string>;
  targetWeight?: number;
  packSize?: string;
  notes?: string;
  unitLabel?: string;
}

export interface CheckoutForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  deliveryMethod: "delivery" | "pickup";
  notes: string;
}
