import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Gift, Users, Settings, ClipboardList, MessageSquare, Mail, Star, Package, RotateCcw } from "lucide-react";

interface Profile {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  referral_code: string;
  referral_credit: number;
  survey_completed: boolean;
  experience_survey_completed: boolean;
  preferred_unit: string;
  preferred_language: string;
  email_opt_in: boolean;
}

interface SurveyData {
  meat_frequency: string;
  freezer_space: string;
  gym_frequency: string;
  fitness_description: string;
  meat_ranking: string[];
  how_found_us: string;
  people_fed: string;
  subscription_interest: string;
  order_frequency: string;
  referral_likelihood: string;
}

interface ExperienceSurvey {
  quality_rating: string;
  packaging_rating: string;
  delivery_rating: string;
  value_rating: string;
  overall_rating: string;
  would_recommend: string;
  improvement_suggestions: string;
}

const SURVEY_QUESTIONS = [
  { key: "meat_frequency", question: "How often do you eat meat?", options: ["7 days a week", "6-5 days a week", "4 or less days a week"] },
  { key: "freezer_space", question: "Is freezer space an issue?", options: ["No I have room for a meat box", "Yes I would struggle with room for a meat box"] },
  { key: "gym_frequency", question: "How often do you go gym?", options: ["1-2 times a week", "3/4 times a week", "5+ times a week"] },
  { key: "fitness_description", question: "How would you describe yourself?", options: ["Getting fit", "Fairly fit", "Regular gym goer", "Athlete", "Bodybuilder"] },
  { key: "how_found_us", question: "How did you find out about us?", options: ["Friend", "Gym", "Influencer", "Other"] },
  { key: "people_fed", question: "How many people will your orders feed?", options: ["1-2", "3-5", "6-10", "10+"] },
  { key: "subscription_interest", question: "Would you like selected items delivered on a subscription basis?", options: ["Yes please", "No thank you"] },
  { key: "order_frequency", question: "How often would you like to receive orders?", options: ["Weekly", "Monthly"] },
  { key: "referral_likelihood", question: "How likely are you to refer us?", options: ["Most definitely", "Maybe", "Never"] },
];

const EXPERIENCE_QUESTIONS = [
  { key: "quality_rating", question: "How would you rate the meat quality?", options: ["Excellent", "Good", "Average", "Poor"] },
  { key: "packaging_rating", question: "How was the packaging?", options: ["Excellent", "Good", "Average", "Poor"] },
  { key: "delivery_rating", question: "How was the delivery experience?", options: ["Excellent", "Good", "Average", "Poor"] },
  { key: "value_rating", question: "How do you rate the value for money?", options: ["Excellent", "Good", "Average", "Poor"] },
  { key: "overall_rating", question: "Overall experience?", options: ["Excellent", "Good", "Average", "Poor"] },
  { key: "would_recommend", question: "Would you recommend us?", options: ["Definitely", "Probably", "Not sure", "No"] },
];

const MEAT_TYPES = ["Beef", "Lamb", "Mutton", "Chicken", "Egg"];

type Tab = "profile" | "settings" | "referrals" | "surveys" | "feedback";

