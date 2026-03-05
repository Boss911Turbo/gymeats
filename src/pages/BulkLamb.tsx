import CategoryPage from "@/components/CategoryPage";
import { lambProducts } from "@/data/products";

const BulkLamb = () => (
  <CategoryPage
    title="Bulk Lamb"
    subtitle="Whole lamb boxes, broken down and vacuum packed. Full lamb only — no half box option."
    infoBlocks={[
      "Lamb sizing: Small 14–16kg, Standard 16–22kg, Large 22–26kg",
      "Vacuum packed; 500g or 1kg bags; big pieces in meat bags.",
      "Lamb boxes are full carcass only.",
    ]}
    products={lambProducts}
  />
);

export default BulkLamb;
