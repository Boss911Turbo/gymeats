import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/products";
import { useState } from "react";
import { toast } from "sonner";

const Influencers = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    platform: "",
    handle: "",
    followers: "",
    proposal: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `*Influencer / Collab Enquiry*%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APlatform: ${form.platform}%0AHandle: ${form.handle}%0AFollowers: ${form.followers}%0A%0AProposal:%0A${form.proposal}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${message}`, "_blank");
    toast.success("Enquiry sent via WhatsApp!");
  };

  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container-tight">
          <div className="flex items-center gap-3 mb-4">
            <Users size={32} />
            <span className="text-sm font-bold uppercase tracking-widest text-primary-foreground/60">Influencers & Collabs</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 max-w-2xl">
            Join the GYMEATS Team
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-xl">
            We're building a team of fitness influencers, food creators, and lifestyle brands who share our passion for quality halal meat. Get exclusive deals, free products, and earn while you promote. Ready to represent GYMEATS? Let's talk.
          </p>
        </div>
      </section>

      <section className="container-tight py-16">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-black mb-2 text-center">Apply for a Collaboration</h2>
          <p className="text-muted-foreground text-center mb-8">
            Tell us about yourself and how you'd like to work together.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Platform *</Label>
                <Input id="platform" required placeholder="e.g. Instagram, TikTok, YouTube" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="handle">Handle / URL *</Label>
                <Input id="handle" required placeholder="@yourhandle" value={form.handle} onChange={e => setForm(f => ({ ...f, handle: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label htmlFor="followers">Approx. Followers / Subscribers</Label>
              <Input id="followers" placeholder="e.g. 10k, 50k, 100k+" value={form.followers} onChange={e => setForm(f => ({ ...f, followers: e.target.value }))} />
            </div>

            <div>
              <Label htmlFor="proposal">How would you like to collaborate? *</Label>
              <Textarea id="proposal" required rows={5} placeholder="Tell us your idea — sponsored posts, recipe content, unboxing, affiliate, etc." value={form.proposal} onChange={e => setForm(f => ({ ...f, proposal: e.target.value }))} />
            </div>

            <Button type="submit" size="lg" className="w-full font-bold">
              Send via WhatsApp
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Influencers;
