// QRelay API — Cloudflare Worker
// Endpoints:
//   POST /api/send  { kind:'file'|'text', text?, files?:[{name,size,type}] } -> { code, expiresIn, uploads? }
//   GET  /api/info?code=XXXXXX                                              -> { kind, text? , files?, createdAt, expiresAt }
//
// Storage:
//   - Workers KV (binding: CODES) holds the code -> session metadata, with a TTL so it auto-expires.
//   - R2 (bucket set in R2_BUCKET_NAME) holds the actual file bytes. The browser uploads/downloads
//     directly to/from R2 using short-lived presigned URLs, so large files never pass through the Worker
//     (Workers on the Free plan reject request bodies over 100MB).

import { AwsClient } from "aws4fetch";

const CODE_TTL_SECONDS = 60 * 60 * 24; // code + files available for 24h
const UPLOAD_URL_TTL_SECONDS = 60 * 60 * 6; // upload link valid for 6h (covers slow uploads)
const DOWNLOAD_URL_TTL_SECONDS = 60 * 60; // download link valid for 1h, re-issued on every /api/info call
const MAX_FILE_SIZE = 1288490188; // 1.2 GiB
const MAX_FILES = 50;
const MAX_TEXT_LENGTH = 200000;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() },
  });
}

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function sanitizeName(name) {
  return String(name).replace(/[\/\\?%*:|"<>]/g, "_").slice(0, 200) || "file";
}

function r2Client(env) {
  return new AwsClient({
    service: "s3",
    region: "auto",
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  });
}

function r2ObjectUrl(env, key) {
  return `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET_NAME}/${key}`;
}

async function presign(env, key, method, ttlSeconds) {
  const client = r2Client(env);
  const url = new URL(r2ObjectUrl(env, key));
  url.searchParams.set("X-Amz-Expires", String(ttlSeconds));
  const signed = await client.sign(new Request(url, { method }), {
    aws: { signQuery: true },
  });
  return signed.url;
}

async function handleCreate(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  if (body.kind !== "file" && body.kind !== "text") {
    return json({ error: "invalid_kind" }, 400);
  }

  let code = null;
  for (let i = 0; i < 5 && !code; i++) {
    const candidate = randomCode();
    const existing = await env.CODES.get(candidate);
    if (!existing) code = candidate;
  }
  if (!code) return json({ error: "code_generation_failed" }, 500);

  const now = Date.now();
  const expiresAt = now + CODE_TTL_SECONDS * 1000;

  if (body.kind === "text") {
    const text = String(body.text || "");
    if (!text) return json({ error: "empty_text" }, 400);
    if (text.length > MAX_TEXT_LENGTH) return json({ error: "text_too_long" }, 400);

    await env.CODES.put(
      code,
      JSON.stringify({ kind: "text", text, createdAt: now, expiresAt }),
      { expirationTtl: CODE_TTL_SECONDS }
    );
    return json({ code, expiresIn: CODE_TTL_SECONDS }, 200);
  }

  const files = Array.isArray(body.files) ? body.files : [];
  if (files.length === 0) return json({ error: "no_files" }, 400);
  if (files.length > MAX_FILES) return json({ error: "too_many_files" }, 400);

  const meta = [];
  const uploads = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i] || {};
    const size = Number(f.size) || 0;
    if (!f.name || size <= 0) return json({ error: "invalid_file_entry" }, 400);
    if (size > MAX_FILE_SIZE) return json({ error: "file_too_large", file: f.name }, 400);

    const safeName = sanitizeName(f.name);
    const key = `${code}/${i}-${safeName}`;
    const uploadUrl = await presign(env, key, "PUT", UPLOAD_URL_TTL_SECONDS);
    meta.push({ name: safeName, size, type: f.type || "application/octet-stream", key });
    uploads.push({ name: f.name, url: uploadUrl });
  }

  await env.CODES.put(
    code,
    JSON.stringify({ kind: "file", files: meta, createdAt: now, expiresAt }),
    { expirationTtl: CODE_TTL_SECONDS }
  );

  return json({ code, expiresIn: CODE_TTL_SECONDS, uploads }, 200);
}

async function handleInfo(request, env) {
  const url = new URL(request.url);
  const code = (url.searchParams.get("code") || "").trim();
  if (!/^\d{6}$/.test(code)) return json({ error: "invalid_code" }, 400);

  const raw = await env.CODES.get(code);
  if (!raw) return json({ error: "not_found" }, 404);

  const data = JSON.parse(raw);

  if (data.kind === "text") {
    return json(
      { kind: "text", text: data.text, createdAt: data.createdAt, expiresAt: data.expiresAt },
      200
    );
  }

  const files = [];
  for (const f of data.files) {
    const downloadUrl = await presign(env, f.key, "GET", DOWNLOAD_URL_TTL_SECONDS);
    files.push({ name: f.name, size: f.size, type: f.type, url: downloadUrl });
  }

  return json(
    { kind: "file", files, createdAt: data.createdAt, expiresAt: data.expiresAt },
    200
  );
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    const url = new URL(request.url);

    try {
      if (request.method === "POST" && url.pathname === "/api/send") {
        return await handleCreate(request, env);
      }
      if (request.method === "GET" && url.pathname === "/api/info") {
        return await handleInfo(request, env);
      }
      if (url.pathname === "/api/health") {
        return json({ ok: true }, 200);
      }
      return json({ error: "not_found" }, 404);
    } catch (err) {
      return json({ error: "server_error", message: String((err && err.message) || err) }, 500);
    }
  },
};
