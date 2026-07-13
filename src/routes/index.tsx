import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Clock,
  Award,
  Sparkles,
  Waves,
  DollarSign,
  MapPin,
  ArrowRight,
  ClipboardList,
  Wand2,
  CalendarCheck,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingCall } from "@/components/site/FloatingCall";
import { services } from "@/components/site/services-data";
import hero from "@/assets/hero-pool.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CostaMar Pool Cleaners | Professional Pool Cleaning Services" },
      { name: "description", content: "Professional pool cleaning, maintenance, and chemical balancing. Get a free quote from CostaMar Pool Cleaners today." },
      { property: "og:title", content: "CostaMar Pool Cleaners | Professional Pool Cleaning Services" },
      { property: "og:description", content: "Weekly pool cleaning, chemical balancing & equipment care across the coast." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const trustHighlights = [
  { icon: ShieldCheck, title: "Reliable Service", desc: "Show up on schedule, every time." },
  { icon: Waves, title: "Crystal Clear Water", desc: "Balanced chemistry, sparkling results." },
  { icon: DollarSign, title: "Affordable Plans", desc: "Flat-rate maintenance, no surprises." },
  { icon: MapPin, title: "Local & Professional", desc: "Trained local techs you can trust." },
];

const badges = [
  { icon: Award, label: "Licensed & Insured" },
  { icon: Smile, label: "Satisfaction Focused" },
  { icon: Clock, label: "Fast Response Times" },
];

const steps = [
  { icon: ClipboardList, title: "Take the Pool Quiz", desc: "Tell us about your pool in under a minute." },
  { icon: Wand2, title: "Get a Custom Recommendation", desc: "We match you with the right service plan." },
  { icon: CalendarCheck, title: "Schedule Service", desc: "Pick a time that works for you." },
  { icon: Sparkles, title: "Enjoy a Clean Pool", desc: "Sit back and relax — we handle the rest." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden pt-24">
          <img
            src={hero}
            alt="Sparkling backyard pool at sunset"
            width={1920}
            height={1080}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-deep/85 via-deep/65 to-deep/30" />
          <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
            <div className="max-w-2xl text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <Waves className="h-3.5 w-3.5 text-accent" /> Trusted Local Pool Pros
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Professional Pool Cleaning You Can Count On
              </h1>
              <p className="mt-5 text-lg text-white/85 md:text-xl">
                Weekly pool cleaning, maintenance, chemical balancing, and equipment inspections to keep your pool crystal clear year-round.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-aqua-gradient text-deep font-semibold shadow-glow hover:opacity-95">
                  <Link to="/quiz">Get My Free Quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white">
                  <Link to="/quiz">Take the Pool Quiz</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
                {badges.map((b) => (
                  <div key={b.label} className="flex items-center gap-2">
                    <b.icon className="h-4 w-4 text-accent" /> {b.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="border-y border-border bg-muted/40 py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trustHighlights.map((t) => (
                <div key={t.title} className="rounded-2xl bg-card p-6 shadow-sm transition-smooth hover:shadow-elegant">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-aqua-gradient text-deep">
                    <t.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-secondary">Our Services</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Everything your pool needs, in one trusted team
              </h2>
              <p className="mt-4 text-muted-foreground">
                From weekly care to emergency green-pool recovery — we've got it covered.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <article key={s.slug} className="group rounded-2xl border border-border bg-card p-6 transition-smooth hover:-translate-y-1 hover:shadow-elegant">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-aqua-gradient text-deep shadow-glow">
                    <s.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <Link to="/pricing" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    View pricing &amp; details <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-hero-gradient py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">How it works</span>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">From quote to crystal clear in 4 steps</h2>
            </div>
            <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="relative rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aqua-gradient text-deep font-bold">
                    {i + 1}
                  </div>
                  <s.icon className="absolute right-5 top-5 h-6 w-6 text-accent/80" />
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-white/75">{s.desc}</p>
                </li>
              ))}
            </ol>
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-aqua-gradient text-deep font-semibold shadow-glow">
                <Link to="/quiz">Start the Pool Quiz <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ready for a worry-free pool?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Take our 60-second quiz and get a personalized service recommendation.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-aqua-gradient text-deep font-semibold shadow-glow">
                <Link to="/quiz">Get My Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Contact Us</Link>
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
