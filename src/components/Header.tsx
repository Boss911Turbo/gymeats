import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const mainNavLinks = [
  { to: "/bulk-beef", label: "Beef" },
  { to: "/bulk-lamb", label: "Lamb" },
  { to: "/bulk-mutton", label: "Mutton" },
  { to: "/bulk-chicken", label: "Chicken" },
  { to: "/extras", label: "Extras" },
  { to: "/wholesale", label: "Wholesale" },
];

const moreLinks = [
  { to: "/about", label: "About Us" },
  { to: "/influencers", label: "Join the Team" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact Us" },
  { to: "#", label: "Gym Wear / Merch", comingSoon: true },
];

const Header = () => {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-border/20">
      <div className="container-tight flex items-center justify-between h-16">
        <Link to="/" className="text-primary-foreground font-black text-xl tracking-tighter">
          GYMEATS
        </Link>

        {/* Desktop nav — product categories only */}
        <nav className="hidden md:flex items-center gap-5">
          {mainNavLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-primary-foreground/70 hover:text-primary-foreground text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to={user ? "/account" : "/auth"} className="text-primary-foreground hover:text-accent transition-colors">
            <User size={22} />
          </Link>
          <Link to="/cart" className="relative text-primary-foreground hover:text-accent transition-colors">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="text-primary-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Slide-out menu (hamburger) */}
      {menuOpen && (
        <nav className="bg-primary border-t border-border/20 pb-4">
          {/* On mobile, show product links too */}
          <div className="md:hidden">
            {mainNavLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 text-primary-foreground/70 hover:text-primary-foreground text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border/10 my-2" />
          </div>
          {moreLinks.map(link => (
            <Link
              key={link.to}
              to={link.comingSoon ? "#" : link.to}
              onClick={() => !link.comingSoon && setMenuOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors ${
                link.comingSoon
                  ? "text-primary-foreground/40 cursor-default"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              {link.label}
              {link.comingSoon && (
                <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">Coming Soon</span>
              )}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
