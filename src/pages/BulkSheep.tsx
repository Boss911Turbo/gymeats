import CategoryPage from "@/components/CategoryPage";
import { sheepProducts } from "@/data/products";

const BulkSheep = () => (
  <CategoryPage
    title="Bulk Sheep"
    subtitle="Fresh sheep cuts, sold per kg."
    infoBlocks={[
      "Sheep sizing: Small 20–25kg, Standard 25–35kg, Large 35–45kg",
      "Vacuum packed; 500g or 1kg bags; big pieces in meat bags.",
    ]}
    products={sheepProducts}
  />
);

export default BulkSheep;
