import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/quiz", label: "Pool Quiz" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-smooth ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2" aria-label="Coastal Pool Service home">
          <img src={logo} alt="Coastal Pool Service logo" className="h-11 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-foreground/80 transition-smooth hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild variant="default" className="bg-aqua-gradient text-deep font-semibold shadow-glow hover:opacity-95">
            <Link to="/quiz">Get Free Quote</Link>
          </Button>
        </nav>

        <button
          className="md:hidden rounded-md p-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-foreground/90 hover:bg-muted"
                activeProps={{ className: "text-primary" }}
              >
                {l.label}
              </Link>
            ))}
            <Button asChild className="mt-2 bg-aqua-gradient text-deep font-semibold">
              <Link to="/quiz" onClick={() => setOpen(false)}>Get Free Quote</Link>
            </Button>
            <a
              href="tel:+15555550123"
              className="mt-1 flex items-center justify-center gap-2 rounded-md border border-border px-3 py-3 text-sm font-medium"
            >
              <Phone className="h-4 w-4" /> (281) 515-7039
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}