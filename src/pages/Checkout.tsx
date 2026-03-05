import { useState } from "react";
import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { WHATSAPP_NUMBER, BUSINESS_EMAIL, DELIVERY_FEE, PICKUP_AVAILABLE, FREE_DELIVERY_THRESHOLD, SMALL_ORDER_THRESHOLD, SMALL_ORDER_FEE } from "@/data/products";
import { CheckoutForm } from "@/types/product";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    fullName: "", phone: "", email: "", address: "", deliveryMethod: "delivery", notes: "",
  });
  const [placed, setPlaced] = useState(false);

  const getDeliveryFee = () => {
    if (form.deliveryMethod !== "delivery") return 0;
    if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
    if (subtotal < SMALL_ORDER_THRESHOLD) return SMALL_ORDER_FEE;
    return DELIVERY_FEE;
  };

  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;

  const getDeliveryLabel = () => {
    if (form.deliveryMethod !== "delivery") return "Free (Pickup)";
    if (subtotal >= FREE_DELIVERY_THRESHOLD) return `Free (over £${FREE_DELIVERY_THRESHOLD})`;
    if (subtotal < SMALL_ORDER_THRESHOLD) return `£${SMALL_ORDER_FEE} (under £${SMALL_ORDER_THRESHOLD})`;
    return `£${DELIVERY_FEE}`;
  };

  const buildOrderSummary = () => {
    let msg = `*GYMEATS ORDER*\n\n`;
    msg += `*Customer:* ${form.fullName}\n`;
    msg += `*Phone:* ${form.phone}\n`;
    msg += `*Email:* ${form.email}\n`;
    msg += `*${form.deliveryMethod === "delivery" ? "Address" : "Pickup"}:* ${form.deliveryMethod === "delivery" ? form.address : "Customer will pick up"}\n`;
    if (form.notes) msg += `*Notes:* ${form.notes}\n`;
    msg += `\n*--- Items ---*\n`;
    items.forEach(item => {
      msg += `\n• ${item.productName} x${item.quantity}`;
      if (item.unitLabel) msg += ` (${item.unitLabel})`;
      msg += ` — £${(item.price * item.quantity).toFixed(2)}`;
      if (item.targetWeight) msg += `\n  Target weight: ${item.targetWeight}kg`;
      const opts = Object.entries(item.selectedOptions);
      if (opts.length) msg += `\n  ${opts.map(([k, v]) => `${k}: ${v}`).join(", ")}`;
      if (item.notes) msg += `\n  Notes: ${item.notes}`;
    });
    msg += `\n\n*Subtotal:* £${subtotal.toFixed(2)}`;
    msg += `\n*Delivery:* ${getDeliveryLabel()}`;
    msg += `\n*TOTAL:* £${total.toFixed(2)}`;
    return msg;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Your cart is empty"); return; }

    const summary = buildOrderSummary();
    const waNumber = WHATSAPP_NUMBER.replace("+", "");
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(summary)}`;
    window.open(waUrl, "_blank");

    const subject = encodeURIComponent("GYMEATS Order from " + form.fullName);
    const body = encodeURIComponent(summary.replace(/\*/g, ""));
    window.open(`mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`, "_blank");

    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <Layout>
        <section className="container-tight py-20 text-center max-w-lg mx-auto">
          <CheckCircle size={64} className="mx-auto text-success mb-4" />
          <h1 className="text-3xl font-black mb-3">Order Placed!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been sent via WhatsApp and email. We'll be in touch shortly to confirm details and arrange {form.deliveryMethod === "delivery" ? "delivery" : "pickup"}.
          </p>
          <Link to="/"><Button>Back to Home</Button></Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-tight py-10">
        <h1 className="text-3xl font-black mb-6">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Link to="/bulk-beef"><Button>Shop Now</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1">Full Name *</label>
                <input className="w-full border border-input bg-background rounded px-3 py-2 text-sm" required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold block mb-1">Phone *</label>
                  <input className="w-full border border-input bg-background rounded px-3 py-2 text-sm" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1">Email *</label>
                  <input type="email" className="w-full border border-input bg-background rounded px-3 py-2 text-sm" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>

              {PICKUP_AVAILABLE && (
                <div>
                  <label className="text-sm font-semibold block mb-2">Delivery Method</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="delivery" value="delivery" checked={form.deliveryMethod === "delivery"} onChange={() => setForm({ ...form, deliveryMethod: "delivery" })} />
                      <span className="text-sm">
                        Delivery ({subtotal >= FREE_DELIVERY_THRESHOLD ? "FREE" : subtotal < SMALL_ORDER_THRESHOLD ? `£${SMALL_ORDER_FEE}` : `£${DELIVERY_FEE}`})
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="delivery" value="pickup" checked={form.deliveryMethod === "pickup"} onChange={() => setForm({ ...form, deliveryMethod: "pickup" })} />
                      <span className="text-sm">Pickup (Free)</span>
                    </label>
                  </div>
                </div>
              )}

              {form.deliveryMethod === "delivery" && (
                <div>
                  <label className="text-sm font-semibold block mb-1">Delivery Address *</label>
                  <textarea className="w-full border border-input bg-background rounded px-3 py-2 text-sm resize-none" rows={3} required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>
              )}

              <div>
                <label className="text-sm font-semibold block mb-1">Notes (delivery slot, cutting preferences, etc.)</label>
                <textarea className="w-full border border-input bg-background rounded px-3 py-2 text-sm resize-none" rows={3} placeholder="Any special instructions..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              <Button type="submit" size="lg" className="w-full font-bold bg-accent text-accent-foreground hover:bg-accent/90">
                Place Order via WhatsApp
              </Button>
            </form>

            {/* Order summary sidebar */}
            <div className="bg-card border border-border rounded-lg p-6 h-fit">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.productName} x{item.quantity}</span>
                    <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>{getDeliveryLabel()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Checkout;
