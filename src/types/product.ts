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
  price: number; // placeholder price in GBP
  priceLabel?: string; // e.g. "per kg", "per box"
  description: string;
  details?: string[];
  components?: ProductComponent[];
  weightRange?: { min: number; max: number; avg: number; unit: string };
  options?: ProductOption[];
  packSizes?: string[];
  unitLabel?: string; // e.g. "kg", "5-piece", "10-piece", "box"
  minQty?: number;
  image?: string;
  badge?: string;
  contactOnly?: boolean;
  note?: string;
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
