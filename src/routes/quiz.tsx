import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingCall } from "@/components/site/FloatingCall";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Pool Quiz — Get a Custom Recommendation | Coastal Pool Service" },
      { name: "description", content: "Take our 60-second pool quiz and get a personalized service recommendation and quote." },
      { property: "og:title", content: "Pool Quiz | Coastal Pool Service" },
      { property: "og:description", content: "Get a custom pool service recommendation in under a minute." },
      { property: "og:url", content: "/quiz" },
    ],
    links: [{ rel: "canonical", href: "/quiz" }],
  }),
  component: QuizPage,
});

type QuizState = {
  poolType?: string;
  poolSize?: string;
  condition?: string;
  serviceNeeded?: string;
  timing?: string;
};

const QUESTIONS: {
  key: keyof QuizState;
  title: string;
  options: string[];
}[] = [
  { key: "poolType", title: "What type of pool do you have?", options: ["Chlorine", "Saltwater", "Not Sure"] },
  { key: "poolSize", title: "How large is your pool?", options: ["Small", "Medium", "Large"] },
  { key: "condition", title: "What's the current condition?", options: ["Crystal Clear", "Needs Maintenance", "Green / Dirty"] },
  { key: "serviceNeeded", title: "What service do you need?", options: ["Weekly Cleaning", "One-Time Cleanup", "Chemical Balancing", "Equipment Inspection", "Not Sure"] },
  { key: "timing", title: "How soon do you need service?", options: ["ASAP", "This Week", "This Month"] },
];

const leadSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(60),
  lastName: z.string().trim().min(1, "Required").max(60),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Invalid phone").max(20),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent required" }) }),
});

function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizState>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = QUESTIONS.length + 1;
  const progress = useMemo(() => Math.round(((step + (done ? 1 : 0)) / total) * 100), [step, done, total]);

  const isQuiz = step < QUESTIONS.length;
  const current = QUESTIONS[step];

  const choose = (value: string) => {
    if (!current) return;
    setAnswers((a) => ({ ...a, [current.key]: value }));
    setTimeout(() => setStep((s) => Math.min(s + 1, QUESTIONS.length)), 150);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const payload = { ...parsed.data, quiz: answers };
    fetch("/api/public/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Submission failed");
        setDone(true);
      })
      .catch(() => {
        setErrors({ form: "Something went wrong. Please call (281) 515-7039." });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28">
        <section className="bg-hero-gradient py-12 text-white">
          <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Pool Service Quiz</h1>
            <p className="mt-3 text-white/85">Answer 5 quick questions for a custom recommendation.</p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-2xl px-4 md:px-8">
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Step {Math.min(step + 1, total)} of {total}</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-aqua-gradient transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {done ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-elegant">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-aqua-gradient text-deep">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-foreground">Thank you!</h2>
                <p className="mt-2 text-muted-foreground">
                  A Coastal Pool Service specialist will contact you shortly.
                </p>
                <Button asChild className="mt-6 bg-aqua-gradient text-deep font-semibold">
                  <Link to="/">Return Home</Link>
                </Button>
              </div>
            ) : isQuiz ? (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant md:p-8">
                <h2 className="text-xl font-semibold text-foreground md:text-2xl">{current.title}</h2>
                <div className="mt-6 grid gap-3">
                  {current.options.map((opt) => {
                    const active = answers[current.key] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => choose(opt)}
                        className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left transition-smooth hover:border-secondary hover:bg-muted/50 ${
                          active ? "border-secondary bg-secondary/10" : "border-border"
                        }`}
                      >
                        <span className="font-medium text-foreground">{opt}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    );
                  })}
                </div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-elegant md:p-8">
                <div className="mb-6 flex items-center gap-2 text-secondary">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Almost there</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Get Your Customized Pool Service Recommendation
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tell us how to reach you and we'll send your personalized plan.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="First Name" name="firstName" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} error={errors.firstName} />
                  <Field label="Last Name" name="lastName" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} error={errors.lastName} />
                  <Field label="Email" type="email" name="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
                  <Field label="Phone" type="tel" name="phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone} />
                  <div className="sm:col-span-2">
                    <Field label="Address (optional)" name="address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} error={errors.address} />
                  </div>
                </div>
                <label className="mt-5 flex items-start gap-3 text-sm text-foreground">
                  <Checkbox
                    checked={form.consent}
                    onCheckedChange={(c) => setForm({ ...form, consent: c === true })}
                    aria-invalid={!!errors.consent}
                  />
                  <span>
                    I agree to be contacted regarding my pool service request.
                  </span>
                </label>
                {errors.consent && <p className="mt-1 text-xs text-destructive">{errors.consent}</p>}
                <Button
                  type="submit"
                  disabled={submitting}
                  size="lg"
                  className="mt-6 w-full bg-aqua-gradient text-deep font-semibold shadow-glow"
                >
                  {submitting ? "Submitting…" : "Get My Recommendation"}
                </Button>
                {errors.form && <p className="mt-2 text-center text-sm text-destructive">{errors.form}</p>}
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to quiz
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCall />
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <Label htmlFor={name} className="text-sm font-medium">{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className="mt-1"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}