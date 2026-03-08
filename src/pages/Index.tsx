import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Truck, Package, Shield, ChevronRight, Flame, Star, Scissors, Clock, Snowflake, CreditCard, FileText, CalendarDays } from "lucide-react";
import heroImage from "@/assets/hero-meat.jpg";
import { ANNOUNCEMENT_TEXT, WEEKLY_DEAL_PRODUCT_ID, beefProducts, FREE_DELIVERY_THRESHOLD, WHATSAPP_NUMBER, BUSINESS_EMAIL } from "@/data/products";
import BatchProgressBar from "@/components/BatchProgressBar";
import { useState } from "react";
import { toast } from "sonner";

const categories = [
  { to: "/bulk-beef", label: "Bulk Beef", emoji: "🥩" },
  { to: "/bulk-lamb", label: "Bulk Lamb", emoji: "🐑" },
  { to: "/bulk-mutton", label: "Bulk Mutton", emoji: "🐏" },
  { to: "/bulk-chicken", label: "Bulk Chicken", emoji: "🍗" },
  { to: "/extras", label: "Extras", emoji: "🧂" },
];

const weeklyDealProduct = beefProducts.find(p => p.id === WEEKLY_DEAL_PRODUCT_ID);

const Index = () => {
  const [customForm, setCustomForm] = useState({ name: "", email: "", whatsapp: "", eventSize: "", location: "", date: "", time: "", notes: "" });

  const handleCustomOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("GYMEATS Custom/Event Order");
    const body = encodeURIComponent(`Name: ${customForm.name}\nEmail: ${customForm.email}\nWhatsApp: ${customForm.whatsapp}\nEvent Size: ${customForm.eventSize}\nLocation: ${customForm.location}\nPreferred Date: ${customForm.date}\nPreferred Time: ${customForm.time}\nNotes: ${customForm.notes}`);
    window.open(`mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    const waNumber = WHATSAPP_NUMBER.replace("+", "");
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi! I'd like to place a custom/event order:\n\nName: ${customForm.name}\nEvent Size: ${customForm.eventSize}\nLocation: ${customForm.location}\nDate: ${customForm.date}\nTime: ${customForm.time}\nNotes: ${customForm.notes}`)}`, "_blank");
    toast.success("Custom order request sent!");
    setCustomForm({ name: "", email: "", whatsapp: "", eventSize: "", location: "", date: "", time: "", notes: "" });
  };

  return (
    <Layout>
      {/* Announcement Bar */}
      <Link to="/bulk-beef" className="block bg-accent text-accent-foreground text-center py-2 px-4 hover:bg-accent/90 transition-colors cursor-pointer">
        <p className="text-sm font-bold tracking-wide">🔥 LIMITED WEEKLY DROP: The Value Box — Premium beef, zero waste, unbeatable price. Tap to shop →</p>
      </Link>

      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="relative container-tight py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 max-w-2xl">Bulk meat, ordered online.</h1>
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-xl mb-8">
            Meal prep, family packs, bulk value. Vacuum packed and delivered fresh to your door.
            <span className="block mt-1 font-semibold text-primary-foreground">Free delivery on orders over £{FREE_DELIVERY_THRESHOLD}!</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/bulk-beef"><Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold gap-1">Shop Beef <ChevronRight size={18} /></Button></Link>
            <Link to="/bulk-chicken"><Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold gap-1">Shop Chicken <ChevronRight size={18} /></Button></Link>
            <Link to="/cart"><Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold gap-1"><ShoppingCart size={18} /> Go to Cart</Button></Link>
          </div>
        </div>
      </section>

      {/* No Middleman */}
      <section className="bg-primary text-primary-foreground py-12 border-t border-primary-foreground/10">
        <div className="container-tight text-center">
          <div className="flex items-center justify-center gap-3 mb-4"><Scissors size={28} /><h2 className="text-2xl md:text-3xl font-black">Why Are We So Cheap?</h2></div>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">We <span className="font-bold text-primary-foreground">source, kill, and deliver ourselves</span>. No middleman. No markups. We own the full supply chain — from our own farms, our own slaughterhouse, to our own delivery fleet. That's why we can offer premium halal meat at prices others can't match.</p>
        </div>
      </section>

      {/* Weekly Deal */}
      {weeklyDealProduct && (
        <section className="bg-accent/5 border-y border-accent/20 py-12">
          <div className="container-tight">
            <div className="flex items-center gap-2 mb-6 justify-center"><Flame size={24} className="text-accent" /><h2 className="text-2xl md:text-3xl font-black text-center">Weekly Deal</h2><Flame size={24} className="text-accent" /></div>
            <div className="max-w-2xl mx-auto bg-card border-2 border-accent/30 rounded-xl p-8">
              <div className="flex items-center gap-2 mb-2"><Star size={18} className="text-accent fill-accent" /><span className="text-xs font-bold text-accent uppercase tracking-widest">Most Recommended</span></div>
              <h3 className="text-2xl font-black mb-2">{weeklyDealProduct.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">{weeklyDealProduct.description}</p>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-4 flex items-start gap-2">
                <Clock size={16} className="text-accent mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">
                  <span className="font-bold text-accent">Limited Weekly Drop</span> — We can only offer this box at such an incredible price because we source in bulk directly from our own farms. Quantities are strictly limited each week — once the batch fills, orders close until next week. This is genuine high-quality meat at a price that shouldn't be possible. Don't miss out!
                </p>
              </div>
              <p className="text-accent font-black text-3xl mb-4">£{weeklyDealProduct.price.toFixed(2)}<span className="text-muted-foreground text-sm font-normal ml-2">{weeklyDealProduct.priceLabel}</span></p>
              {weeklyDealProduct.depositAmount && (
                <p className="text-sm text-muted-foreground mb-2">💳 <span className="font-bold">£{weeklyDealProduct.depositAmount} deposit</span> required — {weeklyDealProduct.depositRefundable ? "fully refundable if batch doesn't fill" : "non-refundable"}</p>
              )}
              <BatchProgressBar productId={weeklyDealProduct.id} />
              {weeklyDealProduct.components && (
                <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                  {weeklyDealProduct.components.map(c => (<li key={c.name}>• <span className="font-medium text-foreground">{c.name}</span>: {c.detail}</li>))}
                </ul>
              )}
              <Link to="/bulk-beef"><Button size="lg" className="w-full font-bold bg-accent text-accent-foreground hover:bg-accent/90">Shop Now <ChevronRight size={18} /></Button></Link>
            </div>
          </div>
        </section>
      )}

      {/* Coming Soon */}
      <section className="bg-muted/50 border-y border-border py-10">
        <div className="container-tight text-center">
          <h2 className="text-xl md:text-2xl font-black mb-4">Coming Soon 🔜</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["BBQ Box", "Qurbanis", "Pies", "Burgers", "Sausages", "Marinated Meats"].map(item => (
              <span key={item} className="bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-muted-foreground">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-tight py-16">
        <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link key={cat.to} to={cat.to} className="bg-card border border-border rounded-lg p-6 text-center hover:border-foreground/30 transition-colors group">
              <span className="text-4xl block mb-3">{cat.emoji}</span>
              <span className="font-semibold text-sm group-hover:text-accent transition-colors">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Delivery Process */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-tight">
          <h2 className="text-2xl md:text-3xl font-black mb-10 text-center">Our Delivery Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <CreditCard size={28} />, title: "1. Pay Deposit", desc: "Secure your order with a deposit via online payment or bank transfer." },
              { icon: <Package size={28} />, title: "2. We Prepare", desc: "Your meat is freshly cut, weighed, vacuum sealed and carefully packed." },
              { icon: <FileText size={28} />, title: "3. Final Price Confirmed", desc: "We confirm the exact price based on actual meat weight — you only pay for what you get." },
              { icon: <Truck size={28} />, title: "4. Delivery", desc: "Choose your preferred date & time. Pay the balance on delivery (cash or online) or in advance." },
            ].map(step => (
              <div key={step.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/10 text-primary-foreground mb-3">{step.icon}</div>
                <h3 className="font-bold text-sm mb-2">{step.title}</h3>
                <p className="text-primary-foreground/60 text-xs">{step.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-primary-foreground/50 text-xs mt-6">This same process applies to WhatsApp orders. We'll confirm everything via chat before delivery.</p>
        </div>
      </section>

      {/* Packaging & Freshness */}
      <section className="container-tight py-16">
        <h2 className="text-2xl md:text-3xl font-black mb-10 text-center">How We Pack & Deliver</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: <Package size={24} />, title: "Vacuum Sealed", desc: "Every cut is individually vacuum sealed for maximum freshness and easy freezing. Mince in 500g/1kg packs. Large cuts in professional meat bags." },
            { icon: <Snowflake size={24} />, title: "Refrigerated Vans", desc: "Your order is transported in our own refrigerated delivery vans, maintaining the cold chain from our butchery to your door — ensuring freshness in transit." },
            { icon: <Shield size={24} />, title: "Quality Guaranteed", desc: "We take pride in every box. Carefully packed, properly labelled, and delivered exactly as ordered. If there's ever an issue, we'll make it right." },
          ].map(item => (
            <div key={item.title} className="border border-border rounded-lg p-6">
              <div className="mb-3 text-foreground">{item.icon}</div>
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why GYMEATS */}
      <section className="bg-muted py-16">
        <div className="container-tight">
          <h2 className="text-2xl md:text-3xl font-black mb-10 text-center">Why GYMEATS?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: <Shield size={24} />, title: "100% Halal", desc: "All meat is certified halal from our own slaughterhouse." },
              { icon: <Package size={24} />, title: "Vacuum Packed", desc: "Individually packed for freshness and easy freezing." },
              { icon: <Truck size={24} />, title: `Free Delivery Over £${FREE_DELIVERY_THRESHOLD}`, desc: `Free delivery on orders over £${FREE_DELIVERY_THRESHOLD}. Orders under £50 = £10 delivery.` },
              { icon: <Package size={24} />, title: "Accurate Weights", desc: "All weights are as close as possible to your desired amount." },
            ].map(item => (
              <div key={item.title} className="border border-border rounded-lg p-6">
                <div className="mb-3 text-foreground">{item.icon}</div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Orders */}
      <section className="container-tight py-16">
        <h2 className="text-2xl md:text-3xl font-black mb-2 text-center">Custom Orders & Events</h2>
        <p className="text-muted-foreground text-center mb-8">Planning a large gathering, event, or need a custom order? Fill in the form below and we'll get back to you.</p>
        <form onSubmit={handleCustomOrder} className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-sm font-semibold block mb-1">Name *</label><input className="w-full border border-input bg-background rounded px-3 py-2 text-sm" required value={customForm.name} onChange={e => setCustomForm({...customForm, name: e.target.value})} /></div>
          <div><label className="text-sm font-semibold block mb-1">Email *</label><input type="email" className="w-full border border-input bg-background rounded px-3 py-2 text-sm" required value={customForm.email} onChange={e => setCustomForm({...customForm, email: e.target.value})} /></div>
          <div><label className="text-sm font-semibold block mb-1">WhatsApp Number *</label><input className="w-full border border-input bg-background rounded px-3 py-2 text-sm" required value={customForm.whatsapp} onChange={e => setCustomForm({...customForm, whatsapp: e.target.value})} /></div>
          <div><label className="text-sm font-semibold block mb-1">Event Size (people) *</label><input className="w-full border border-input bg-background rounded px-3 py-2 text-sm" required value={customForm.eventSize} onChange={e => setCustomForm({...customForm, eventSize: e.target.value})} placeholder="e.g. 50, 100, 200+" /></div>
          <div><label className="text-sm font-semibold block mb-1">Delivery Location *</label><input className="w-full border border-input bg-background rounded px-3 py-2 text-sm" required value={customForm.location} onChange={e => setCustomForm({...customForm, location: e.target.value})} /></div>
          <div><label className="text-sm font-semibold block mb-1">Preferred Date</label><input type="date" className="w-full border border-input bg-background rounded px-3 py-2 text-sm" value={customForm.date} onChange={e => setCustomForm({...customForm, date: e.target.value})} /></div>
          <div><label className="text-sm font-semibold block mb-1">Preferred Time</label><input type="time" className="w-full border border-input bg-background rounded px-3 py-2 text-sm" value={customForm.time} onChange={e => setCustomForm({...customForm, time: e.target.value})} /></div>
          <div className="sm:col-span-2"><label className="text-sm font-semibold block mb-1">Additional Notes</label><textarea className="w-full border border-input bg-background rounded px-3 py-2 text-sm resize-none" rows={3} value={customForm.notes} onChange={e => setCustomForm({...customForm, notes: e.target.value})} placeholder="Any specific requirements, cuts, quantities..." /></div>
          <div className="sm:col-span-2"><Button type="submit" size="lg" className="w-full font-bold bg-accent text-accent-foreground hover:bg-accent/90">Submit Custom Order Request</Button></div>
        </form>
      </section>

      {/* Terms & Conditions */}
      <section className="bg-muted/50 border-y border-border py-10">
        <div className="container-tight max-w-3xl">
          <h2 className="text-xl font-black mb-4 text-center">Terms & Conditions</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Pricing:</strong> Final pricing is based on the dead weight of the item including any trimmings. In some cases there may be a small difference between the initial weight and the trimmed, processed and packed weight — although this difference will be minimal.</p>
            <p><strong className="text-foreground">No Returns or Refunds:</strong> All sales are final. Deposits are non-refundable unless stated otherwise (e.g. the Value Box deposit is refundable if the weekly batch doesn't fill).</p>
            <p><strong className="text-foreground">Delivery:</strong> Delivery is £20 standard, free on orders over £100, and £10 for orders under £50. Preferred delivery date and time can be selected at checkout. Payment can be made online or cash on delivery.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted py-16">
        <div className="container-tight">
          <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">FAQ</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              { q: "Are you halal?", a: "Yes — all our meat is 100% halal certified. We own and operate our own slaughterhouse facilities, maintaining full halal compliance at every stage.", link: { text: "Learn more on our About page →", to: "/about" } },
              { q: "Do you deliver or offer pickup?", a: `Yes, both! Delivery is free on orders over £${FREE_DELIVERY_THRESHOLD}. Orders under £50 have a £10 delivery & packaging charge. Orders between £50–£${FREE_DELIVERY_THRESHOLD} are £20 delivery. Pickup is always free — we'll arrange a time via WhatsApp.` },
              { q: "How should I store the meat?", a: "All items are vacuum packed for easy freezing. Store in your freezer and defrost as needed. Most items will keep for several months when frozen." },
              { q: "A full box is too much for me — can I order smaller?", a: "Yes! Most of our beef and mutton boxes are available as half box or full box. Lamb boxes are full only. Select your preferred size when ordering. You can also try the Value Box which starts from 9kg." },
              { q: "What is the deposit for?", a: "Most boxes require a £50 non-refundable deposit to confirm your order. The Value Box requires a £30 refundable deposit — if the weekly batch doesn't fill, your deposit is fully refunded." },
              { q: "How does pricing work?", a: "Final pricing is based on the dead weight of the item including trimmings. There may be a very small difference between initial weight and trimmed, packed weight — but this will be minimal. We always confirm the exact price before delivery." },
            ].map(faq => (
              <details key={faq.q} className="bg-card border border-border rounded-lg p-4 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <ChevronRight size={18} className="text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-muted-foreground text-sm">
                  {faq.a}
                  {faq.link && (<Link to={faq.link.to} className="block mt-2 text-accent font-semibold hover:underline">{faq.link.text}</Link>)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
