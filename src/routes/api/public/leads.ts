import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const leadSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  consent: z.literal(true),
  quiz: z
    .object({
      poolType: z.string().max(60).optional(),
      poolSize: z.string().max(60).optional(),
      condition: z.string().max(60).optional(),
      serviceNeeded: z.string().max(60).optional(),
      timing: z.string().max(60).optional(),
    })
    .optional(),
});

export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = leadSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Invalid input", details: parsed.error.flatten() },
            { status: 400 },
          );
        }

        const d = parsed.data;
        const { data: lead, error } = await supabaseAdmin
          .from("leads")
          .insert({
            first_name: d.firstName,
            last_name: d.lastName,
            email: d.email,
            phone: d.phone,
            address: d.address || null,
            pool_type: d.quiz?.poolType ?? null,
            pool_size: d.quiz?.poolSize ?? null,
            condition: d.quiz?.condition ?? null,
            service_needed: d.quiz?.serviceNeeded ?? null,
            timing: d.quiz?.timing ?? null,
          })
          .select("id")
          .single();

        if (error) {
          console.error("[leads] insert failed", error);
          return Response.json({ error: "Could not save lead" }, { status: 500 });
        }

        // Best-effort email notification — only fires when transactional email is wired.
        try {
          const { error: emailError } = await supabaseAdmin.rpc("enqueue_email" as never, {
            queue_name: "transactional_emails",
            payload: {
              template_name: "new-lead-notification",
              recipient_email: "alanizjaden4@gmail.com",
              template_data: {
                firstName: d.firstName,
                lastName: d.lastName,
                email: d.email,
                phone: d.phone,
                address: d.address || "",
                quiz: d.quiz ?? {},
              },
              idempotency_key: `lead-${lead.id}`,
            },
          } as never);
          if (!emailError) {
            await supabaseAdmin
              .from("leads")
              .update({ email_sent: true })
              .eq("id", lead.id);
          }
        } catch (err) {
          // Email infra not yet configured — lead is saved regardless.
          console.warn("[leads] email enqueue skipped:", err);
        }

        return Response.json({ ok: true, id: lead.id });
      },
    },
  },
});