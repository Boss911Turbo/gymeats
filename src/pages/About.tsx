import Layout from "@/components/Layout";

const About = () => (
  <Layout>
    <section className="container-tight py-16">
      <h1 className="text-3xl md:text-4xl font-black mb-6">About GYMEATS</h1>
      
      <div className="max-w-3xl space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-3">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            GYMEATS was born from a simple idea: make premium halal bulk meat accessible, affordable, and easy to order online. We own every step of the process — from our own farms, to our own slaughterhouse facilities, to our own delivery fleet. No middlemen, no compromises. Just honest, high-quality halal meat straight from us to your door.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Farm to Door — We Are the Whole Process</h2>
          <p className="text-muted-foreground leading-relaxed">
            Unlike other suppliers, we don't rely on third parties. Our own farmers raise the livestock, our own slaughterhouse facilities handle the processing under strict halal standards, and our own delivery team brings it to you. This means better prices, full traceability, and unmatched freshness — because there's no middleman when you are the whole process.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Halal Sourcing</h2>
          <p className="text-muted-foreground leading-relaxed">
            All our meat is 100% halal certified. With our own slaughterhouse facilities, we maintain complete control over halal compliance, quality, and freshness at every stage.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Packing Promise</h2>
          <p className="text-muted-foreground leading-relaxed">
            Every item is vacuum packed for freshness and easy freezing. Mince comes in 500g or 1kg bags, big cuts are packed in sturdy meat bags. Chicken boxes are the exception — they come as full boxes, not individually packed.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Customer Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            We're available on WhatsApp for quick responses. Have a custom order or special request? Just drop us a message and we'll sort it out.
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
