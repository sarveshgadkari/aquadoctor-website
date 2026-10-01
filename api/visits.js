// Visitor counter: Vercel serverless function.
// Stores one number in Upstash Redis through its REST API (plain fetch, no npm packages).
//   POST /api/visits  -> adds one visit and returns {"total": N}
//   GET  /api/visits  -> returns the current total without changing it
// Needs two environment variables in Vercel: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
// Without them it answers 503 and the website simply hides the counter line.

const KEY = "ads-visits";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "method not allowed" });
  }

  const base = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!base || !token) return send(res, 503, { error: "counter not configured" });

  const command = req.method === "POST" ? "incr" : "get";
  try {
    const r = await fetch(base.replace(/\/+$/, "") + "/" + command + "/" + encodeURIComponent(KEY), {
      headers: { Authorization: "Bearer " + token }
    });
    if (!r.ok) throw new Error("Upstash responded " + r.status);
    const data = await r.json();
    const total = Number(data && data.result) || 0;
    return send(res, 200, { total: total });
  } catch (err) {
    return send(res, 502, { error: "counter unavailable" });
  }
}
