import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingCall } from "@/components/site/FloatingCall";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Coastal Pool Service" },
      { name: "description", content: "Call, email, or visit us. Fast response times and friendly local pool pros." },
      { property: "og:title", content: "Contact Coastal Pool Service" },
      { property: "og:description", content: "Get in touch with your local pool care experts." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        <section className="bg-hero-gradient py-16 text-white">
          <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Get in Touch</h1>
            <p className="mt-4 text-lg text-white/85">
              Fast response times — usually within the hour during business hours.
            </p>
            <Button asChild size="lg" className="mt-8 bg-aqua-gradient text-deep font-semibold shadow-glow">
              <a href="tel:+12815157039"><Phone className="mr-2 h-5 w-5" /> Call Now</a>
            </Button>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2 md:px-8">
            <div className="space-y-5">
              <InfoCard icon={Phone} title="Phone" value="(281) 515-7039" href="tel:+12815157039" />
              <InfoCard icon={Mail} title="Email" value="alanizjaden4@gmail.com" href="mailto:alanizjaden4@gmail.com" />
              <InfoCard icon={Clock} title="Business Hours" value="Mon – Sat · 8:00 AM – 6:00 PM" />
              <InfoCard icon={MapPin} title="Service Area" value="Houston & Surrounding Areas" />
            </div>
            <div className="overflow-hidden rounded-2xl border border-border shadow-elegant">
              <iframe
                title="Coastal Pool Service service area"
                src="https://www.google.com/maps?q=Houston%2C+TX&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[360px] w-full border-0"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCall />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-smooth hover:shadow-elegant">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-aqua-gradient text-deep">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        <p className="mt-1 text-lg font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}