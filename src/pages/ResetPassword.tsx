import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      setReady(true);
    } else {
      supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") setReady(true);
      });
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { toast.error(error.message); } else {
      toast.success("Password updated successfully!");
      navigate("/account");
    }
    setLoading(false);
  };

  if (!ready) {
    return (
      <Layout>
        <section className="container-tight py-20 text-center">
          <p className="text-muted-foreground">Loading password reset...</p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-tight py-16 max-w-md mx-auto">
        <h1 className="text-3xl font-black mb-6 text-center">Set New Password</h1>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1">New Password *</label>
            <Input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Confirm Password *</label>
            <Input type="password" required minLength={6} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm your password" />
          </div>
          <Button type="submit" size="lg" className="w-full font-bold bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </section>
    </Layout>
  );
};

export default ResetPassword;
