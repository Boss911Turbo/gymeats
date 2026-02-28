import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Gift, Users } from "lucide-react";

interface Profile {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  referral_code: string;
  referral_credit: number;
  survey_completed: boolean;
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

const SURVEY_QUESTIONS = [
  {
    key: "meat_frequency",
    question: "How often do you eat meat?",
    options: ["7 days a week", "6-5 days a week", "4 or less days a week"],
  },
  {
    key: "freezer_space",
    question: "Is freezer space an issue?",
    options: ["No I have room for a meat box", "Yes I would struggle with room for a meat box"],
  },
  {
    key: "gym_frequency",
    question: "How often do you go gym?",
    options: ["1-2 times a week", "3/4 times a week", "5+ times a week"],
  },
  {
    key: "fitness_description",
    question: "How would you describe yourself?",
    options: ["Getting fit", "Fairly fit", "Regular gym goer", "Athlete", "Bodybuilder"],
  },
  {
    key: "how_found_us",
    question: "How did you find out about us?",
    options: ["Friend", "Gym", "Influencer", "Other"],
  },
  {
    key: "people_fed",
    question: "How many people will your orders feed?",
    options: ["1-2", "3-5", "6-10", "10+"],
  },
  {
    key: "subscription_interest",
    question: "Would you like selected items delivered on a subscription basis?",
    options: ["Yes please", "No thank you"],
  },
  {
    key: "order_frequency",
    question: "How often would you like to receive orders?",
    options: ["Weekly", "Monthly"],
  },
  {
    key: "referral_likelihood",
    question: "How likely are you to refer us?",
    options: ["Most definitely", "Maybe", "Never"],
  },
];

const MEAT_TYPES = ["Beef", "Lamb", "Sheep", "Chicken", "Egg"];

const Account = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "", address: "" });
  const [survey, setSurvey] = useState<SurveyData>({
    meat_frequency: "", freezer_space: "", gym_frequency: "", fitness_description: "",
    meat_ranking: [], how_found_us: "", people_fed: "", subscription_interest: "",
    order_frequency: "", referral_likelihood: "",
  });
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    loadProfile();
    loadSurvey();
    loadReferrals();
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
      setSurvey({
        ...data,
        meat_ranking: (data.meat_ranking as string[]) || [],
      } as unknown as SurveyData);
      setSurveySubmitted(true);
    }
  };

  const loadReferrals = async () => {
    const { data } = await supabase.from("referrals").select("id").eq("referrer_user_id", user!.id);
    setReferralCount(data?.length || 0);
  };

  const saveProfile = async () => {
    await supabase.from("profiles").update(editForm).eq("user_id", user!.id);
    toast.success("Profile updated!");
    setEditing(false);
    loadProfile();
  };

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      toast.success("Referral code copied!");
    }
  };

  const handleSurveySubmit = async () => {
    const missingFields = SURVEY_QUESTIONS.filter(q => !survey[q.key as keyof SurveyData] || (Array.isArray(survey[q.key as keyof SurveyData]) && (survey[q.key as keyof SurveyData] as string[]).length === 0));
    if (missingFields.length > 0 || survey.meat_ranking.length < MEAT_TYPES.length) {
      toast.error("Please answer all questions and rank all meat types");
      return;
    }

    const { error } = await supabase.from("survey_responses").upsert({
      user_id: user!.id,
      ...survey,
      meat_ranking: survey.meat_ranking,
    }, { onConflict: "user_id" });

    if (error) {
      toast.error("Failed to save survey");
      return;
    }

    await supabase.from("profiles").update({ survey_completed: true }).eq("user_id", user!.id);
    toast.success("Survey completed! You'll receive a free gift in your next delivery 🎁");
    setSurveySubmitted(true);
    loadProfile();
  };

  const toggleMeatRanking = (meat: string) => {
    setSurvey(prev => {
      const ranking = [...prev.meat_ranking];
      const idx = ranking.indexOf(meat);
      if (idx >= 0) {
        ranking.splice(idx, 1);
      } else {
        ranking.push(meat);
      }
      return { ...prev, meat_ranking: ranking };
    });
  };

  if (authLoading || !profile) {
    return <Layout><div className="container-tight py-20 text-center text-muted-foreground">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <section className="container-tight py-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black">My Account</h1>
          <Button variant="outline" onClick={async () => { await signOut(); navigate("/"); }}>
            Sign Out
          </Button>
        </div>

        {/* Profile Section */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Profile Details</h2>
            <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit"}
            </Button>
          </div>
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold block mb-1">Full Name</label>
                <Input value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Phone</label>
                <Input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Delivery Address</label>
                <Input value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} />
              </div>
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

        {/* Referral Section */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-accent" />
            <h2 className="text-lg font-bold">Refer a Friend</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Share your code with friends. When they spend £50, you both get <strong>£10 off</strong> your next order!
          </p>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-muted rounded px-4 py-2 font-mono font-bold text-lg tracking-wider">
              {profile.referral_code}
            </div>
            <Button variant="outline" size="sm" onClick={copyReferralCode}>
              <Copy size={14} /> Copy
            </Button>
          </div>
          <div className="flex gap-6 text-sm">
            <p><span className="font-semibold">{referralCount}</span> friends referred</p>
            <p><span className="font-semibold">£{profile.referral_credit.toFixed(2)}</span> credit earned</p>
          </div>
        </div>

        {/* Survey Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gift size={20} className="text-accent" />
            <h2 className="text-lg font-bold">
              {surveySubmitted ? "Survey Complete 🎁" : "Complete Survey — Earn a Free Gift!"}
            </h2>
          </div>

          {surveySubmitted ? (
            <p className="text-sm text-muted-foreground">
              Thanks for completing the survey! Your free gift will be included in your next delivery.
            </p>
          ) : (
            <div className="space-y-6">
              {SURVEY_QUESTIONS.map(q => (
                <div key={q.key}>
                  <p className="font-semibold text-sm mb-2">{q.question}</p>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setSurvey(prev => ({ ...prev, [q.key]: opt }))}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          survey[q.key as keyof SurveyData] === opt
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-background border-border hover:border-accent/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Meat ranking */}
              <div>
                <p className="font-semibold text-sm mb-2">Rank these as most used (tap in order of preference)</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {MEAT_TYPES.map(meat => {
                    const rank = survey.meat_ranking.indexOf(meat);
                    return (
                      <button
                        key={meat}
                        onClick={() => toggleMeatRanking(meat)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          rank >= 0
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-background border-border hover:border-accent/50"
                        }`}
                      >
                        {rank >= 0 && <span className="font-bold mr-1">#{rank + 1}</span>}
                        {meat}
                      </button>
                    );
                  })}
                </div>
                {survey.meat_ranking.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Order: {survey.meat_ranking.join(" → ")}
                  </p>
                )}
              </div>

              <Button onClick={handleSurveySubmit} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                Submit Survey & Earn Free Gift
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Account;
