import "@supabase/functions-js/edge-runtime.d.ts";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const OWNER_EMAIL = "hello@fztravelconsulting.com";
const OWNER_NAME = "FZ Travel Consulting";

interface ContactRecord {
  id: string;
  created_at: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string | null;
  tipo_viaggio: string | null;
  messaggio: string | null;
  lingua: string;
  pagina: string | null;
}

interface WebhookPayload {
  type: "INSERT";
  table: string;
  schema: string;
  record: ContactRecord;
  old_record: null;
}

const travelTypeLabels: Record<string, { it: string; en: string }> = {
  coppia: { it: "Coppia", en: "Couple" },
  famiglia: { it: "Famiglia", en: "Family" },
  amici: { it: "Amici", en: "Friends" },
  solitario: { it: "Solitario", en: "Solo" },
  "pet-friendly": { it: "Pet-Friendly", en: "Pet-Friendly" },
};

function buildOwnerEmail(contact: ContactRecord): object {
  const travelLabel =
    contact.tipo_viaggio
      ? travelTypeLabels[contact.tipo_viaggio]?.it ?? contact.tipo_viaggio
      : "Non specificato";

  const date = new Date(contact.created_at).toLocaleString("it-IT", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Rome",
  });

  return {
    sender: { name: OWNER_NAME, email: OWNER_EMAIL },
    to: [{ email: OWNER_EMAIL, name: OWNER_NAME }],
    subject: `Nuova richiesta di consulenza da ${contact.nome} ${contact.cognome}`,
    htmlContent: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1C1C1E; padding: 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #C8A96E; font-size: 20px; margin: 0;">Nuova richiesta di consulenza</h1>
          <p style="color: #999; font-size: 13px; margin: 8px 0 0;">${date}</p>
        </div>
        <div style="background: #f9f8f6; padding: 32px; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; color: #888; width: 140px;">Nome</td>
              <td style="padding: 10px 0; font-weight: 600;">${contact.nome} ${contact.cognome}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888;">Email</td>
              <td style="padding: 10px 0;"><a href="mailto:${contact.email}" style="color: #C8A96E;">${contact.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888;">Telefono</td>
              <td style="padding: 10px 0;">${contact.telefono ?? "—"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888;">Tipo viaggio</td>
              <td style="padding: 10px 0;">${travelLabel}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888;">Lingua sito</td>
              <td style="padding: 10px 0;">${contact.lingua?.toUpperCase() ?? "IT"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888;">Pagina</td>
              <td style="padding: 10px 0;">${contact.pagina ?? "/"}</td>
            </tr>
          </table>
          ${
            contact.messaggio
              ? `<div style="margin-top: 20px; padding: 16px; background: #fff; border-radius: 8px; border-left: 3px solid #C8A96E;">
                  <p style="color: #888; font-size: 12px; margin: 0 0 8px;">Messaggio</p>
                  <p style="margin: 0; font-size: 14px; line-height: 1.6;">${contact.messaggio}</p>
                </div>`
              : ""
          }
          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${contact.email}?subject=Re: Consulenza di viaggio" style="display: inline-block; background: #C8A96E; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">Rispondi a ${contact.nome}</a>
          </div>
        </div>
      </div>
    `,
  };
}

function buildConfirmationEmail(contact: ContactRecord): object {
  const isEN = contact.lingua === "en";

  const subject = isEN
    ? "Thank you for your request — FZ Travel Consulting"
    : "Grazie per la tua richiesta — FZ Travel Consulting";

  const greeting = isEN
    ? `Dear ${contact.nome},`
    : `Ciao ${contact.nome},`;

  const body = isEN
    ? `thank you for contacting me! I received your request and I'll get back to you <strong>within 24 hours</strong> to discuss your travel plans together.`
    : `grazie per avermi contattato! Ho ricevuto la tua richiesta e ti ricontatterò <strong>entro 24 ore</strong> per discutere insieme del tuo progetto di viaggio.`;

  const closing = isEN
    ? "In the meantime, feel free to follow me on my social channels for travel tips and inspiration."
    : "Nel frattempo, puoi seguirmi sui miei canali social per consigli e ispirazioni di viaggio.";

  const signoff = isEN ? "See you soon," : "A presto,";

  return {
    sender: { name: OWNER_NAME, email: OWNER_EMAIL },
    to: [{ email: contact.email, name: `${contact.nome} ${contact.cognome}` }],
    replyTo: { email: OWNER_EMAIL, name: OWNER_NAME },
    subject,
    htmlContent: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1C1C1E; padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #C8A96E; font-size: 22px; margin: 0; font-weight: 300; letter-spacing: 2px;">FZ TRAVEL CONSULTING</h1>
        </div>
        <div style="background: #f9f8f6; padding: 40px 32px; border-radius: 0 0 12px 12px;">
          <p style="font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
            ${greeting}
          </p>
          <p style="font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
            ${body}
          </p>
          <p style="font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
            ${closing}
          </p>
          <p style="font-size: 15px; line-height: 1.7; margin: 0;">
            ${signoff}<br/>
            <strong style="color: #C8A96E;">FZ Travel Consulting</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
          <p style="margin: 0;">FZ Travel Consulting</p>
          <p style="margin: 4px 0;"><a href="mailto:${OWNER_EMAIL}" style="color: #C8A96E; text-decoration: none;">${OWNER_EMAIL}</a></p>
        </div>
      </div>
    `,
  };
}

async function sendBrevoEmail(
  apiKey: string,
  emailPayload: object
): Promise<{ ok: boolean; status: number; body: string }> {
  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(emailPayload),
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

Deno.serve(async (req) => {
  // Only accept POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
  if (!BREVO_API_KEY) {
    console.error("Missing BREVO_API_KEY secret");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const payload: WebhookPayload = await req.json();
    const contact = payload.record;

    if (!contact || !contact.email) {
      return new Response(
        JSON.stringify({ error: "Invalid payload: missing contact data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing contact: ${contact.nome} ${contact.cognome} <${contact.email}>`);

    // Send both emails in parallel
    const [ownerResult, confirmResult] = await Promise.all([
      sendBrevoEmail(BREVO_API_KEY, buildOwnerEmail(contact)),
      sendBrevoEmail(BREVO_API_KEY, buildConfirmationEmail(contact)),
    ]);

    console.log(`Owner email: ${ownerResult.status} - ${ownerResult.body}`);
    console.log(`Confirmation email: ${confirmResult.status} - ${confirmResult.body}`);

    if (!ownerResult.ok || !confirmResult.ok) {
      const errors = [];
      if (!ownerResult.ok) errors.push(`owner: ${ownerResult.body}`);
      if (!confirmResult.ok) errors.push(`confirmation: ${confirmResult.body}`);
      console.error("Brevo errors:", errors.join("; "));
      return new Response(
        JSON.stringify({ error: "Partial email failure", details: errors }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Both emails sent" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge Function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
