import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      toast.success("Account created! Please check your email to verify.");

      // After signup, update profile with details
      // We need to wait for session to establish, so we listen once
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          subscription.unsubscribe();
          await supabase.from("profiles").update({
            full_name: fullName,
            phone,
            address,
          }).eq("user_id", session.user.id);

          if (referralCode.trim()) {
            await supabase.rpc("process_referral", { referral_code_input: referralCode.trim() });
          }
        }
      });
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      toast.success("Welcome back!");
      navigate("/account");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="container-tight py-16 max-w-md mx-auto">
        <h1 className="text-3xl font-black mb-6 text-center">
          {isSignUp ? "Create Account" : "Sign In"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="text-sm font-semibold block mb-1">Full Name *</label>
                <Input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Phone *</label>
                <Input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your phone number" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Delivery Address</label>
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Your delivery address" />
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-semibold block mb-1">Email *</label>
            <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Password *</label>
            <Input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" />
          </div>

          {isSignUp && (
            <div>
              <label className="text-sm font-semibold block mb-1">Referral Code (optional)</label>
              <Input value={referralCode} onChange={e => setReferralCode(e.target.value)} placeholder="Enter a friend's referral code" />
            </div>
          )}

          <Button type="submit" size="lg" className="w-full font-bold bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-accent font-semibold hover:underline">
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </section>
    </Layout>
  );
};

export default Auth;
