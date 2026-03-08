
-- Feedback table for "Help Us Improve"
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback" ON public.feedback
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback" ON public.feedback
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Add experience_survey_completed to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_survey_completed BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_opt_in BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_unit TEXT NOT NULL DEFAULT 'kg';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT NOT NULL DEFAULT 'en';

-- Experience survey table
CREATE TABLE public.experience_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  overall_rating TEXT,
  delivery_rating TEXT,
  quality_rating TEXT,
  packaging_rating TEXT,
  value_rating TEXT,
  would_recommend TEXT,
  improvement_suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.experience_surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own experience survey" ON public.experience_surveys
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experience survey" ON public.experience_surveys
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view own experience survey" ON public.experience_surveys
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
