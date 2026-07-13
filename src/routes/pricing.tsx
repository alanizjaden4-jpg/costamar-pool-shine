import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingCall } from "@/components/site/FloatingCall";
import { services } from "@/components/site/services-data";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pool Service Pricing | Coastal Pool Service" },
      { name: "description", content: "Transparent pricing for weekly pool maintenance, filter cleaning, green pool cleanup, one-time cleanings, new pool startups, and more." },
      { property: "og:title", content: "Pool Service Pricing | Coastal Pool Service" },
      { property: "og:description", content: "See our service categories and request a free custom quote for your pool." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        <section className="bg-hero-gradient py-16 text-white">
          <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Pool Service Pricing</h1>
            <p className="mt-4 text-lg text-white/85">
              Simple, honest pricing for every pool need. Every quote is tailored to your pool size, equipment, and condition.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <article
                  key={s.slug}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-smooth hover:-translate-y-1 hover:shadow-elegant"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-aqua-gradient text-deep shadow-glow">
                    <s.icon className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-foreground">{s.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>

                  <div className="mt-4 rounded-xl bg-muted p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Starting price</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{s.price}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Final cost depends on pool size & condition.</p>
                  </div>

                  <h3 className="mt-5 text-sm font-semibold uppercase tracking-wider text-secondary">What&apos;s included</h3>
                  <ul className="mt-3 flex-1 space-y-2">
                    {s.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-foreground/90">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className="mt-6 w-full bg-aqua-gradient text-deep font-semibold shadow-glow hover:opacity-95"
                  >
                    <Link to="/quiz">Get My Free Quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </article>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground">Not sure which service fits?</h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Take our 60-second Pool Quiz and we&apos;ll recommend the right plan and send you a custom quote.
              </p>
              <Button asChild size="lg" className="mt-6 bg-aqua-gradient text-deep font-semibold shadow-glow">
                <Link to="/quiz">Take the Pool Quiz <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCall />
    </div>
  );
}
