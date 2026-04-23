import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Users, Package, MessageSquare, Ban, Trash2, Check, X, Eye, Reply, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WHATSAPP_NUMBER } from "@/data/products";

type Tab = "orders" | "customers" | "contacts";

interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_method: string;
  address: string;
  postcode: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  items: any[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  admin_notes: string;
  created_at: string;
}

interface Customer {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  is_blocked: boolean;
  created_at: string;
  referral_code: string;
  referral_credit: number;
}

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  bulk_request: string;
  status: string;
  admin_reply: string;
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("orders");

  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    checkAdmin();
  }, [user, authLoading]);

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
    // Realtime for orders
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => loadOrders())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  const checkAdmin = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user!.id)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
    setChecking(false);
  };

  const loadData = () => {
    loadOrders();
    loadCustomers();
    loadContacts();
  };

  const loadOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
  };

  const loadCustomers = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setCustomers(data as Customer[]);
  };

  const loadContacts = async () => {
    const { data } = await supabase.from("contact_requests").select("*").order("created_at", { ascending: false });
    if (data) setContacts(data as ContactRequest[]);
  };

  const updateOrderStatus = async (orderId: string, status: string, _order: Order) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) { toast.error("Failed to update order"); return; }
    toast.success(`Order ${status}`);
  };

  const toggleBlock = async (customer: Customer) => {
    const { error } = await supabase.from("profiles").update({ is_blocked: !customer.is_blocked }).eq("id", customer.id);
    if (error) { toast.error("Failed"); return; }
    toast.success(customer.is_blocked ? "Unblocked" : "Blocked");
    loadCustomers();
  };

  const eraseAccount = async (customer: Customer) => {
    if (!confirm(`PERMANENTLY DELETE account for ${customer.full_name || customer.email}?\n\nThis removes their login, profile, orders and all related data. They can re-register later with the same email.`)) return;
    const { data, error } = await supabase.functions.invoke("delete-user", {
      body: { user_id: customer.user_id },
    });
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || "Failed to delete");
      return;
    }
    toast.success("Account fully deleted");
    loadCustomers();
  };

  const replyToContact = async (contact: ContactRequest, reply: string) => {
    const { error } = await supabase.from("contact_requests").update({ admin_reply: reply, status: "replied" }).eq("id", contact.id);
    if (error) { toast.error("Failed"); return; }
    toast.success("Reply saved");
    loadContacts();
  };

  if (authLoading || checking) {
    return <Layout><div className="container-tight py-20 text-center">Checking access...</div></Layout>;
  }

  if (!isAdmin) {
    return (
      <Layout>
        <section className="container-tight py-20 text-center">
          <Shield size={48} className="mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-black mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin access.</p>
        </section>
      </Layout>
    );
  }

  const filteredOrders = orders.filter(o =>
    o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_phone.includes(searchTerm)
  );

  const filteredCustomers = customers.filter(c =>
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const statusColor = (s: string) => {
    switch (s) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "declined": return "bg-red-100 text-red-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-emerald-100 text-emerald-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <section className="container-tight py-10">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={28} className="text-accent" />
          <h1 className="text-3xl font-black">Admin Panel</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border pb-3">
          {[
            { id: "orders" as Tab, label: "Orders", icon: Package, count: orders.filter(o => o.status === "pending").length },
            { id: "customers" as Tab, label: "Customers", icon: Users, count: customers.length },
            { id: "contacts" as Tab, label: "Contact Requests", icon: MessageSquare, count: contacts.filter(c => c.status === "new").length },
          ].map(t => (
            <Button
              key={t.id}
              variant={tab === t.id ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t.id)}
              className="gap-2"
            >
              <t.icon size={16} />
              {t.label}
              {t.count > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5 ml-1">
                  {t.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            {filteredOrders.length === 0 && <p className="text-muted-foreground text-center py-8">No orders yet</p>}
            {filteredOrders.map(order => (
              <div key={order.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <p className="font-bold">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                {order.delivery_method === "delivery" && (
                  <p className="text-sm"><strong>Delivery:</strong> {order.address}, {order.postcode}</p>
                )}
                {order.delivery_method === "pickup" && (
                  <p className="text-sm"><strong>Method:</strong> Pickup</p>
                )}
                {order.preferred_date && <p className="text-sm"><strong>Date:</strong> {order.preferred_date} {order.preferred_time}</p>}

                {/* Items */}
                <div className="bg-muted rounded p-3 text-sm space-y-1">
                  {(order.items as any[]).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.productName} x{item.quantity} {item.targetWeight ? `(${item.targetWeight}kg)` : ""}</span>
                      <span className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm font-bold">
                  <span>Total</span>
                  <span>£{order.total.toFixed(2)}</span>
                </div>

                {order.notes && <p className="text-sm text-muted-foreground"><strong>Notes:</strong> {order.notes}</p>}

                {order.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="gap-1" onClick={() => updateOrderStatus(order.id, "approved", order)}>
                      <Check size={14} /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="gap-1" onClick={() => updateOrderStatus(order.id, "declined", order)}>
                      <X size={14} /> Decline
                    </Button>
                  </div>
                )}

                {order.status === "approved" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="gap-1" onClick={() => updateOrderStatus(order.id, "processing", order)}>
                      <Package size={14} /> Mark Processing
                    </Button>
                  </div>
                )}

                {order.status === "processing" && (
                  <Button size="sm" className="gap-1" onClick={() => updateOrderStatus(order.id, "delivered", order)}>
                    <Check size={14} /> Mark Delivered
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Customers Tab */}
        {tab === "customers" && (
          <div className="space-y-3">
            {filteredCustomers.length === 0 && <p className="text-muted-foreground text-center py-8">No customers</p>}
            {filteredCustomers.map(c => (
              <div key={c.id} className={`border rounded-lg p-4 ${c.is_blocked ? "border-destructive bg-destructive/5" : "border-border"}`}>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <p className="font-bold">{c.full_name || "No name"} {c.is_blocked && <Badge variant="destructive" className="ml-2">BLOCKED</Badge>}</p>
                    <p className="text-sm">{c.email}</p>
                    <p className="text-sm text-muted-foreground">{c.phone}</p>
                    {c.address && <p className="text-xs text-muted-foreground">{c.address}</p>}
                    <p className="text-xs text-muted-foreground">Joined: {new Date(c.created_at).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">Referral: {c.referral_code} | Credit: £{c.referral_credit}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant={c.is_blocked ? "default" : "outline"} className="gap-1" onClick={() => toggleBlock(c)}>
                      <Ban size={14} /> {c.is_blocked ? "Unblock" : "Block"}
                    </Button>
                    <Button size="sm" variant="destructive" className="gap-1" onClick={() => eraseAccount(c)}>
                      <Trash2 size={14} /> Erase
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contacts Tab */}
        {tab === "contacts" && (
          <div className="space-y-4">
            {contacts.length === 0 && <p className="text-muted-foreground text-center py-8">No contact requests</p>}
            {contacts.map(c => (
              <ContactCard key={c.id} contact={c} onReply={replyToContact} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

const ContactCard = ({ contact, onReply }: { contact: ContactRequest; onReply: (c: ContactRequest, reply: string) => void }) => {
  const [reply, setReply] = useState(contact.admin_reply || "");
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="border border-border rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold">{contact.name}</p>
          <p className="text-sm text-muted-foreground">{contact.email}</p>
          <p className="text-xs text-muted-foreground">{new Date(contact.created_at).toLocaleString()}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${contact.status === "new" ? "bg-yellow-100 text-yellow-800" : contact.status === "replied" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
          {contact.status.toUpperCase()}
        </span>
      </div>
      <p className="text-sm">{contact.message}</p>
      {contact.bulk_request && <p className="text-sm text-muted-foreground"><strong>Bulk Request:</strong> {contact.bulk_request}</p>}
      {contact.admin_reply && <div className="bg-muted rounded p-2 text-sm"><strong>Your reply:</strong> {contact.admin_reply}</div>}

      {!showReply ? (
        <Button size="sm" variant="outline" className="gap-1" onClick={() => setShowReply(true)}>
          <Reply size={14} /> Reply
        </Button>
      ) : (
        <div className="space-y-2">
          <Textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} placeholder="Type your reply..." />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => { onReply(contact, reply); setShowReply(false); }}>Send Reply</Button>
            <Button size="sm" variant="outline" onClick={() => setShowReply(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
