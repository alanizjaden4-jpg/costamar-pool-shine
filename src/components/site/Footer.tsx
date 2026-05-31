import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <img src={logo} alt="CostaMar Pools & Patio" className="h-14 w-auto" />
            <p className="mt-3 text-sm text-primary-foreground/70">
              Premium residential pool cleaning & maintenance you can count on.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">Navigate</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accent">Home</Link></li>
              <li><Link to="/services" className="hover:text-accent">Services</Link></li>
              <li><Link to="/quiz" className="hover:text-accent">Pool Quiz</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-accent">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
              <li><a href="tel:+15555550123" className="hover:text-accent">(555) 555-0123</a></li>
              <li><a href="mailto:hello@costamarpools.com" className="hover:text-accent">hello@costamarpools.com</a></li>
              <li>Mon–Sat · 8am – 6pm</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">Service Area</h3>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Proudly serving homeowners across the coastal region.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-primary-foreground/15 pt-6 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} CostaMar Pools & Patio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}