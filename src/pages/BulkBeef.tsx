import CategoryPage from "@/components/CategoryPage";
import { beefProducts } from "@/data/products";

const BulkBeef = () => (
  <CategoryPage
    title="Bulk Beef"
    subtitle="Vacuum packed, individually packed. Mince in 500g/1kg bags. Big cuts in meat bags."
    products={beefProducts}
  />
);

export default BulkBeef;