const Account = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "", address: "" });
  const [survey, setSurvey] = useState<SurveyData>({
    meat_frequency: "", freezer_space: "", gym_frequency: "", fitness_description: "",
    meat_ranking: [], how_found_us: "", people_fed: "", subscription_interest: "",
    order_frequency: "", referral_likelihood: "",
  });
  const [expSurvey, setExpSurvey] = useState<ExperienceSurvey>({
    quality_rating: "", packaging_rating: "", delivery_rating: "", value_rating: "",
    overall_rating: "", would_recommend: "", improvement_suggestions: "",
  });
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [expSurveySubmitted, setExpSurveySubmitted] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackList, setFeedbackList] = useState<{ id: string; message: string; created_at: string }[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    loadProfile();
    loadSurvey();
    loadExpSurvey();
    loadReferrals();
    loadFeedback();
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
    if (data) {
      setProfile(data as unknown as Profile);
      setEditForm({ full_name: data.full_name, phone: data.phone, address: data.address });
    }
  };

  const loadSurvey = async () => {
    const { data } = await supabase.from("survey_responses").select("*").eq("user_id", user!.id).single();
    if (data) {
      setSurvey({ ...data, meat_ranking: (data.meat_ranking as string[]) || [] } as unknown as SurveyData);
      setSurveySubmitted(true);
    }
  };

  const loadExpSurvey = async () => {
    const { data } = await supabase.from("experience_surveys").select("*").eq("user_id", user!.id).single();
    if (data) {
      setExpSurvey(data as unknown as ExperienceSurvey);
      setExpSurveySubmitted(true);
    }
  };

  const loadReferrals = async () => {
    const { data } = await supabase.from("referrals").select("id").eq("referrer_user_id", user!.id);
    setReferralCount(data?.length || 0);
  };

  const loadFeedback = async () => {
    const { data } = await supabase.from("feedback").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    if (data) setFeedbackList(data as any);
  };

  const saveProfile = async () => {
    await supabase.from("profiles").update(editForm).eq("user_id", user!.id);
    toast.success("Profile updated!");
    setEditing(false);
    loadProfile();
  };

  const updateSetting = async (key: string, value: any) => {
    await supabase.from("profiles").update({ [key]: value }).eq("user_id", user!.id);
    setProfile(prev => prev ? { ...prev, [key]: value } : prev);
    toast.success("Setting updated!");
  };

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      toast.success("Referral code copied!");
    }
  };

  const toggleMeatRanking = (meat: string) => {
    setSurvey(prev => {
      const ranking = [...prev.meat_ranking];
      const idx = ranking.indexOf(meat);
      if (idx >= 0) ranking.splice(idx, 1);
      else ranking.push(meat);
      return { ...prev, meat_ranking: ranking };
    });
  };

  const handleSurveySubmit = async () => {
    const missing = SURVEY_QUESTIONS.filter(q => !survey[q.key as keyof SurveyData]);
    if (missing.length > 0 || survey.meat_ranking.length < MEAT_TYPES.length) {
      toast.error("Please answer all questions and rank all meat types");
      return;
    }
    const { error } = await supabase.from("survey_responses").upsert({
      user_id: user!.id, ...survey, meat_ranking: survey.meat_ranking,
    }, { onConflict: "user_id" });
    if (error) { toast.error("Failed to save survey"); return; }
    await supabase.from("profiles").update({ survey_completed: true }).eq("user_id", user!.id);
    toast.success("Lifestyle survey saved!");
    setSurveySubmitted(true);
    loadProfile();
  };

  const handleExpSurveySubmit = async () => {
    const missing = EXPERIENCE_QUESTIONS.filter(q => !expSurvey[q.key as keyof ExperienceSurvey]);
    if (missing.length > 0) { toast.error("Please answer all questions"); return; }
    const { error } = await supabase.from("experience_surveys").upsert({
      user_id: user!.id, ...expSurvey,
    }, { onConflict: "user_id" });
    if (error) { toast.error("Failed to save survey"); return; }
    await supabase.from("profiles").update({ experience_survey_completed: true }).eq("user_id", user!.id);
    toast.success("Experience survey saved!");
    setExpSurveySubmitted(true);
    loadProfile();
  };

  const bothSurveysComplete = profile?.survey_completed && profile?.experience_survey_completed;

  const handleFeedbackSubmit = async () => {
    if (!feedbackMsg.trim()) { toast.error("Please write your feedback"); return; }
    const { error } = await supabase.from("feedback").insert({ user_id: user!.id, message: feedbackMsg.trim() });
    if (error) { toast.error("Failed to submit feedback"); return; }
    toast.success("Feedback submitted — thank you!");
    setFeedbackMsg("");
    loadFeedback();
  };

  if (authLoading || !profile) {
    return <Layout><div className="container-tight py-20 text-center text-muted-foreground">Loading...</div></Layout>;
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <Users size={16} /> },
    { id: "settings", label: "Settings", icon: <Settings size={16} /> },
    { id: "referrals", label: "Referrals", icon: <Gift size={16} /> },
    { id: "surveys", label: "Surveys", icon: <ClipboardList size={16} /> },
    { id: "feedback", label: "Feedback", icon: <MessageSquare size={16} /> },
  ];

  return (
    <Layout>
      <section className="container-tight py-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black">My Account</h1>
          <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>Sign Out</Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ===== PROFILE TAB ===== */}
        {tab === "profile" && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Profile Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</Button>
            </div>
            {editing ? (
              <div className="space-y-3">
                <div><label className="text-sm font-semibold block mb-1">Full Name</label><Input value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} /></div>
                <div><label className="text-sm font-semibold block mb-1">Phone</label><Input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} /></div>
                <div><label className="text-sm font-semibold block mb-1">Delivery Address</label><Input value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} /></div>
                <Button onClick={saveProfile} className="bg-accent text-accent-foreground hover:bg-accent/90">Save</Button>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Name:</span> {profile.full_name || "Not set"}</p>
                <p><span className="font-semibold">Email:</span> {profile.email}</p>
                <p><span className="font-semibold">Phone:</span> {profile.phone || "Not set"}</p>
                <p><span className="font-semibold">Address:</span> {profile.address || "Not set"}</p>
              </div>
            )}
          </div>
        )}

        {/* ===== SETTINGS TAB ===== */}
        {tab === "settings" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Account Settings</h2>
              <div className="space-y-5">
                {/* Language */}
                <div>
                  <label className="text-sm font-semibold block mb-2">Language</label>
                  <div className="flex gap-2">
                    {["en", "ur", "ar"].map(lang => (
                      <button key={lang} onClick={() => updateSetting("preferred_language", lang)}
                        className={`px-4 py-2 rounded-md text-sm border transition-colors ${profile.preferred_language === lang ? "bg-accent text-accent-foreground border-accent" : "bg-background border-border hover:border-accent/50"}`}>
                        {lang === "en" ? "English" : lang === "ur" ? "Urdu" : "Arabic"}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Unit */}
                <div>
                  <label className="text-sm font-semibold block mb-2">Unit of Measurement</label>
                  <div className="flex gap-2">
                    {["kg", "lbs"].map(unit => (
                      <button key={unit} onClick={() => updateSetting("preferred_unit", unit)}
                        className={`px-4 py-2 rounded-md text-sm border transition-colors ${profile.preferred_unit === unit ? "bg-accent text-accent-foreground border-accent" : "bg-background border-border hover:border-accent/50"}`}>
                        {unit.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Email opt-in */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={profile.email_opt_in} onChange={e => updateSetting("email_opt_in", e.target.checked)} className="accent-accent w-5 h-5" />
                    <div>
                      <span className="text-sm font-semibold flex items-center gap-1"><Mail size={14} /> Email Updates</span>
                      <span className="text-xs text-muted-foreground block">Receive updates about new deals, weekly drops, and discounts</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== REFERRALS TAB ===== */}
        {tab === "referrals" && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4"><Gift size={20} className="text-accent" /><h2 className="text-lg font-bold">Invite Friends — Get Up to £50 Off</h2></div>
            <p className="text-sm text-muted-foreground mb-4">
              Share your code with friends. When <strong>5 friends</strong> each spend over <strong>£50</strong>, you <em>both</em> get <strong>up to £50 off</strong> your next order! Credit is applied in £10 increments per qualifying referral.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-muted rounded px-4 py-2 font-mono font-bold text-lg tracking-wider">{profile.referral_code}</div>
              <Button variant="outline" size="sm" onClick={copyReferralCode}><Copy size={14} /> Copy</Button>
            </div>
            <div className="flex gap-6 text-sm mb-4">
              <p><span className="font-semibold">{referralCount}/5</span> friends referred</p>
              <p><span className="font-semibold">£{profile.referral_credit.toFixed(2)}</span> credit earned</p>
            </div>
            {/* Progress */}
            <div className="w-full bg-muted rounded-full h-3 mb-2">
              <div className="bg-accent h-3 rounded-full transition-all" style={{ width: `${Math.min(100, (referralCount / 5) * 100)}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{Math.max(0, 5 - referralCount)} more referrals to unlock the full £50 reward!</p>
          </div>
        )}

        {/* ===== SURVEYS TAB ===== */}
        {tab === "surveys" && (
          <div className="space-y-6">
            {/* Discount coupon banner */}
            {bothSurveysComplete ? (
              <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-4 text-center">
                <Star size={24} className="mx-auto text-accent mb-2" />
                <p className="font-bold text-accent">🎉 Both surveys complete! You've earned a £10 discount coupon.</p>
                <p className="text-xs text-muted-foreground mt-1">Applied automatically to your next order.</p>
              </div>
            ) : (
              <div className="bg-muted border border-border rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Complete <strong>both</strong> surveys below to earn a <strong>£10 discount coupon</strong>!</p>
              </div>
            )}

            {/* Lifestyle Survey */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-1">Lifestyle Survey {surveySubmitted && "✅"}</h2>
              <p className="text-xs text-muted-foreground mb-4">{surveySubmitted ? "You can edit your answers anytime." : "Tell us about yourself so we can recommend the best boxes."}</p>
              <div className="space-y-5">
                {SURVEY_QUESTIONS.map(q => (
                  <div key={q.key}>
                    <p className="font-semibold text-sm mb-2">{q.question}</p>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map(opt => (
                        <button key={opt} onClick={() => setSurvey(prev => ({ ...prev, [q.key]: opt }))}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${survey[q.key as keyof SurveyData] === opt ? "bg-accent text-accent-foreground border-accent" : "bg-background border-border hover:border-accent/50"}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <p className="font-semibold text-sm mb-2">Rank these as most used (tap in order)</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {MEAT_TYPES.map(meat => {
                      const rank = survey.meat_ranking.indexOf(meat);
                      return (
                        <button key={meat} onClick={() => toggleMeatRanking(meat)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${rank >= 0 ? "bg-accent text-accent-foreground border-accent" : "bg-background border-border hover:border-accent/50"}`}>
                          {rank >= 0 && <span className="font-bold mr-1">#{rank + 1}</span>}{meat}
                        </button>
                      );
                    })}
                  </div>
                  {survey.meat_ranking.length > 0 && <p className="text-xs text-muted-foreground">Order: {survey.meat_ranking.join(" → ")}</p>}
                </div>
                <Button onClick={handleSurveySubmit} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                  {surveySubmitted ? "Update Lifestyle Survey" : "Submit Lifestyle Survey"}
                </Button>
              </div>
            </div>

            {/* Experience Survey */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-1">Customer Experience Survey {expSurveySubmitted && "✅"}</h2>
              <p className="text-xs text-muted-foreground mb-4">{expSurveySubmitted ? "You can update your ratings anytime." : "Rate your experience with us."}</p>
              <div className="space-y-5">
                {EXPERIENCE_QUESTIONS.map(q => (
                  <div key={q.key}>
                    <p className="font-semibold text-sm mb-2">{q.question}</p>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map(opt => (
                        <button key={opt} onClick={() => setExpSurvey(prev => ({ ...prev, [q.key]: opt }))}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${expSurvey[q.key as keyof ExperienceSurvey] === opt ? "bg-accent text-accent-foreground border-accent" : "bg-background border-border hover:border-accent/50"}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <p className="font-semibold text-sm mb-2">Any suggestions for improvement?</p>
                  <textarea className="w-full border border-input bg-background rounded px-3 py-2 text-sm resize-none" rows={3}
                    value={expSurvey.improvement_suggestions} onChange={e => setExpSurvey(prev => ({ ...prev, improvement_suggestions: e.target.value }))}
                    placeholder="Tell us how we can improve..." />
                </div>
                <Button onClick={handleExpSurveySubmit} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                  {expSurveySubmitted ? "Update Experience Survey" : "Submit Experience Survey"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ===== FEEDBACK TAB ===== */}
        {tab === "feedback" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4"><MessageSquare size={20} className="text-accent" /><h2 className="text-lg font-bold">Help Us Improve</h2></div>
              <p className="text-sm text-muted-foreground mb-4">We'd love to hear about your experience. Your feedback helps us get better every day.</p>
              <textarea className="w-full border border-input bg-background rounded px-3 py-2 text-sm resize-none mb-3" rows={4}
                value={feedbackMsg} onChange={e => setFeedbackMsg(e.target.value)} placeholder="Share your thoughts, suggestions, or concerns..." />
              <Button onClick={handleFeedbackSubmit} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold">Submit Feedback</Button>
            </div>
            {feedbackList.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold mb-3">Your Previous Feedback</h3>
                <div className="space-y-3">
                  {feedbackList.map(fb => (
                    <div key={fb.id} className="border border-border rounded p-3">
                      <p className="text-sm">{fb.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(fb.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Account;
