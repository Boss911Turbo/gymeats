import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { WHATSAPP_NUMBER, BUSINESS_EMAIL } from "@/data/products";
import { useState } from "react";
import { toast } from "sonner";

const Careers = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    experience: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("GYMEATS Career Application");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nRole: ${form.role}\nExperience: ${form.experience}\n\nMessage:\n${form.message}`
    );
    window.open(`mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    toast.success("Opening your email client...");
  };

  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container-tight">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase size={32} />
            <span className="text-sm font-bold uppercase tracking-widest text-primary-foreground/60">Careers</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 max-w-2xl">
            Join the GYMEATS Team
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-xl">
            We're always looking for passionate people to join our growing team. From the farm to delivery, there's a role for everyone.
          </p>
        </div>
      </section>

      <section className="container-tight py-16">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-black mb-2 text-center">Apply Now</h2>
          <p className="text-muted-foreground text-center mb-8">
            Send us your details and we'll get back to you if there's a match.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="role">Role You're Interested In *</Label>
                <Input id="role" required placeholder="e.g. Butcher, Driver, Warehouse, Admin" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label htmlFor="experience">Relevant Experience</Label>
              <Input id="experience" placeholder="e.g. 3 years butchery, delivery driver experience" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
            </div>

            <div>
              <Label htmlFor="message">Tell us about yourself *</Label>
              <Textarea id="message" required rows={5} placeholder="Why do you want to work with GYMEATS? What skills do you bring?" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            </div>

            <Button type="submit" size="lg" className="w-full font-bold">
              Submit Application
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Or email us directly at{" "}
              <a href={`mailto:${BUSINESS_EMAIL}`} className="underline">{BUSINESS_EMAIL}</a>
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
