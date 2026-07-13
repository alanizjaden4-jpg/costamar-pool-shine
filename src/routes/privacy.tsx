import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Coastal Pool Service" },
      { name: "description", content: "How Coastal Pool Service collects, uses and protects your information." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        <article className="mx-auto max-w-3xl px-4 py-16 md:px-8 prose prose-slate">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          <div className="mt-8 space-y-6 text-foreground/90">
            <p>
              Coastal Pool Service ("we", "our", "us") respects your privacy. This policy explains
              how we collect and use information when you use our website or request services.
            </p>
            <h2 className="text-xl font-semibold">Information We Collect</h2>
            <p>
              We collect contact information (name, email, phone, address) you provide via our quiz
              and lead forms, as well as basic quiz responses about your pool.
            </p>
            <h2 className="text-xl font-semibold">How We Use It</h2>
            <p>
              We use your information solely to respond to your service request, schedule
              appointments, and provide ongoing pool care. We never sell your data.
            </p>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p>
              Questions? Email <a className="text-primary underline" href="mailto:alanizjaden4@gmail.com">alanizjaden4@gmail.com</a>.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}