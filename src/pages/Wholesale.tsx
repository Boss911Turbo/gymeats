import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Truck, Package, Shield, Store } from "lucide-react";
import { WHATSAPP_NUMBER, BUSINESS_EMAIL } from "@/data/products";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Wholesale = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    businessType: "",
    details: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `*Wholesale Enquiry*%0A%0ABusiness: ${form.businessName}%0AContact: ${form.contactName}%0APhone: ${form.phone}%0AEmail: ${form.email}%0AType: ${form.businessType}%0A%0ADetails:%0A${form.details}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${message}`, "_blank");
    toast({ title: "Enquiry sent", description: "We'll be in touch shortly via WhatsApp." });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container-tight">
          <div className="flex items-center gap-3 mb-4">
            <Store size={32} />
            <span className="text-sm font-bold uppercase tracking-widest text-primary-foreground/60">Trade & Wholesale</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 max-w-2xl">
            Supply your business with premium halal meat — direct from source.
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-xl">
            We supply restaurants, takeaways, butcher shops, caterers, food businesses, and anyone in need of slaughterhouse facilities. No middlemen — we are the whole process.
          </p>
        </div>
      </section>

      {/* Why trade with us */}
      <section className="container-tight py-16">
        <h2 className="text-2xl md:text-3xl font-black mb-10 text-center">Why Trade With GYMEATS?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Shield size={24} />, title: "100% Halal Certified", desc: "Full halal compliance from our own slaughterhouse facilities." },
            { icon: <Package size={24} />, title: "Competitive Trade Pricing", desc: "No middlemen means better margins for your business." },
            { icon: <Truck size={24} />, title: "Reliable Delivery", desc: "Our own fleet ensures consistent, on-time drops." },
            { icon: <Store size={24} />, title: "Slaughterhouse Access", desc: "Full slaughterhouse facilities available for businesses. Process your own animals with us." },
          ].map(item => (
            <div key={item.title} className="border border-border rounded-lg p-6">
              <div className="mb-3 text-foreground">{item.icon}</div>
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who we supply */}
      <section className="bg-muted py-16">
        <div className="container-tight">
          <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">Who We Supply</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {["Restaurants", "Takeaways", "Butcher Shops", "Caterers", "Hotels", "Schools", "Meal Prep Companies", "Food Trucks", "Retailers", "Slaughterhouse Clients"].map(type => (
              <div key={type} className="bg-card border border-border rounded-lg p-4 text-center">
                <span className="font-semibold text-sm">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="container-tight py-16">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black mb-2 text-center">Get a Trade Quote</h2>
          <p className="text-muted-foreground text-center mb-8">
            Tell us about your business and what you need. We'll get back to you with a tailored quote.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input id="businessName" required value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input id="contactName" required value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label htmlFor="businessType">Business Type *</Label>
              <Input id="businessType" required placeholder="e.g. Restaurant, Butcher Shop, Caterer, Slaughterhouse Client" value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))} />
            </div>

            <div>
              <Label htmlFor="details">What do you need? *</Label>
              <Textarea id="details" required rows={5} placeholder="Tell us about your typical order size, products you're interested in, delivery frequency, slaughterhouse requirements, etc." value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} />
            </div>

            <Button type="submit" size="lg" className="w-full font-bold">
              Send Enquiry via WhatsApp
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Or email us directly at{" "}
              <a href={`mailto:${BUSINESS_EMAIL}`} className="underline">{BUSINESS_EMAIL}</a>
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Wholesale;
