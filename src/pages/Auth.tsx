import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent! Check your inbox.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) { toast.error(error.message); setLoading(false); return; }
      toast.success("Account created! Please check your email to verify.");
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          subscription.unsubscribe();
          await supabase.from("profiles").update({ full_name: fullName, phone, address }).eq("user_id", session.user.id);
          if (referralCode.trim()) {
            await supabase.rpc("process_referral", { referral_code_input: referralCode.trim() });
          }
        }
      });
    } else {
      const { error } = await signIn(email, password);
      if (error) { toast.error(error.message); setLoading(false); return; }
      toast.success("Welcome back!");
      navigate("/account");
    }
    setLoading(false);
  };

  if (isForgotPassword) {
    return (
      <Layout>
        <section className="container-tight py-16 max-w-md mx-auto">
          <h1 className="text-3xl font-black mb-6 text-center">Reset Password</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">Enter your email and we'll send you a link to reset your password.</p>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1">Email *</label>
              <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>
            <Button type="submit" size="lg" className="w-full font-bold bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <button onClick={() => setIsForgotPassword(false)} className="text-accent font-semibold hover:underline">
              ← Back to Sign In
            </button>
          </p>
        </section>
      </Layout>
    );
  }

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
          {!isSignUp && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="accent-accent" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm text-accent font-semibold hover:underline">
                Forgot password?
              </button>
            </div>
          )}
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
