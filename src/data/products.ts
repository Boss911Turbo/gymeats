import { Product } from "@/types/product";

export const WHATSAPP_NUMBER = "+44XXXXXXXXXXX";
export const BUSINESS_EMAIL = "YOUR_EMAIL_HERE";
export const DELIVERY_FEE = 20;
export const PICKUP_AVAILABLE = true;

export const beefProducts: Product[] = [
  {
    id: "beef-full-loin-box",
    name: "Full Loin Box",
    category: "bulk-beef",
    type: "box",
    price: 199.99,
    priceLabel: "per box",
    description: "Premium full loin box with T-Bone, Sirloin, Fillet steaks and mince.",
    components: [
      { name: "T-Bone Steaks", detail: "10–12 pieces, 1\" thick, 350g–450g each" },
      { name: "Sirloin Steaks", detail: "10–14 pieces, 1\" thick, 250g–350g each" },
      { name: "Fillet Steaks", detail: "8–14 pieces, 1\" thick, 200g–280g each" },
      { name: "Beef Mince", detail: "3–8kg (lean or with fat)" },
    ],
    weightRange: { min: 22, max: 28, avg: 25, unit: "kg" },
    options: [
      { label: "Mince Type", choices: ["Lean", "With Fat"], default: "Lean" },
      { label: "Mince Pack Size", choices: ["500g", "1kg"], default: "1kg" },
    ],
  },
  {
    id: "beef-rib-eye-box",
    name: "Primal Rib Box A: Rib Eye Box",
    category: "bulk-beef",
    type: "box",
    price: 179.99,
    priceLabel: "per box",
    description: "Loaded with rib-eye steaks, short ribs, and mince.",
    components: [
      { name: "Rib-eye Steaks", detail: "12–14kg, 1\" thick, 300g–400g each" },
      { name: "Short Ribs / Rib Fingers", detail: "6–12kg" },
      { name: "Beef Mince", detail: "3–4kg (lean or with fat)" },
    ],
    weightRange: { min: 18, max: 26, avg: 22, unit: "kg" },
    options: [
      { label: "Mince Type", choices: ["Lean", "With Fat"], default: "Lean" },
      { label: "Mince Pack Size", choices: ["500g", "1kg"], default: "1kg" },
    ],
  },
  {
    id: "beef-tomahawk-box",
    name: "Primal Rib Box B: Tomahawk Box",
    category: "bulk-beef",
    type: "box",
    price: 229.99,
    priceLabel: "per box",
    badge: "Luxury",
    description: "Premium tomahawk steaks, rib-eye, short ribs and mince.",
    components: [
      { name: "Tomahawk Steaks", detail: "6–8kg, 700g–1kg each (big cut meat bag)" },
      { name: "Ribeye Steaks", detail: "10–14kg, 1\" thick, 300g–400g each" },
      { name: "Short Ribs", detail: "6–12kg" },
      { name: "Beef Mince", detail: "2–6kg (lean or with fat)" },
    ],
    weightRange: { min: 18, max: 26, avg: 22, unit: "kg" },
    options: [
      { label: "Mince Type", choices: ["Lean", "With Fat"], default: "Lean" },
      { label: "Mince Pack Size", choices: ["500g", "1kg"], default: "1kg" },
    ],
  },
  {
    id: "beef-rump-box",
    name: "Primal Rump Box",
    category: "bulk-beef",
    type: "box",
    price: 159.99,
    priceLabel: "per box",
    description: "Rump steaks, diced beef and mince — great all-rounder.",
    components: [
      { name: "Rump Steaks", detail: "14–16 pieces, 1\" thick, 250g–350g each" },
      { name: "Diced Beef", detail: "8–10kg, 30–40mm chunks" },
      { name: "Beef Mince", detail: "4–6kg (lean or with fat)" },
    ],
    weightRange: { min: 16, max: 24, avg: 20, unit: "kg" },
    options: [
      { label: "Mince Type", choices: ["Lean", "With Fat"], default: "Lean" },
      { label: "Mince Pack Size", choices: ["500g", "1kg"], default: "1kg" },
    ],
  },
  {
    id: "beef-lean-bulk-box",
    name: "Primal Round Box: Lean Bulk Box",
    category: "bulk-beef",
    type: "box",
    price: 189.99,
    priceLabel: "per box",
    description: "High-protein lean cuts — topside, silverside, diced lean beef and mince.",
    components: [
      { name: "Topside Steak", detail: "10–16 pieces, 1\" thick, 250g–350g each" },
      { name: "Silverside Joint", detail: "8–15kg" },
      { name: "Diced Lean Beef", detail: "7–14kg" },
      { name: "Lean Beef Mince", detail: "3–8kg" },
    ],
    weightRange: { min: 30, max: 45, avg: 37, unit: "kg" },
    options: [
      { label: "Mince Pack Size", choices: ["500g", "1kg"], default: "1kg" },
    ],
  },
  {
    id: "beef-oxtail",
    name: "Oxtail",
    category: "bulk-beef",
    type: "per-kg",
    price: 12.99,
    priceLabel: "per kg",
    description: "1.5–2 inch pieces, perfect for stews and slow cooking.",
    options: [
      { label: "Pack Size", choices: ["500g", "1kg"], default: "1kg" },
    ],
    unitLabel: "kg",
  },
  {
    id: "beef-bones",
    name: "Beef Bones",
    category: "bulk-beef",
    type: "contact-only",
    price: 0,
    description: "Available on request. Contact us to order beef bones.",
    contactOnly: true,
  },
];

