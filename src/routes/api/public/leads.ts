import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

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

// Call HubSpot directly — no Lovable gateway dependency. Works on any host
// (self-hosted Cloudflare, Lovable, local) as long as HUBSPOT_ACCESS_TOKEN
// is present in the runtime environment.
const HUBSPOT_API = "https://api.hubapi.com";

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
  // Support the primary token name plus common aliases so a token stored
  // under any of these in Cloudflare Secrets works without further config.
  const token =
    process.env.HUBSPOT_ACCESS_TOKEN ||
    process.env.HUBSPOT_PRIVATE_APP_TOKEN ||
    process.env.HUBSPOT_TOKEN ||
    process.env.HUBSPOT_API_KEY;
  if (!token) {
    return { id: null, error: "HUBSPOT_ACCESS_TOKEN not configured" };
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

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const doCall = async (): Promise<Response> =>
    fetch(`${HUBSPOT_API}/crm/v3/objects/contacts`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ properties }),
    });

  // Attempt + one automatic retry.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      let res = await doCall();

      // If the contact already exists, update it instead of failing.
      if (res.status === 409) {
        const searchRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/search`, {
          method: "POST",
          headers: authHeaders,
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
              `${HUBSPOT_API}/crm/v3/objects/contacts/${existingId}`,
              {
                method: "PATCH",
                headers: authHeaders,
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

        // 1) Best-effort local DB save. Optional — the deployment does NOT
        //    need Supabase to be configured. If SUPABASE_URL or the service
        //    role key are missing (self-hosted Cloudflare without a DB),
        //    we skip the save entirely and still create the HubSpot contact.
        let leadId: string | null = null;
        const hasSupabase =
          !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (hasSupabase) {
          try {
            const { supabaseAdmin } = await import(
              "@/integrations/supabase/client.server"
            );
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
              console.warn("[leads] DB insert failed (continuing):", error);
            } else {
              leadId = lead.id;
            }
          } catch (err) {
            console.warn("[leads] DB save skipped:", err);
          }
        }

        // 2) Sync to HubSpot directly. This is the primary side effect and
        //    the source of truth for the customer's request.
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

        // 3) Best-effort follow-ups if Supabase is available. Never block.
        if (hasSupabase && leadId) {
          try {
            const { supabaseAdmin } = await import(
              "@/integrations/supabase/client.server"
            );
            await supabaseAdmin
              .from("leads")
              .update({
                hubspot_contact_id: hs.id,
                crm_synced: hs.id !== null,
                crm_error: hs.error,
              })
              .eq("id", leadId);

            const { error: emailError } = await supabaseAdmin.rpc(
              "enqueue_email" as never,
              {
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
                  idempotency_key: `lead-${leadId}`,
                },
              } as never,
            );
            if (!emailError) {
              await supabaseAdmin
                .from("leads")
                .update({ email_sent: true })
                .eq("id", leadId);
            }
          } catch (err) {
            console.warn("[leads] post-HubSpot follow-ups skipped:", err);
          }
        }

        // If HubSpot failed AND we had nowhere to persist locally, surface
        // an error so the caller retries — otherwise return success.
        if (!hs.id && !leadId) {
          return Response.json(
            { error: hs.error ?? "HubSpot sync failed", code: "crm_unavailable" },
            { status: 502 },
          );
        }

        return Response.json({
          ok: true,
          id: leadId ?? hs.id,
          crmSynced: hs.id !== null,
        });
      },
    },
  },
});