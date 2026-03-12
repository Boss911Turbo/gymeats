import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import Layout from "./Layout";
import { ANNOUNCEMENT_TEXT } from "@/data/products";

interface CategoryPageProps {
  title: string;
  subtitle?: string;
  infoBlocks?: string[];
  products: Product[];
}

const CategoryPage = ({ title, subtitle, infoBlocks, products }: CategoryPageProps) => (
  <Layout>
    {/* Announcement bar */}
    <div className="bg-accent text-accent-foreground text-center py-2 px-4">
      <p className="text-sm font-bold tracking-wide">{ANNOUNCEMENT_TEXT}</p>
    </div>

    <section className="container-tight py-10">
      <h1 className="text-3xl md:text-4xl font-black mb-2">{title}</h1>
      {subtitle && <p className="text-muted-foreground mb-4">{subtitle}</p>}

      {/* Weekly delivery freshness notice */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg px-4 py-3 mb-6 flex items-start gap-3">
        <span className="text-lg">🚚</span>
        <div>
          <p className="text-sm font-bold text-foreground">Deliveries Every Week for Maximum Freshness</p>
          <p className="text-xs text-muted-foreground">All orders are processed and delivered weekly using our refrigerated fleet — ensuring your meat arrives as fresh as the day it was cut. No long storage, no compromises on quality.</p>
        </div>
      </div>

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
