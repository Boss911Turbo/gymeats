import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, SMALL_ORDER_THRESHOLD, SMALL_ORDER_FEE } from "@/data/products";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Truck, Store, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

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

  // Auto-fill from profile
  useEffect(() => {
    if (!user) { setProfileLoaded(true); return; }
    supabase
      .from("profiles")
      .select("full_name, phone, address")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const hasAny = !!(data.full_name || data.phone || data.address);
          setForm(f => ({
            ...f,
            name: data.full_name || f.name,
            phone: data.phone || f.phone,
            address: data.address || f.address,
          }));
          if (hasAny) setPrefilled(true);
        }
        setProfileLoaded(true);
      });
  }, [user]);

  if (submittedOrderId) {
    return (
      <Layout>
        <section className="container-tight py-20 text-center">
          <CheckCircle2 size={56} className="mx-auto text-green-600 mb-4" />
          <h1 className="text-2xl font-black mb-2">Order received!</h1>
          <p className="text-muted-foreground mb-2 max-w-md mx-auto">
            Thanks — your order is now <strong>pending review</strong>. Our team will check availability and approve it shortly.
          </p>
          <p className="text-xs text-muted-foreground mb-6">Order ref: {submittedOrderId.slice(0, 8).toUpperCase()}</p>

          <div className="mx-auto max-w-md space-y-3">
            <Link to="/account"><Button size="lg" className="w-full font-bold">View my orders</Button></Link>
            <Link to="/"><Button variant="outline" className="w-full">Continue shopping</Button></Link>
          </div>
        </section>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <section className="container-tight py-20 text-center">
          <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-black mb-2">Nothing to checkout</h1>
          <p className="text-muted-foreground mb-6">Add items to your cart first.</p>
          <Link to="/bulk-beef"><Button>Shop Beef</Button></Link>
        </section>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <section className="container-tight py-20 text-center">
          <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h1 className="text-2xl font-black mb-2">Sign in to checkout</h1>
          <p className="text-muted-foreground mb-6">You need an account to place orders.</p>
          <Link to="/auth"><Button>Sign In / Register</Button></Link>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) { toast.error("Please accept the terms to continue"); return; }
    if (!form.name.trim() || !form.phone.trim()) { toast.error("Please fill in your name and phone"); return; }
    if (form.deliveryMethod === "delivery" && (!form.address.trim() || !form.postcode.trim())) {
      toast.error("Please fill in your address and postcode");
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase.from("orders").insert({
      user_id: user.id,
      customer_name: form.name,
      customer_phone: form.phone,
      delivery_method: form.deliveryMethod,
      address: form.address,
      postcode: form.postcode,
      preferred_date: form.preferredDate,
      preferred_time: form.preferredTime,
      notes: form.notes,
      items: items as any,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      status: "pending",
    }).select("id").single();

    if (error || !data) {
      console.error("Order save failed:", error);
      toast.error("Failed to submit order. Please try again.");
      setSubmitting(false);
      return;
    }

    // Save updated profile details for next time
    await supabase.from("profiles").update({
      full_name: form.name,
      phone: form.phone,
      address: form.address,
    }).eq("user_id", user.id);

    clearCart();
    setSubmittedOrderId(data.id);
    setSubmitting(false);
    toast.success("Order submitted — pending approval");
  };

  return (
    <Layout>
      <section className="container-tight py-10">
        <h1 className="text-3xl font-black mb-2">Checkout</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Your order will be reviewed by our team. Once approved, you'll be asked to pay a deposit before we process your order.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            {prefilled && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 flex items-start gap-2 text-sm">
                <Info size={16} className="text-primary mt-0.5 shrink-0" />
                <p>We've pre-filled your details from your account. <strong>Please double-check everything is correct</strong> before submitting.</p>
              </div>
            )}

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

            {/* Important Notices */}
            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
              <p className="font-bold flex items-center gap-2"><AlertTriangle size={16} className="text-yellow-600" /> Important — Please Read</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li><strong>Dead Weight Pricing:</strong> All meat is priced by dead weight (including trimmings). The total shown is an estimate — your exact final price will be confirmed after your order is processed.</li>
                <li><strong>Deposit Required:</strong> Once your order is approved, a deposit is required to confirm. Full payment is due once your order is processed and the exact weight/price is confirmed.</li>
                <li><strong>No Refunds / Returns:</strong> Due to the nature of fresh meat products, all sales are final once processed.</li>
                <li><strong>Order Approval:</strong> All orders are reviewed before processing. We'll contact you to confirm availability and arrange payment.</li>
              </ul>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(c) => setAcceptedTerms(c === true)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer leading-tight">
                I understand that pricing is based on dead weight, a deposit is required, and all sales are final once processed. *
              </Label>
            </div>

            <Button type="submit" size="lg" className="w-full font-bold" disabled={submitting || !acceptedTerms || !profileLoaded}>
              {submitting ? "Submitting..." : "Submit Order for Approval"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your order will be sent for review. We'll confirm availability and pricing before requesting payment.
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
                <span>Estimated Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Final price confirmed after processing</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
