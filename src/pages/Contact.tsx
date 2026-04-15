import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_NUMBER, BUSINESS_EMAIL } from "@/data/products";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "", bulkRequest: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("contact_requests").insert({
        name: form.name,
        email: form.email,
        message: form.message,
        bulk_request: form.bulkRequest,
      });

      if (error) throw error;

      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "", bulkRequest: "" });
    } catch (err: any) {
      toast.error("Failed to send message. Please try WhatsApp instead.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="container-tight py-16">
        <h1 className="text-3xl md:text-4xl font-black mb-6">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="space-y-4 mb-8">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <MessageCircle size={20} />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Chat with us directly</p>
                </div>
              </a>
              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <Mail size={20} />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">{BUSINESS_EMAIL}</p>
                </div>
              </a>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-bold mb-3">Follow Us</h3>
              <a
                href="https://instagram.com/gymeats"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
              >
                📸 @gymeats on Instagram
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1">Name</label>
              <input
                className="w-full border border-input bg-background rounded px-3 py-2 text-sm"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-input bg-background rounded px-3 py-2 text-sm"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Message</label>
              <textarea
                className="w-full border border-input bg-background rounded px-3 py-2 text-sm resize-none"
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Bulk / Custom Request (optional)</label>
              <textarea
                className="w-full border border-input bg-background rounded px-3 py-2 text-sm resize-none"
                rows={3}
                placeholder="Describe any custom cuts, bulk quantities, or special requirements..."
                value={form.bulkRequest}
                onChange={e => setForm({ ...form, bulkRequest: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