export const lambProducts: Product[] = [
  {
    id: "lamb-whole-box-a",
    name: "Whole Lamb Box A",
    category: "bulk-lamb",
    type: "box",
    price: 179.99,
    priceLabel: "per box",
    description: "Complete whole lamb, broken down and vacuum packed.",
    details: [
      "Lamb sizing: Small 14–16kg, Standard 16–22kg, Large 22–26kg",
      "Vacuum packed; 500g or 1kg bags; big pieces in meat bags.",
    ],
    components: [
      { name: "Legs", detail: "5–8kg" },
      { name: "Shoulder", detail: "3.5–6kg" },
      { name: "Chops", detail: "2–4.5kg (1 inch)" },
      { name: "Neck Slices", detail: "1–2kg" },
      { name: "Shanks", detail: "1.5–3kg" },
      { name: "Ribs", detail: "2–4kg" },
      { name: "Lamb Mince", detail: "2–5kg" },
    ],
    weightRange: { min: 18, max: 25, avg: 21, unit: "kg" },
    options: [
      { label: "Leg Cut", choices: ["Whole", "1-inch Steaks", "Diced"], default: "Whole" },
      { label: "Shoulder Cut", choices: ["Whole", "Diced"], default: "Whole" },
      { label: "Ribs Cut", choices: ["Cubed", "Sliced"], default: "Sliced" },
      { label: "Mince Pack Size", choices: ["500g", "1kg"], default: "1kg" },
    ],
  },
  {
    id: "lamb-curry-cut-box",
    name: "Whole Lamb Box B: Curry Cut Box",
    category: "bulk-lamb",
    type: "box",
    price: 169.99,
    priceLabel: "per box",
    description: "Whole lamb curry cut, boneless diced, and mince options.",
    options: [
      { label: "Cut Style", choices: ["Whole Lamb Curry Cut (on the bone)", "Boneless Diced Lamb", "Mixed"], default: "Whole Lamb Curry Cut (on the bone)" },
      { label: "Mince Pack Size", choices: ["500g", "1kg"], default: "1kg" },
    ],
    weightRange: { min: 18, max: 25, avg: 21, unit: "kg" },
  },
];

export const sheepProducts: Product[] = [
  { id: "sheep-shoulder", name: "Sheep Shoulder", category: "bulk-sheep", type: "per-kg", price: 9.99, priceLabel: "per kg", description: "Fresh sheep shoulder, perfect for roasting or slow cooking.", unitLabel: "kg", options: [{ label: "Pack Size", choices: ["500g", "1kg"], default: "1kg" }] },
  { id: "sheep-shank", name: "Sheep Shank", category: "bulk-sheep", type: "per-kg", price: 8.99, priceLabel: "per kg", description: "Tender sheep shanks, ideal for braising.", unitLabel: "kg", options: [{ label: "Pack Size", choices: ["500g", "1kg"], default: "1kg" }] },
  { id: "sheep-leg", name: "Sheep Leg", category: "bulk-sheep", type: "per-kg", price: 10.99, priceLabel: "per kg", description: "Whole sheep leg, great for roasting.", unitLabel: "kg", options: [{ label: "Pack Size", choices: ["500g", "1kg"], default: "1kg" }] },
  { id: "sheep-chops", name: "Sheep Chops", category: "bulk-sheep", type: "per-kg", price: 11.99, priceLabel: "per kg", description: "Thick-cut sheep chops, perfect for grilling.", unitLabel: "kg", options: [{ label: "Pack Size", choices: ["500g", "1kg"], default: "1kg" }] },
  { id: "sheep-neck", name: "Sheep Neck", category: "bulk-sheep", type: "per-kg", price: 7.99, priceLabel: "per kg", description: "Sheep neck, excellent for curries and slow cooking.", unitLabel: "kg", options: [{ label: "Pack Size", choices: ["500g", "1kg"], default: "1kg" }] },
];

