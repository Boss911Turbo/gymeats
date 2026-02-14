import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import Layout from "./Layout";

interface CategoryPageProps {
  title: string;
  subtitle?: string;
  infoBlocks?: string[];
  products: Product[];
}

const CategoryPage = ({ title, subtitle, infoBlocks, products }: CategoryPageProps) => (
  <Layout>
    <section className="container-tight py-10">
      <h1 className="text-3xl md:text-4xl font-black mb-2">{title}</h1>
      {subtitle && <p className="text-muted-foreground mb-6">{subtitle}</p>}

      {infoBlocks && infoBlocks.length > 0 && (
        <div className="bg-muted rounded-lg p-4 mb-8 space-y-1">
          {infoBlocks.map((block, i) => (
            <p key={i} className="text-sm text-muted-foreground">ℹ️ {block}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  </Layout>
);

export default CategoryPage;
