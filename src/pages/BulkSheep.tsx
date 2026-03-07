import CategoryPage from "@/components/CategoryPage";
import { sheepProducts } from "@/data/products";

const BulkSheep = () => (
  <CategoryPage
    title="Bulk Mutton"
    subtitle="Whole mutton carcass boxes. Half box = half carcass, Full box = full carcass."
    infoBlocks={[
      "Mutton sizing: Small 20–25kg, Standard 25–35kg, Large 35–45kg",
      "Vacuum packed; 500g or 1kg bags; big pieces in meat bags.",
      "Half box = half carcass. Full box = full carcass.",
    ]}
    products={sheepProducts}
  />
);

export default BulkSheep;
