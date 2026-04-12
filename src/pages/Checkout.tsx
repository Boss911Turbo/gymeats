import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_NUMBER, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, SMALL_ORDER_THRESHOLD, SMALL_ORDER_FEE } from "@/data/products";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, MessageCircle, Truck, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Checkout = () => {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    postcode: "",
    deliveryMethod: "delivery" as "delivery" | "pickup",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  if (items.length === 0) {
    return (
      <Layout>
        <section className="container-tight py-20 text-center">
          <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-black mb-2">Nothing to checkout</h1>
          <p className="text-muted-foreground mb-6">Add items to your cart first.</p>
          <Link to="/bulk-beef">
            <Button>Shop Beef</Button>
          </Link>
        </section>
      </Layout>
    );
  }

  const deliveryFee =
    form.deliveryMethod === "pickup"
      ? 0
      : subtotal >= FREE_DELIVERY_THRESHOLD
        ? 0
        : subtotal < SMALL_ORDER_THRESHOLD
          ? SMALL_ORDER_FEE
          : DELIVERY_FEE;

  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderLines = items.map((item, i) => {
      const options = Object.entries(item.selectedOptions)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      const weight = item.targetWeight ? ` (${item.targetWeight}kg)` : "";
      const notes = item.notes ? ` — ${item.notes}` : "";
      return `${i + 1}. ${item.productName}${weight} x${item.quantity} — £${(item.price * item.quantity).toFixed(2)}${options ? ` [${options}]` : ""}${notes}`;
    });

    const message = [
      `*🥩 GYMEATS ORDER*`,
      ``,
      `*Customer:* ${form.name}`,
      `*Phone:* ${form.phone}`,
      form.deliveryMethod === "delivery"
        ? `*Address:* ${form.address}, ${form.postcode}`
        : `*Method:* Pickup`,
      form.preferredDate ? `*Preferred Date:* ${form.preferredDate}` : "",
      form.preferredTime ? `*Preferred Time:* ${form.preferredTime}` : "",
      ``,
      `*Items:*`,
      ...orderLines,
      ``,
      `*Subtotal:* £${subtotal.toFixed(2)}`,
      form.deliveryMethod === "delivery" ? `*Delivery:* £${deliveryFee.toFixed(2)}${deliveryFee === 0 ? " (FREE)" : ""}` : `*Pickup:* FREE`,
      `*Total:* £${total.toFixed(2)}`,
      form.notes ? `\n*Notes:* ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("%0A");

    const waNumber = WHATSAPP_NUMBER.replace("+", "");
    window.open(`https://wa.me/${waNumber}?text=${message}`, "_blank");
    toast.success("Order sent via WhatsApp! We'll confirm shortly.");
    clearCart();
    navigate("/");
  };

  return (
    <Layout>
      <section className="container-tight py-10">
        <h1 className="text-3xl font-black mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>

            {/* Delivery Method */}
            <div>
              <Label className="mb-2 block">Delivery Method *</Label>
              <RadioGroup
                value={form.deliveryMethod}
                onValueChange={(v) => setForm(f => ({ ...f, deliveryMethod: v as "delivery" | "pickup" }))}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2 border border-border rounded-lg p-3 flex-1 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="cursor-pointer flex items-center gap-2">
                    <Truck size={16} /> Delivery
                  </Label>
                </div>
                <div className="flex items-center gap-2 border border-border rounded-lg p-3 flex-1 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="cursor-pointer flex items-center gap-2">
                    <Store size={16} /> Pickup (Free)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {form.deliveryMethod === "delivery" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode *</Label>
                  <Input id="postcode" required value={form.postcode} onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input id="date" type="date" value={form.preferredDate} onChange={e => setForm(f => ({ ...f, preferredDate: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Input id="time" type="time" value={form.preferredTime} onChange={e => setForm(f => ({ ...f, preferredTime: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Order Notes (optional)</Label>
              <Textarea id="notes" rows={3} placeholder="Any special instructions..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>

            <Button type="submit" size="lg" className="w-full font-bold gap-2">
              <MessageCircle size={18} />
              Place Order via WhatsApp
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your order will be sent to us via WhatsApp. We'll confirm availability and arrange payment.
            </p>
          </form>

          {/* Order Summary */}
          <div className="border border-border rounded-lg p-5 h-fit sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="flex-1">
                    {item.productName} x{item.quantity}
                    {item.targetWeight && <span className="text-muted-foreground"> ({item.targetWeight}kg)</span>}
                  </span>
                  <span className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{form.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}</span>
                <span>{deliveryFee === 0 ? "FREE" : `£${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
