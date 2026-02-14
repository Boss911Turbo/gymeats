import Layout from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

const CartPage = () => {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <section className="container-tight py-20 text-center">
          <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-black mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to get started.</p>
          <Link to="/bulk-beef">
            <Button>Shop Beef</Button>
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-tight py-10">
        <h1 className="text-3xl font-black mb-6">Your Cart ({totalItems} items)</h1>

        <div className="space-y-4 mb-8">
          {items.map((item, index) => (
            <div key={index} className="border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-bold">{item.productName}</h3>
                <p className="text-sm text-muted-foreground">
                  £{item.price.toFixed(2)} {item.unitLabel ? `per ${item.unitLabel}` : "each"}
                </p>
                {item.targetWeight && (
                  <p className="text-xs text-muted-foreground">Target weight: {item.targetWeight}kg</p>
                )}
                {Object.entries(item.selectedOptions).length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                  </p>
                )}
                {item.notes && <p className="text-xs text-muted-foreground italic">Notes: {item.notes}</p>}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(index, item.quantity - 1)} className="border border-input rounded p-1 hover:bg-muted"><Minus size={14} /></button>
                  <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(index, item.quantity + 1)} className="border border-input rounded p-1 hover:bg-muted"><Plus size={14} /></button>
                </div>
                <span className="font-bold w-20 text-right">£{(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeItem(index)} className="text-destructive hover:text-destructive/80 p-1">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold">Subtotal: £{subtotal.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Delivery fee calculated at checkout</p>
          </div>
          <Link to="/checkout">
            <Button size="lg" className="w-full sm:w-auto font-bold">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default CartPage;
