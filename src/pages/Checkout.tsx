import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Checkout = () => {
  return (
    <Layout>
      <section className="container-tight py-10">
        <h1 className="text-3xl font-black mb-6">Checkout</h1>
        <div className="text-center py-16 max-w-lg mx-auto">
          <div className="bg-muted/50 border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-3">We're Not Operational Yet</h2>
            <p className="text-muted-foreground mb-6">
              We're working hard behind the scenes to bring you the freshest, highest-quality meat at unbeatable prices. We hope to see you soon — stay tuned!
            </p>
            <Link to="/">
              <Button size="lg" className="font-bold">Back to Home</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
