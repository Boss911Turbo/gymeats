
-- Add account_name columns
ALTER TABLE public.survey_responses ADD COLUMN IF NOT EXISTS account_name text DEFAULT '';
ALTER TABLE public.experience_surveys ADD COLUMN IF NOT EXISTS account_name text DEFAULT '';

-- Backfill from profiles
UPDATE public.survey_responses sr
SET account_name = COALESCE(NULLIF(p.full_name, ''), p.email, '')
FROM public.profiles p
WHERE p.user_id = sr.user_id AND (sr.account_name IS NULL OR sr.account_name = '');

UPDATE public.experience_surveys es
SET account_name = COALESCE(NULLIF(p.full_name, ''), p.email, '')
FROM public.profiles p
WHERE p.user_id = es.user_id AND (es.account_name IS NULL OR es.account_name = '');

-- Auto-fill trigger function
CREATE OR REPLACE FUNCTION public.set_survey_account_name()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.account_name IS NULL OR NEW.account_name = '' THEN
    SELECT COALESCE(NULLIF(full_name, ''), email, '')
    INTO NEW.account_name
    FROM public.profiles
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_survey_account_name ON public.survey_responses;
CREATE TRIGGER trg_set_survey_account_name
  BEFORE INSERT ON public.survey_responses
  FOR EACH ROW EXECUTE FUNCTION public.set_survey_account_name();

DROP TRIGGER IF EXISTS trg_set_experience_account_name ON public.experience_surveys;
CREATE TRIGGER trg_set_experience_account_name
  BEFORE INSERT ON public.experience_surveys
  FOR EACH ROW EXECUTE FUNCTION public.set_survey_account_name();

-- Admin can view all surveys
CREATE POLICY "Admins can view all survey responses"
  ON public.survey_responses FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all experience surveys"
  ON public.experience_surveys FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
