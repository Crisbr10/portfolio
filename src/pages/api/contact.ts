import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Opt out of static prerendering — this route is server-rendered
export const prerender = false;

// ─── Config ───────────────────────────────────────────────────
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const TIMING_THRESHOLD_MS = 3000;
const ALLOWED_ORIGINS = [
  'https://cristhianborges.dev',
  'https://crisbr.es',
  'https://www.crisbr.es',
  'http://localhost:4321',
];

// ─── Rate limit store ─────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

// ─── Helpers ──────────────────────────────────────────────────
function json(body: Record<string, unknown>, status: number, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function withRateLimit(response: Response, remaining: number): Response {
  const headers = new Headers(response.headers);
  headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
  headers.set('X-RateLimit-Remaining', String(remaining));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function success(): Response {
  return json({ success: true }, 200);
}

function error(status: number, message: string): Response {
  return json({ error: message }, status);
}

// ─── Security checks ──────────────────────────────────────────

function checkMethod(request: Request): Response | null {
  if (request.method !== 'POST') {
    return error(405, 'Method not allowed.');
  }
  return null;
}

function checkOrigin(request: Request): Response | null {
  const origin = request.headers.get('Origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return error(403, 'Forbidden.');
  }
  return null;
}

interface RateLimitResult {
  blocked: Response | null;
  remaining: number;
}

function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  // Evict stale entries
  for (const [key, val] of rateLimitMap) {
    if (now - val.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { blocked: null, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      blocked: json(
        { error: 'Too many requests. Please try again later.' },
        429,
        {
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': '0',
        }
      ),
      remaining: 0,
    };
  }

  entry.count++;
  return { blocked: null, remaining: RATE_LIMIT_MAX - entry.count };
}

function checkHoneypot(body: Record<string, unknown>): Response | null {
  if (body.website && String(body.website).length > 0) {
    return success(); // Silent reject
  }
  return null;
}

function checkTiming(body: Record<string, unknown>): Response | null {
  const tLoad = Number(body.t_load);
  if (tLoad && !isNaN(tLoad) && Date.now() - tLoad < TIMING_THRESHOLD_MS) {
    return success(); // Silent reject
  }
  return null;
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

function checkHeaderInjection(value: string): boolean {
  return value.includes('\r') || value.includes('\n') || value.includes('\0');
}

function validateInput(body: Record<string, unknown>): Response | null {
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const message = String(body.message ?? '').trim();

  // Required checks
  if (!name) return error(400, 'Name is required.');
  if (!email) return error(400, 'Email is required.');
  if (!message) return error(400, 'Message is required.');

  // Header injection
  if (checkHeaderInjection(name) || checkHeaderInjection(email)) {
    return error(400, 'Invalid input detected.');
  }

  // Name: 1-100 chars, allowed pattern
  if (name.length > 100) {
    return error(400, 'Name must be at most 100 characters.');
  }
  const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  if (!namePattern.test(name)) {
    return error(400, 'Name contains invalid characters.');
  }

  // Email: max 254 chars, valid format
  if (email.length > 254) {
    return error(400, 'Email is too long.');
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return error(400, 'Invalid email address.');
  }

  // Message: strip HTML, check length, no null bytes
  const cleanMessage = stripHtml(message);
  if (cleanMessage.includes('\0')) {
    return error(400, 'Invalid input detected.');
  }
  if (cleanMessage.length < 10) {
    return error(400, 'Message must be at least 10 characters.');
  }
  if (cleanMessage.length > 5000) {
    return error(400, 'Message must be at most 5000 characters.');
  }

  return null; // All valid
}

// ─── Email ────────────────────────────────────────────────────

async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 4).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sendEmail(
  name: string,
  email: string,
  message: string,
  ip: string
): Promise<Response | null> {
  const resend = new Resend(import.meta.env.RESEND_API_KEY);
  const timestamp = new Date().toISOString();
  const ipHash = await hashIp(ip);
  const cleanMessage = stripHtml(message.trim());

  const textBody = [
    'Nuevo mensaje de contacto',
    '─────────────────────────',
    `Nombre: ${name}`,
    `Email: ${email}`,
    `Fecha: ${timestamp}`,
    `IP: ${ipHash}`,
    '',
    'Mensaje:',
    cleanMessage,
  ].join('\n');

  const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0e17;font-family:'Space Grotesk',sans-serif;color:#eef2fa;">
  <div style="max-width:520px;margin:32px auto;padding:32px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;">
    <h2 style="margin:0 0 20px;font-size:18px;color:#06b6d4;">Nuevo mensaje de contacto</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 12px;color:#637393;white-space:nowrap;vertical-align:top;">Nombre</td><td style="padding:8px 12px;color:#eef2fa;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px 12px;color:#637393;white-space:nowrap;vertical-align:top;">Email</td><td style="padding:8px 12px;"><a href="mailto:${escapeHtml(email)}" style="color:#06b6d4;text-decoration:none;">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:8px 12px;color:#637393;white-space:nowrap;vertical-align:top;">Fecha</td><td style="padding:8px 12px;color:#eef2fa;">${timestamp}</td></tr>
      <tr><td style="padding:8px 12px;color:#637393;white-space:nowrap;vertical-align:top;">IP</td><td style="padding:8px 12px;color:#eef2fa;">${ipHash}</td></tr>
    </table>
    <div style="margin-top:20px;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.07);">
      <p style="margin:0 0 8px;font-size:11px;color:#637393;text-transform:uppercase;letter-spacing:0.1em;">Mensaje</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#eef2fa;white-space:pre-wrap;">${escapeHtml(cleanMessage)}</p>
    </div>
  </div>
</body>
</html>`;

  const { data, error: sendError } = await resend.emails.send({
    from: 'Portfolio <web@crisbr.es>',
    to: ['cristhian@crisbr.es'],
    replyTo: [email],
    subject: `Portfolio Contact: ${name}`,
    text: textBody,
    html: htmlBody,
    tags: [{ name: 'source', value: 'contact-form' }],
  });

  if (sendError) {
    console.error('Resend error:', sendError.message);
    return error(500, 'Failed to send message. Please try again later.');
  }

  return null; // Success
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Handler ──────────────────────────────────────────────────

export const POST: APIRoute = async ({ request }) => {
  // 1. Method check
  const methodErr = checkMethod(request);
  if (methodErr) return methodErr;

  // 2. Origin / CSRF
  const originErr = checkOrigin(request);
  if (originErr) return originErr;

  // 3. Rate limit
  const ip = getClientIp(request);
  const rateResult = checkRateLimit(ip);
  if (rateResult.blocked) return rateResult.blocked;
  const { remaining } = rateResult;

  // 4. Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return withRateLimit(error(400, 'Invalid request body.'), remaining);
  }

  // 5. Honeypot
  const honeypotErr = checkHoneypot(body);
  if (honeypotErr) return withRateLimit(honeypotErr, remaining);

  // 6. Timing
  const timingErr = checkTiming(body);
  if (timingErr) return withRateLimit(timingErr, remaining);

  // 7. Input validation
  const validationErr = validateInput(body);
  if (validationErr) return withRateLimit(validationErr, remaining);

  // 8. Send email
  const name = String(body.name).trim();
  const email = String(body.email).trim();
  const message = String(body.message).trim();

  const emailErr = await sendEmail(name, email, message, ip);
  if (emailErr) return withRateLimit(emailErr, remaining);

  return withRateLimit(success(), remaining);
};
