import Layout from "@/components/Layout";

const About = () => (
  <Layout>
    <section className="container-tight py-16">
      <h1 className="text-3xl md:text-4xl font-black mb-6">About GYMEATS</h1>
      
      <div className="max-w-3xl space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-3">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            GYMEATS was born from a simple idea: make premium halal bulk meat accessible, affordable, and easy to order online. Whether you're meal prepping for the week, feeding a large family, or stocking up for events, we've got you covered.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Halal Sourcing</h2>
          <p className="text-muted-foreground leading-relaxed">
            All our meat is 100% halal certified. We work directly with trusted suppliers to ensure every cut meets the highest standards of halal compliance, quality, and freshness.
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
