
CREATE TABLE public.batch_drops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  week_start date NOT NULL DEFAULT (date_trunc('week', now()))::date,
  order_count integer NOT NULL DEFAULT 0,
  target integer NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, week_start)
);

ALTER TABLE public.batch_drops ENABLE ROW LEVEL SECURITY;

-- Anyone can view batch progress
CREATE POLICY "Anyone can view batch drops"
ON public.batch_drops FOR SELECT
USING (true);

-- Function to increment batch count (resets when target hit)
CREATE OR REPLACE FUNCTION public.increment_batch_order(p_product_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_week date := (date_trunc('week', now()))::date;
BEGIN
  INSERT INTO public.batch_drops (product_id, week_start, order_count)
  VALUES (p_product_id, current_week, 1)
  ON CONFLICT (product_id, week_start)
  DO UPDATE SET order_count =
    CASE
      WHEN batch_drops.order_count >= batch_drops.target THEN 1
      ELSE batch_drops.order_count + 1
    END;
END;
$$;