export const chickenProducts: Product[] = [
  { id: "chicken-breast-box", name: "5kg Breast Box", category: "bulk-chicken", type: "box", price: 34.99, priceLabel: "per box", description: "5kg of chicken breast fillets.", note: "Chicken boxes do NOT come individually packed.", unitLabel: "box" },
  { id: "chicken-thigh-box", name: "Chicken Thigh (on bone) Box", category: "bulk-chicken", type: "box", price: 24.99, priceLabel: "per box", description: "Chicken thighs on the bone. Available as 5kg box or per kg.", note: "Chicken boxes do NOT come individually packed.", options: [{ label: "Size", choices: ["5kg Box", "Per KG"], default: "5kg Box" }], unitLabel: "box" },
  { id: "chicken-whole-box", name: "Whole Chicken Box", category: "bulk-chicken", type: "per-kg", price: 4.99, priceLabel: "per kg", description: "Whole chickens, sold by weight.", note: "Chicken boxes do NOT come individually packed.", unitLabel: "kg" },
  { id: "chicken-legs", name: "Chicken Legs", category: "bulk-chicken", type: "per-piece", price: 7.99, priceLabel: "per 5 pieces", description: "Sold as 5-piece units.", note: "Chicken boxes do NOT come individually packed.", unitLabel: "5-piece" },
  { id: "chicken-wings", name: "Chicken Wings", category: "bulk-chicken", type: "per-kg", price: 5.99, priceLabel: "per kg", description: "Chicken wings, sold by weight.", note: "Chicken boxes do NOT come individually packed.", unitLabel: "kg" },
  { id: "chicken-drumsticks", name: "Chicken Drumsticks", category: "bulk-chicken", type: "per-piece", price: 9.99, priceLabel: "per 10 pieces", description: "Sold as 10-piece units.", note: "Chicken boxes do NOT come individually packed.", unitLabel: "10-piece" },
];

export const extrasProducts: Product[] = [
  {
    id: "extras-seasoning-bundle",
    name: "Steak Seasoning Bundle (2 Tubs)",
    category: "extras",
    type: "bundle",
    price: 12.99,
    priceLabel: "per bundle",
    description: "\"Lamb Chops & Steaks\" + \"The Steak Rub\" (90g each). Suitable for Halal, Vegetarian & Vegan.",
    details: [
      "Suitable for: Halal / Vegetarian / Vegan",
      "Allergen: Contains Celery",
    ],
  },
  {
    id: "extras-beef-tallow",
    name: "Halal Beef Tallow",
    category: "extras",
    type: "per-pack",
    price: 8.99,
    priceLabel: "per 1kg tub",
    description: "Pure halal beef tallow, 1kg tub. Great for cooking and frying.",
    unitLabel: "tub",
  },
  {
    id: "extras-eggs-free-range",
    name: "Free Range Eggs (12 per box)",
    category: "extras",
    type: "per-pack",
    price: 4.99,
    priceLabel: "per box of 12",
    description: "Farm-fresh free range eggs, box of 12.",
    unitLabel: "box",
  },
  {
    id: "extras-eggs-golden",
    name: "Golden Free Range Eggs (12 per box)",
    category: "extras",
    type: "per-pack",
    price: 5.99,
    priceLabel: "per box of 12",
    badge: "Premium",
    description: "Premium golden free range eggs, box of 12.",
    unitLabel: "box",
  },
  {
    id: "extras-whole-pluck",
    name: "Whole Pluck (Hearts, Lungs, Liver)",
    category: "extras",
    type: "bundle",
    price: 14.99,
    priceLabel: "per bundle",
    description: "Available for beef, lamb, or mutton. Add notes for your preference.",
    options: [
      { label: "Animal", choices: ["Beef", "Lamb", "Mutton"], default: "Beef" },
    ],
  },
];

export const allProducts: Product[] = [
  ...beefProducts,
  ...lambProducts,
  ...sheepProducts,
  ...chickenProducts,
  ...extrasProducts,
];

export const getProductById = (id: string) => allProducts.find(p => p.id === id);
