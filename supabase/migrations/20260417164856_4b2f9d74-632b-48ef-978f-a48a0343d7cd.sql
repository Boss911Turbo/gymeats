CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'orders_status_allowed'
      AND conrelid = 'public.orders'::regclass
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_status_allowed
      CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.order_status_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  changed_by TEXT,
  source TEXT
);

CREATE TABLE IF NOT EXISTS public.order_action_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  used_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_status_logs_order_id ON public.order_status_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_logs_changed_at ON public.order_status_logs(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_action_tokens_order_id ON public.order_action_tokens(order_id);
CREATE INDEX IF NOT EXISTS idx_order_action_tokens_expires_at ON public.order_action_tokens(expires_at);

ALTER TABLE public.order_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_action_tokens ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'order_status_logs' AND policyname = 'Admins can view order status logs'
  ) THEN
    CREATE POLICY "Admins can view order status logs"
    ON public.order_status_logs
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'order_status_logs' AND policyname = 'Admins can create order status logs'
  ) THEN
    CREATE POLICY "Admins can create order status logs"
    ON public.order_status_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'order_action_tokens' AND policyname = 'Admins can view order action tokens'
  ) THEN
    CREATE POLICY "Admins can view order action tokens"
    ON public.order_action_tokens
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.validate_order_action_token()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.action NOT IN ('approve', 'reject') THEN
    RAISE EXCEPTION 'Invalid order action';
  END IF;

  IF NEW.expires_at <= now() THEN
    RAISE EXCEPTION 'Order action token must expire in the future';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_order_action_tokens_before_write ON public.order_action_tokens;
CREATE TRIGGER validate_order_action_tokens_before_write
BEFORE INSERT OR UPDATE ON public.order_action_tokens
FOR EACH ROW
EXECUTE FUNCTION public.validate_order_action_token();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'order_status_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_logs;
  END IF;
END $$;