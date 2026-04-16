import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Package, Store, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BatchProgressBar from "./BatchProgressBar";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [boxSize, setBoxSize] = useState<"full" | "half">("full");
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

  const isHalf = boxSize === "half" && product.halfBoxAvailable;
  
  // Dynamic price calculation based on weight
  const effectivePricePerKg = isHalf
    ? (product.halfBoxPricePerKg || product.pricePerKg || 0)
    : (product.pricePerKg || 0);
  
  const hasWeightPricing = !!product.pricePerKg && !!product.weightRange;
  const displayPrice = hasWeightPricing
    ? effectivePricePerKg * targetWeight
    : isHalf ? (product.halfBoxPrice || product.price / 2) : product.price;

  const displayWeight = product.weightRange
    ? isHalf
      ? { min: Math.round(product.weightRange.min / 2), max: Math.round(product.weightRange.max / 2), avg: Math.round(product.weightRange.avg / 2), unit: product.weightRange.unit }
      : product.weightRange
    : undefined;

  // Use half box components if available, otherwise fall back
  const displayComponents = isHalf
    ? (product.halfBoxComponents || product.components)
    : product.components;

  // contactOnly products now use the normal card flow

  const handleAdd = () => {
    const isPerKg = product.type === "per-kg";
    const qty = isPerKg ? kgAmount : quantity;
    const itemName = isHalf ? `${product.name} (Half Box)` : product.name;
    addItem({
      productId: product.id,
      productName: itemName,
      quantity: qty,
      price: displayPrice,
      selectedOptions,
      targetWeight: displayWeight ? targetWeight : undefined,
      notes: notes || undefined,
      unitLabel: product.unitLabel || (isPerKg ? "kg" : undefined),
    });
    toast.success(`${itemName} added to cart`);
    setNotes("");
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col relative">
      {/* Product image */}
      {product.image && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
      {/* Badge + name */}
      <div className="mb-1">
        <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
        <div className="flex gap-1 flex-wrap">
          {product.comingSoon && (
            <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
              Coming Soon
            </span>
          )}
          {product.badge && (
            <span className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
              {product.badge}
            </span>
          )}
        </div>
      </div>

      {/* Recommended for */}
      {product.recommendedFor && product.recommendedFor.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {product.recommendedFor.map(r => (
            <span key={r} className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <Store size={10} /> {r}
            </span>
          ))}
        </div>
      )}

      {/* Half / Full toggle */}
      {product.halfBoxAvailable && (
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setBoxSize("half")}
            className={`flex-1 text-sm font-semibold py-2 rounded border transition-colors ${boxSize === "half" ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-muted"}`}
          >
            Half Box
          </button>
          <button
            onClick={() => setBoxSize("full")}
            className={`flex-1 text-sm font-semibold py-2 rounded border transition-colors ${boxSize === "full" ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-muted"}`}
          >
            Full Box
          </button>
        </div>
      )}

      {/* Price */}
      <div className="mb-3">
        <p className="text-accent font-bold text-xl">
          ~£{displayPrice.toFixed(2)}{" "}
          <span className="text-muted-foreground text-sm font-normal">
            {hasWeightPricing ? `(£${effectivePricePerKg.toFixed(2)}/kg)` : isHalf ? "half box" : product.priceLabel}
          </span>
        </p>
        {hasWeightPricing && (
          <p className="text-xs text-muted-foreground italic">Approx. price — final price based on actual weight</p>
        )}
        {!hasWeightPricing && product.type === "per-kg" && product.competitorPricePerKg && (
          <p className="text-xs text-muted-foreground italic">Approx. price — final price based on actual weight</p>
        )}
        
        {/* Competitor price comparison */}
        {product.competitorPricePerKg && (
          <div className="mt-2 bg-accent/10 border border-accent/20 rounded px-3 py-2">
            <p className="text-xs font-semibold text-accent">
              💰 High street retailer price: <span className="line-through text-muted-foreground">£{product.competitorPricePerKg.toFixed(2)}/kg</span>
              {" → "}You pay: <span className="font-bold">£{(product.pricePerKg || product.price).toFixed(2)}/kg</span>
            </p>
            <p className="text-xs font-bold text-accent mt-0.5">
              You save ~£{(
                hasWeightPricing
                  ? (product.competitorPricePerKg - effectivePricePerKg) * targetWeight
                  : product.type === "per-kg"
                    ? (product.competitorPricePerKg - product.price) * kgAmount
                    : 0
              ).toFixed(2)}{" "}
              {hasWeightPricing
                ? `on ${targetWeight}${displayWeight?.unit || "kg"}`
                : product.type === "per-kg"
                  ? `per ${kgAmount}kg`
                  : "vs competitors"}
              {" "}
              ({Math.round(((product.competitorPricePerKg - (product.pricePerKg || product.price)) / product.competitorPricePerKg) * 100)}% cheaper)
            </p>
          </div>
        )}
      </div>

      {/* Deposit info */}
      {product.depositAmount && (
        <div className="bg-warning/10 text-warning-foreground border border-warning/20 rounded px-3 py-2 text-xs mb-3 flex items-start gap-2">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>
            💳 <span className="font-bold">£{product.depositAmount} deposit</span> required —{" "}
            {product.depositRefundable ? "fully refundable if batch doesn't fill" : "non-refundable"}
          </span>
        </div>
      )}

      <p className="text-muted-foreground text-sm mb-4">{product.description}</p>

      {/* Weekly drop batch bar */}
      {product.weeklyDrop && <BatchProgressBar productId={product.id} />}

      {product.note && (
        <div className="bg-warning/10 text-warning-foreground border border-warning/20 rounded px-3 py-2 text-xs mb-4">
          ⚠️ {product.note}
        </div>
      )}

      {displayComponents && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2 flex items-center gap-1">
            <Package size={14} /> {isHalf ? "Half Box Contents (approx.):" : "Box Contents:"}
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {displayComponents.map(c => (
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

      {displayWeight && (
        <div className="mb-4">
          <label className="text-xs font-semibold block mb-1">
            Target Weight: {targetWeight}{displayWeight.unit}
          </label>
          <input
            type="range"
            min={displayWeight.min}
            max={displayWeight.max}
            value={Math.min(targetWeight, displayWeight.max)}
            onChange={e => setTargetWeight(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{displayWeight.min}{displayWeight.unit}</span>
            <span>{displayWeight.max}{displayWeight.unit}</span>
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
        {product.comingSoon ? (
          <Link to="/contact" className="flex-1">
            <Button variant="outline" className="w-full gap-2">Available on Request</Button>
          </Link>
        ) : (
          <Button onClick={handleAdd} className="flex-1 gap-2">
            <ShoppingCart size={16} /> Add to Cart
          </Button>
        )}
      </div>
      </div>
    </div>
  );
};

export default ProductCard;
