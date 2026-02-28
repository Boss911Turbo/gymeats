
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  referral_code TEXT NOT NULL UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  referred_by TEXT,
  referral_credit NUMERIC NOT NULL DEFAULT 0,
  survey_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Survey responses table
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  meat_frequency TEXT,
  freezer_space TEXT,
  gym_frequency TEXT,
  fitness_description TEXT,
  meat_ranking JSONB,
  how_found_us TEXT,
  people_fed TEXT,
  subscription_interest TEXT,
  order_frequency TEXT,
  referral_likelihood TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own survey" ON public.survey_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own survey" ON public.survey_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own survey" ON public.survey_responses FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_survey_updated_at BEFORE UPDATE ON public.survey_responses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Referrals tracking table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID NOT NULL,
  referred_user_id UUID NOT NULL UNIQUE,
  referred_spent NUMERIC NOT NULL DEFAULT 0,
  reward_unlocked BOOLEAN NOT NULL DEFAULT false,
  reward_claimed_referrer BOOLEAN NOT NULL DEFAULT false,
  reward_claimed_referred BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals as referrer" ON public.referrals FOR SELECT USING (auth.uid() = referrer_user_id);
CREATE POLICY "Users can view own referral as referred" ON public.referrals FOR SELECT USING (auth.uid() = referred_user_id);

-- Function to process referral signup
CREATE OR REPLACE FUNCTION public.process_referral(referral_code_input TEXT)
RETURNS VOID AS $$
DECLARE
  referrer_id UUID;
BEGIN
  SELECT user_id INTO referrer_id FROM public.profiles WHERE referral_code = referral_code_input;
  IF referrer_id IS NOT NULL AND referrer_id != auth.uid() THEN
    UPDATE public.profiles SET referred_by = referral_code_input WHERE user_id = auth.uid();
    INSERT INTO public.referrals (referrer_user_id, referred_user_id)
    VALUES (referrer_id, auth.uid())
    ON CONFLICT (referred_user_id) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
