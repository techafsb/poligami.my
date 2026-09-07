import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || (await req.json().catch(() => ({}))).token;
  if (!token) return json({ error: "Token diperlukan." }, 400);

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return json({ verified: false, local: true });

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data, error } = await supabase
    .from("pending_registrations")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return json({ error: "Pautan tidak sah." }, 400);
  if (new Date(data.expires_at).getTime() < Date.now()) return json({ error: "Pautan telah tamat tempoh." }, 400);

  await supabase.from("pending_registrations").update({ verified: true }).eq("token", token);
  return json({ verified: true, email: data.email });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
