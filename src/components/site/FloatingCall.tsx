import { Phone } from "lucide-react";

export function FloatingCall() {
  return (
    <a
      href="tel:+12815157039"
      aria-label="Call CostaMar Pool Cleaners"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-aqua-gradient text-deep shadow-glow transition-smooth hover:scale-105 md:hidden"
    >
      <Phone className="h-6 w-6" />
    </a>
  );
}