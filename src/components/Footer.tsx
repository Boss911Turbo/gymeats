import { Link } from "react-router-dom";
import { BUSINESS_EMAIL } from "@/data/products";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    {/* Info banner */}
    <div className="bg-foreground/5 border-t border-border/20">
      <div className="container-tight py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-primary-foreground/70">
          <div>📦 Packaging & delivery: £20</div>
          <div>🥩 Vacuum packed, items individually packed (except chicken boxes)</div>
          <div>🥩 Big cuts packed in meat bags (e.g., Tomahawk, Beef ribs)</div>
          <div>📏 All weights will be as close as possible to desired weight</div>
        </div>
      </div>
    </div>

    <div className="container-tight py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-black text-lg mb-3">GYMEATS</h3>
          <p className="text-sm text-primary-foreground/60">
            Premium halal bulk meat, sourced responsibly and delivered fresh to your door.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Shop</h4>
          <div className="flex flex-col gap-2">
            <Link to="/bulk-beef" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Bulk Beef</Link>
            <Link to="/bulk-lamb" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Bulk Lamb</Link>
            <Link to="/bulk-mutton" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Bulk Mutton</Link>
            <Link to="/bulk-chicken" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Bulk Chicken</Link>
            <Link to="/extras" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Extras</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Company</h4>
          <div className="flex flex-col gap-2">
            <Link to="/about" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">About Us</Link>
            <Link to="/contact" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Contact</Link>
            <Link to="/influencers" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Join the Team</Link>
            <Link to="/careers" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Careers</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-primary-foreground/60">
            <span>📧 {BUSINESS_EMAIL}</span>
            <span>💬 WhatsApp available</span>
            <a
              href="https://instagram.com/gymeats"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-foreground transition-colors"
            >
              📸 @gymeats on Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/40">
        <p>🕌 All meat is 100% Halal certified. We guarantee ethical sourcing and quality.</p>
        <p className="mt-2">© {new Date().getFullYear()} GYMEATS. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
