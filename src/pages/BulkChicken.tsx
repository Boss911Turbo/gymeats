import CategoryPage from "@/components/CategoryPage";
import { chickenProducts } from "@/data/products";

const BulkChicken = () => (
  <CategoryPage
    title="Bulk Chicken"
    subtitle="Fresh halal chicken in bulk."
    infoBlocks={["⚠️ Chicken boxes do NOT come individually packed."]}
    products={chickenProducts}
  />
);

export default BulkChicken;
