import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Truck, Package, Shield, ChevronRight, Flame, Star } from "lucide-react";
import heroImage from "@/assets/hero-meat.jpg";
import { ANNOUNCEMENT_TEXT, WEEKLY_DEAL_PRODUCT_ID, beefProducts, FREE_DELIVERY_THRESHOLD } from "@/data/products";
import BatchProgressBar from "@/components/BatchProgressBar";

const categories = [
  { to: "/bulk-beef", label: "Bulk Beef", emoji: "🥩" },
  { to: "/bulk-lamb", label: "Bulk Lamb", emoji: "🐑" },
  { to: "/bulk-sheep", label: "Bulk Sheep", emoji: "🐏" },
  { to: "/bulk-chicken", label: "Bulk Chicken", emoji: "🍗" },
  { to: "/extras", label: "Extras", emoji: "🧂" },
];

const weeklyDealProduct = beefProducts.find(p => p.id === WEEKLY_DEAL_PRODUCT_ID);

const Index = () => (
  <Layout>
    {/* Announcement Bar */}
    <div className="bg-accent text-accent-foreground text-center py-2 px-4">
      <p className="text-sm font-bold tracking-wide">{ANNOUNCEMENT_TEXT}</p>
    </div>

    {/* Hero */}
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="relative container-tight py-20 md:py-32">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 max-w-2xl">
          Bulk halal meat, ordered online.
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/70 max-w-xl mb-8">
          Meal prep, family packs, bulk value. Vacuum packed and delivered fresh to your door.
          <span className="block mt-1 font-semibold text-primary-foreground">Free delivery on orders over £{FREE_DELIVERY_THRESHOLD}!</span>
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/bulk-beef">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
              Shop Beef <ChevronRight size={18} />
            </Button>
          </Link>
          <Link to="/bulk-chicken">
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-bold">
              Shop Chicken
            </Button>
          </Link>
          <Link to="/cart">
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-bold gap-2">
              <ShoppingCart size={18} /> Go to Cart
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* Weekly Deal */}
    {weeklyDealProduct && (
      <section className="bg-accent/5 border-y border-accent/20 py-12">
        <div className="container-tight">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Flame size={24} className="text-accent" />
            <h2 className="text-2xl md:text-3xl font-black text-center">Weekly Deal</h2>
            <Flame size={24} className="text-accent" />
          </div>
          <div className="max-w-2xl mx-auto bg-card border-2 border-accent/30 rounded-xl p-8">
            <div className="flex items-center gap-2 mb-2">
              <Star size={18} className="text-accent fill-accent" />
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Save Big This Week</span>
            </div>
            <h3 className="text-2xl font-black mb-2">{weeklyDealProduct.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{weeklyDealProduct.description}</p>
            <p className="text-accent font-black text-3xl mb-4">
              £{weeklyDealProduct.price.toFixed(2)}
              <span className="text-muted-foreground text-sm font-normal ml-2">{weeklyDealProduct.priceLabel}</span>
            </p>
            {weeklyDealProduct.halfBoxAvailable && (
              <p className="text-sm text-muted-foreground mb-4">
                Also available as <span className="font-bold">Half Box — £{(weeklyDealProduct.halfBoxPrice || weeklyDealProduct.price / 2).toFixed(2)}</span>
              </p>
            )}
            <BatchProgressBar productId={weeklyDealProduct.id} />
            {weeklyDealProduct.components && (
              <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                {weeklyDealProduct.components.map(c => (
                  <li key={c.name}>• <span className="font-medium text-foreground">{c.name}</span>: {c.detail}</li>
                ))}
              </ul>
            )}
            <Link to="/bulk-beef">
              <Button size="lg" className="w-full font-bold bg-accent text-accent-foreground hover:bg-accent/90">
                Shop Now <ChevronRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )}

    {/* Categories */}
    <section className="container-tight py-16">
      <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map(cat => (
          <Link
            key={cat.to}
            to={cat.to}
            className="bg-card border border-border rounded-lg p-6 text-center hover:border-foreground/30 transition-colors group"
          >
            <span className="text-4xl block mb-3">{cat.emoji}</span>
            <span className="font-semibold text-sm group-hover:text-accent transition-colors">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section className="bg-muted py-16">
      <div className="container-tight">
        <h2 className="text-2xl md:text-3xl font-black mb-10 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <ShoppingCart size={32} />, title: "1. Add to Cart", desc: "Browse our range and add your bulk meat boxes and per-kg items." },
            { icon: <Package size={32} />, title: "2. Checkout", desc: "Fill in your details and review your order summary." },
            { icon: <Truck size={32} />, title: "3. WhatsApp Confirmation", desc: "We confirm your order on WhatsApp and arrange delivery or pickup." },
          ].map(step => (
            <div key={step.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                {step.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Trust */}
    <section className="container-tight py-16">
      <h2 className="text-2xl md:text-3xl font-black mb-10 text-center">Why GYMEATS?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Shield size={24} />, title: "100% Halal", desc: "All meat is certified halal from trusted sources." },
          { icon: <Package size={24} />, title: "Vacuum Packed", desc: "Individually packed for freshness and easy freezing." },
          { icon: <Truck size={24} />, title: "Free Delivery Over £120", desc: `Free delivery on orders over £${FREE_DELIVERY_THRESHOLD}. Otherwise £20 flat fee.` },
          { title: "⚖️ Accurate Weights", desc: "All weights are as close as possible to your desired amount." },
        ].map(item => (
          <div key={item.title} className="border border-border rounded-lg p-6">
            {item.icon && <div className="mb-3 text-foreground">{item.icon}</div>}
            <h3 className="font-bold mb-1">{item.title}</h3>
            <p className="text-muted-foreground text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* FAQ */}
    <section className="bg-muted py-16">
      <div className="container-tight">
        <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">FAQ</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            { q: "Do you deliver or offer pickup?", a: `Yes, both! Delivery is free on orders over £${FREE_DELIVERY_THRESHOLD} (otherwise £20). Pickup is always free — we'll arrange a time via WhatsApp.` },
            { q: "Is there a minimum order?", a: "Minimum order details coming soon. Contact us for more info." },
            { q: "What are the lead times?", a: "Lead times vary. We'll confirm via WhatsApp when you place your order." },
            { q: "How should I store the meat?", a: "All items are vacuum packed for easy freezing. Store in your freezer and defrost as needed. Most items will keep for several months when frozen." },
            { q: "Can I order a half box?", a: "Yes! Most of our boxes are available as half box or full box. Select your preferred size when ordering." },
          ].map(faq => (
            <details key={faq.q} className="bg-card border border-border rounded-lg p-4 group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                {faq.q}
                <ChevronRight size={18} className="text-muted-foreground group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-3 text-muted-foreground text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;
