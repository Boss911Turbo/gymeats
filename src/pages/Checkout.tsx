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
  const [noRefundsConfirmed, setNoRefundsConfirmed] = useState(false);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");

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
    msg += `*Customer:* ${form.fullName}\n*Phone:* ${form.phone}\n*Email:* ${form.email}\n`;
    msg += `*${form.deliveryMethod === "delivery" ? "Address" : "Pickup"}:* ${form.deliveryMethod === "delivery" ? form.address : "Customer will pick up"}\n`;
    if (preferredDate) msg += `*Preferred Date:* ${preferredDate}\n`;
    if (preferredTime) msg += `*Preferred Time:* ${preferredTime}\n`;
    msg += `*Payment:* ${paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}\n`;
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
    msg += `\n\n*Subtotal:* £${subtotal.toFixed(2)}\n*Delivery:* ${getDeliveryLabel()}\n*TOTAL:* £${total.toFixed(2)}`;
    return msg;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    if (!noRefundsConfirmed) { toast.error("Please confirm the no returns or refunds policy"); return; }
    const summary = buildOrderSummary();
    const waNumber = WHATSAPP_NUMBER.replace("+", "");
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(summary)}`, "_blank");
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
          <p className="text-muted-foreground mb-6">Your order has been sent via WhatsApp and email. We'll confirm the final price based on actual meat weight and arrange {form.deliveryMethod === "delivery" ? "delivery" : "pickup"}.</p>
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
          <div className="text-center py-12"><p className="text-muted-foreground mb-4">Your cart is empty.</p><Link to="/bulk-beef"><Button>Shop Now</Button></Link></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-4">
              <div><label className="text-sm font-semibold block mb-1">Full Name *</label><input className="w-full border border-input bg-background rounded px-3 py-2 text-sm" required value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-sm font-semibold block mb-1">Phone *</label><input className="w-full border border-input bg-background rounded px-3 py-2 text-sm" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div><label className="text-sm font-semibold block mb-1">Email *</label><input type="email" className="w-full border border-input bg-background rounded px-3 py-2 text-sm" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              </div>
              {PICKUP_AVAILABLE && (
                <div>
                  <label className="text-sm font-semibold block mb-2">Delivery Method</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="delivery" value="delivery" checked={form.deliveryMethod === "delivery"} onChange={() => setForm({...form, deliveryMethod: "delivery"})} /><span className="text-sm">Delivery ({subtotal >= FREE_DELIVERY_THRESHOLD ? "FREE" : subtotal < SMALL_ORDER_THRESHOLD ? `£${SMALL_ORDER_FEE}` : `£${DELIVERY_FEE}`})</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="delivery" value="pickup" checked={form.deliveryMethod === "pickup"} onChange={() => setForm({...form, deliveryMethod: "pickup"})} /><span className="text-sm">Pickup (Free)</span></label>
                  </div>
                </div>
              )}
              {form.deliveryMethod === "delivery" && (
                <>
                  <div><label className="text-sm font-semibold block mb-1">Delivery Address *</label><textarea className="w-full border border-input bg-background rounded px-3 py-2 text-sm resize-none" rows={3} required value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="text-sm font-semibold block mb-1">Preferred Delivery Date</label><input type="date" className="w-full border border-input bg-background rounded px-3 py-2 text-sm" value={preferredDate} onChange={e => setPreferredDate(e.target.value)} /></div>
                    <div><label className="text-sm font-semibold block mb-1">Preferred Delivery Time</label><input type="time" className="w-full border border-input bg-background rounded px-3 py-2 text-sm" value={preferredTime} onChange={e => setPreferredTime(e.target.value)} /></div>
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-semibold block mb-2">Payment Method</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} /><span className="text-sm">Online Payment</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} /><span className="text-sm">Cash on Delivery</span></label>
                </div>
              </div>
              <div><label className="text-sm font-semibold block mb-1">Notes (cutting preferences, etc.)</label><textarea className="w-full border border-input bg-background rounded px-3 py-2 text-sm resize-none" rows={3} placeholder="Any special instructions..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
              <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
                <h3 className="font-bold text-sm mb-2 text-foreground">⚖️ Important: Weight-Based Pricing</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  All our meat is priced by dead weight, which means the final cost is determined by the actual weight of your order after processing. While we aim to match your desired weight as closely as possible, slight variations are natural when purchasing bulk cuts — this is standard practice across the industry.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  Once your deposit is received, we'll confirm the exact weight and final price with you via WhatsApp before dispatch. Your deposit secures your order in the current batch.
                </p>
                <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                  Prices shown at checkout are approximate estimates based on your selected weight. The confirmed price may differ slightly depending on the actual cut weight available.
                </p>
              </div>
              <div className="flex items-start gap-2 mb-4">
                <input type="checkbox" id="no-refunds" checked={noRefundsConfirmed} onChange={e => setNoRefundsConfirmed(e.target.checked)} className="mt-1 accent-accent" required />
                <label htmlFor="no-refunds" className="text-sm text-muted-foreground">I understand and agree that <span className="font-bold text-foreground">all sales are final — no returns or refunds</span>. Deposits are non-refundable unless stated otherwise. I acknowledge that final pricing is based on actual dead weight and will be confirmed via WhatsApp.</label>
              </div>
              <Button type="submit" size="lg" className="w-full font-bold bg-accent text-accent-foreground hover:bg-accent/90">Place Order via WhatsApp</Button>
            </form>
            <div className="bg-card border border-border rounded-lg p-6 h-fit">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item, i) => (<div key={i} className="flex justify-between text-sm"><span className="text-muted-foreground">{item.productName} x{item.quantity}</span><span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span></div>))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span>{getDeliveryLabel()}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border"><span>Total</span><span>£{total.toFixed(2)}</span></div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Final price confirmed after weighing. You only pay for actual weight.</p>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Checkout;
