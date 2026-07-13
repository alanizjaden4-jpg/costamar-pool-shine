import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingCall } from "@/components/site/FloatingCall";
import { services } from "@/components/site/services-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Pool Cleaning Services | CostaMar Pool Cleaners" },
      { name: "description", content: "Weekly cleaning, chemical balancing, filter care, equipment inspection, green pool recovery and one-time cleanups." },
      { property: "og:title", content: "Pool Cleaning Services | CostaMar Pool Cleaners" },
      { property: "og:description", content: "Full-service pool care to keep your water crystal clear year-round." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        <section className="bg-hero-gradient py-16 text-white">
          <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Our Pool Cleaning Services</h1>
            <p className="mt-4 text-lg text-white/85">
              Pick a plan or bundle services — we handle everything from chemistry to equipment.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <article key={s.slug} className="group rounded-2xl border border-border bg-card p-6 transition-smooth hover:-translate-y-1 hover:shadow-elegant">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-aqua-gradient text-deep shadow-glow">
                    <s.icon className="h-7 w-7" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-foreground">{s.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <Link to="/pricing" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    View pricing &amp; details <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-aqua-gradient text-deep font-semibold shadow-glow">
                <Link to="/quiz">Take the Pool Quiz</Link>
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