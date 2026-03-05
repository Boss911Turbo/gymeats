import CategoryPage from "@/components/CategoryPage";
import { chickenProducts } from "@/data/products";

const BulkChicken = () => (
  <CategoryPage
    title="Bulk Chicken"
    subtitle="Fresh halal chicken in bulk. All chicken is outsourced from a reputable alternative halal-certified company."
    infoBlocks={[
      "⚠️ Chicken boxes do NOT come individually packed.",
      "🐔 Chicken is outsourced from a reputable alternative halal-certified supplier.",
      "🦴 Bones removed option available on select products — additional £15 charge. Full weight with bones is charged.",
    ]}
    products={chickenProducts}
  />
);

export default BulkChicken;
