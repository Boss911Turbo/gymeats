import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { WHATSAPP_NUMBER, BUSINESS_EMAIL } from "@/data/products";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "", bulkRequest: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("GYMEATS Contact Form");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}\n\nBulk/Custom Request:\n${form.bulkRequest}`
    );
    window.open(`mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    toast.success("Opening your email client...");
  };

  return (
    <Layout>
      <section className="container-tight py-16">
        <h1 className="text-3xl md:text-4xl font-black mb-6">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="space-y-4 mb-8">
              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <Phone size={20} />
                <div>
                  <p className="font-semibold">Call Us</p>
                  <p className="text-sm text-muted-foreground">+44 XXX XXXX XXX</p>
                </div>
              </a>
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

            {/* Map placeholder */}
            <div className="bg-muted rounded-lg h-48 flex items-center justify-center text-muted-foreground text-sm">
              📍 Map placeholder — add your location
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
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
