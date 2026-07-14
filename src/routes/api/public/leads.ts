import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const leadSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  preferredContact: z.enum(["phone", "email", "text"]).optional(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
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

const HUBSPOT_GATEWAY = "https://connector-gateway.lovable.dev/hubspot";

async function syncToHubSpot(lead: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  preferredContact?: string;
  notes?: string;
  quiz?: {
    poolType?: string;
    poolSize?: string;
    condition?: string;
    serviceNeeded?: string;
    timing?: string;
  };
}): Promise<{ id: string | null; error: string | null }> {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
  if (!LOVABLE_API_KEY || !HUBSPOT_API_KEY) {
    return { id: null, error: "HubSpot credentials not configured" };
  }

  // Concatenate quiz + notes into a single free-form field so we don't
  // depend on custom HubSpot properties existing in the account.
  const summaryLines: string[] = [];
  if (lead.quiz?.poolType) summaryLines.push(`Pool Type: ${lead.quiz.poolType}`);
  if (lead.quiz?.poolSize) summaryLines.push(`Pool Size: ${lead.quiz.poolSize}`);
  if (lead.quiz?.condition) summaryLines.push(`Condition: ${lead.quiz.condition}`);
  if (lead.quiz?.serviceNeeded) summaryLines.push(`Service Needed: ${lead.quiz.serviceNeeded}`);
  if (lead.quiz?.timing) summaryLines.push(`Timing: ${lead.quiz.timing}`);
  if (lead.preferredContact) summaryLines.push(`Preferred Contact: ${lead.preferredContact}`);
  if (lead.notes) summaryLines.push(`Notes: ${lead.notes}`);
  const summary = summaryLines.join("\n");

  const properties: Record<string, string> = {
    firstname: lead.firstName,
    lastname: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
  };
  if (lead.address) properties.address = lead.address;
  if (summary) properties.message = summary;

  const doCall = async (): Promise<Response> =>
    fetch(`${HUBSPOT_GATEWAY}/crm/v3/objects/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": HUBSPOT_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties }),
    });

  // Attempt + one automatic retry.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      let res = await doCall();

      // If the contact already exists, update it instead of failing.
      if (res.status === 409) {
        const searchRes = await fetch(`${HUBSPOT_GATEWAY}/crm/v3/objects/contacts/search`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": HUBSPOT_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filterGroups: [
              { filters: [{ propertyName: "email", operator: "EQ", value: lead.email }] },
            ],
            properties: ["email"],
            limit: 1,
          }),
        });
        if (searchRes.ok) {
          const searchBody = (await searchRes.json()) as {
            results?: Array<{ id: string }>;
          };
          const existingId = searchBody.results?.[0]?.id;
          if (existingId) {
            const patchRes = await fetch(
              `${HUBSPOT_GATEWAY}/crm/v3/objects/contacts/${existingId}`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${LOVABLE_API_KEY}`,
                  "X-Connection-Api-Key": HUBSPOT_API_KEY,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ properties }),
              },
            );
            if (patchRes.ok) return { id: existingId, error: null };
            const patchErr = await patchRes.text();
            console.error(`[leads] HubSpot patch failed [${patchRes.status}]: ${patchErr}`);
            if (attempt === 2) {
              return { id: null, error: `HubSpot update failed: ${patchRes.status}` };
            }
            continue;
          }
        }
      }

      if (res.ok) {
        const body = (await res.json()) as { id?: string };
        return { id: body.id ?? null, error: null };
      }

      const errText = await res.text();
      console.error(`[leads] HubSpot create failed [${res.status}]: ${errText}`);
      if (attempt === 2) {
        return { id: null, error: `HubSpot ${res.status}: ${errText.slice(0, 200)}` };
      }
    } catch (err) {
      console.error("[leads] HubSpot request error:", err);
      if (attempt === 2) {
        return {
          id: null,
          error: err instanceof Error ? err.message : "HubSpot request failed",
        };
      }
    }
    // brief backoff before retry
    await new Promise((r) => setTimeout(r, 400));
  }
  return { id: null, error: "HubSpot sync failed" };
}

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

        // 1) Always save the lead locally first. This is the source of truth
        //    and guarantees the request is never lost, even if HubSpot is down.
        const { data: lead, error } = await supabaseAdmin
          .from("leads")
          .insert({
            first_name: d.firstName,
            last_name: d.lastName,
            email: d.email,
            phone: d.phone,
            address: d.address || null,
            preferred_contact: d.preferredContact ?? null,
            notes: d.notes || null,
            pool_type: d.quiz?.poolType ?? null,
            pool_size: d.quiz?.poolSize ?? null,
            condition: d.quiz?.condition ?? null,
            service_needed: d.quiz?.serviceNeeded ?? null,
            timing: d.quiz?.timing ?? null,
          })
          .select("id")
          .single();

        if (error) {
          console.error("[leads] DB insert failed", error);
          // Only real database failure surfaces as an error to the client.
          return Response.json(
            { error: "Could not save lead", code: "db_unavailable" },
            { status: 503 },
          );
        }

        // 2) Sync to HubSpot with automatic retry. Never fails the request.
        const hs = await syncToHubSpot({
          firstName: d.firstName,
          lastName: d.lastName,
          email: d.email,
          phone: d.phone,
          address: d.address || undefined,
          preferredContact: d.preferredContact,
          notes: d.notes || undefined,
          quiz: d.quiz,
        });

        await supabaseAdmin
          .from("leads")
          .update({
            hubspot_contact_id: hs.id,
            crm_synced: hs.id !== null,
            crm_error: hs.error,
          })
          .eq("id", lead.id);

        // 3) Best-effort admin email notification.
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
                preferredContact: d.preferredContact || "",
                notes: d.notes || "",
                quiz: d.quiz ?? {},
                crmSynced: hs.id !== null,
                crmError: hs.error || "",
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
          console.warn("[leads] email enqueue skipped:", err);
        }

        // Success from the customer's perspective: their request was saved.
        // We report crmSynced separately so the UI can show a softer message
        // when the CRM push didn't go through.
        return Response.json({
          ok: true,
          id: lead.id,
          crmSynced: hs.id !== null,
        });
      },
    },
  },
});