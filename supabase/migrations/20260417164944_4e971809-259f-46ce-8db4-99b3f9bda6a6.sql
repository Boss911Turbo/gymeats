DROP POLICY IF EXISTS "Anyone can submit contact requests" ON public.contact_requests;

CREATE POLICY "Anyone can submit contact requests"
ON public.contact_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(coalesce(name, ''))) >= 2
  AND position('@' in coalesce(email, '')) > 1
  AND length(btrim(coalesce(message, ''))) >= 5
);