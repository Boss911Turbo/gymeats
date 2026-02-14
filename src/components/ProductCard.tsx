import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    product.options?.forEach(opt => {
      defaults[opt.label] = opt.default || opt.choices[0];
    });
    return defaults;
  });
  const [targetWeight, setTargetWeight] = useState(product.weightRange?.avg || 0);
  const [notes, setNotes] = useState("");
  const [kgAmount, setKgAmount] = useState(1);

  if (product.contactOnly) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg">{product.name}</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4 flex-1">{product.description}</p>
        <Link to="/contact">
          <Button variant="outline" className="w-full">Available on request</Button>
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    const isPerKg = product.type === "per-kg";
    const qty = isPerKg ? kgAmount : quantity;
    addItem({
      productId: product.id,
      productName: product.name,
      quantity: qty,
      price: product.price,
      selectedOptions,
      targetWeight: product.weightRange ? targetWeight : undefined,
      notes: notes || undefined,
      unitLabel: product.unitLabel || (isPerKg ? "kg" : undefined),
    });
    toast.success(`${product.name} added to cart`);
    setNotes("");
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-lg">{product.name}</h3>
        {product.badge && (
          <span className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded">
            {product.badge}
          </span>
        )}
      </div>

      <p className="text-accent font-bold text-lg mb-2">
        £{product.price.toFixed(2)}{" "}
        <span className="text-muted-foreground text-sm font-normal">{product.priceLabel}</span>
      </p>
      <p className="text-xs text-muted-foreground italic mb-2">Placeholder price — will be updated</p>

      <p className="text-muted-foreground text-sm mb-4">{product.description}</p>

      {product.note && (
        <div className="bg-warning/10 text-warning-foreground border border-warning/20 rounded px-3 py-2 text-xs mb-4">
          ⚠️ {product.note}
        </div>
      )}

      {product.components && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2 flex items-center gap-1">
            <Package size={14} /> Box Contents:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {product.components.map(c => (
              <li key={c.name}>• <span className="font-medium text-foreground">{c.name}</span>: {c.detail}</li>
            ))}
          </ul>
        </div>
      )}

      {product.details && (
        <ul className="text-xs text-muted-foreground space-y-1 mb-4">
          {product.details.map((d, i) => <li key={i}>• {d}</li>)}
        </ul>
      )}

      {product.weightRange && (
        <div className="mb-4">
          <label className="text-xs font-semibold block mb-1">
            Target Weight: {targetWeight}{product.weightRange.unit}
          </label>
          <input
            type="range"
            min={product.weightRange.min}
            max={product.weightRange.max}
            value={targetWeight}
            onChange={e => setTargetWeight(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{product.weightRange.min}{product.weightRange.unit}</span>
            <span>{product.weightRange.max}{product.weightRange.unit}</span>
          </div>
        </div>
      )}

      {product.options?.map(opt => (
        <div key={opt.label} className="mb-3">
          <label className="text-xs font-semibold block mb-1">{opt.label}</label>
          <select
            className="w-full border border-input bg-background rounded px-3 py-2 text-sm"
            value={selectedOptions[opt.label]}
            onChange={e => setSelectedOptions(prev => ({ ...prev, [opt.label]: e.target.value }))}
          >
            {opt.choices.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      ))}

      {product.type === "per-kg" && (
        <div className="mb-3">
          <label className="text-xs font-semibold block mb-1">Amount (kg)</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setKgAmount(Math.max(1, kgAmount - 1))} className="border border-input rounded p-1 hover:bg-muted"><Minus size={16} /></button>
            <input
              type="number"
              min={1}
              value={kgAmount}
              onChange={e => setKgAmount(Math.max(1, Number(e.target.value)))}
              className="w-20 border border-input bg-background rounded px-3 py-2 text-sm text-center"
            />
            <button onClick={() => setKgAmount(kgAmount + 1)} className="border border-input rounded p-1 hover:bg-muted"><Plus size={16} /></button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="text-xs font-semibold block mb-1">Cutting & Packing Notes (optional)</label>
        <textarea
          className="w-full border border-input bg-background rounded px-3 py-2 text-sm resize-none"
          rows={2}
          placeholder="Any special requests..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 mt-auto">
        {product.type !== "per-kg" && (
          <div className="flex items-center gap-2">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="border border-input rounded p-1 hover:bg-muted"><Minus size={16} /></button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="border border-input rounded p-1 hover:bg-muted"><Plus size={16} /></button>
          </div>
        )}
        <Button onClick={handleAdd} className="flex-1 gap-2">
          <ShoppingCart size={16} /> Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
