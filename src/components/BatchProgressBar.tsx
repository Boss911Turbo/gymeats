import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface BatchProgressBarProps {
  productId: string;
}

const BatchProgressBar = ({ productId }: BatchProgressBarProps) => {
  const [orderCount, setOrderCount] = useState(0);
  const [target, setTarget] = useState(10);

  useEffect(() => {
    const fetchBatch = async () => {
      const weekStart = getWeekStart();
      const { data } = await supabase
        .from("batch_drops")
        .select("order_count, target")
        .eq("product_id", productId)
        .eq("week_start", weekStart)
        .maybeSingle();

      if (data) {
        setOrderCount(data.order_count);
        setTarget(data.target);
      }
    };

    fetchBatch();

    // Realtime subscription
    const channel = supabase
      .channel(`batch-${productId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "batch_drops", filter: `product_id=eq.${productId}` },
        (payload: any) => {
          if (payload.new) {
            setOrderCount(payload.new.order_count);
            setTarget(payload.new.target);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [productId]);

  const remaining = Math.max(0, target - orderCount);
  const pct = Math.min(100, (orderCount / target) * 100);

  return (
    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
      <p className="text-xs font-bold text-accent mb-1">🔥 Weekly Drop — Batch unlocks at {target} orders</p>
      <Progress value={pct} className="h-3 mb-2" />
      <p className="text-xs text-muted-foreground font-semibold">
        {orderCount}/{target} sold — {remaining > 0 ? `${remaining} left to unlock` : "✅ Batch unlocked!"}
      </p>
    </div>
  );
};

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

export default BatchProgressBar;
