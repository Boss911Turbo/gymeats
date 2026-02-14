import CategoryPage from "@/components/CategoryPage";
import { extrasProducts } from "@/data/products";

const Extras = () => (
  <CategoryPage
    title="Extras"
    subtitle="Seasonings, tallow, eggs and more."
    products={extrasProducts}
  />
);

export default Extras;
