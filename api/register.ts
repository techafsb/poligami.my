import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const { fullName, email, phone, token } = await req.json();
  if (!fullName || !email || !phone || !token) {
    return json({ error: "Maklumat tidak lengkap." }, 400);
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey) {
    const supabase = createClient(supabaseUrl, serviceKey);
    await supabase.from("pending_registrations").upsert({
      email: String(email).toLowerCase(),
      full_name: fullName,
      phone,
      token,
      verified: false,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return json({ emailSent: false });

  const origin = process.env.APP_URL || new URL(req.url).origin;
  const verifyUrl = `${origin}/?verify=${encodeURIComponent(token)}`;
  const from = process.env.RESEND_FROM || "Poligami <noreply@poligami.my>";

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: "Sahkan akaun poligami.my anda",
    html: `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:32px;color:#111">
        <p style="letter-spacing:.2em;font-size:12px;text-transform:uppercase;color:#6b7280">poligami.my</p>
        <h1 style="font-weight:normal;font-size:28px">Sahkan e-mel anda.</h1>
        <p>Assalamualaikum ${escapeHtml(fullName)},</p>
        <p>Ketik butang di bawah untuk mengesahkan akaun poligami.my anda. Pautan ini sah selama 15 minit.</p>
        <p><a href="${verifyUrl}" style="display:inline-block;background:#111;color:#fff;padding:14px 24px;border-radius:999px;text-decoration:none">Sahkan akaun</a></p>
        <p style="font-size:12px;color:#6b7280">Jika anda tidak mendaftar, abaikan e-mel ini.</p>
      </div>
    `,
  });

  if (error) return json({ emailSent: false, error: error.message }, 500);
  return json({ emailSent: true });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]!));
}
