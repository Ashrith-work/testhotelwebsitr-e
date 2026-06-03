// SMTP email sending via nodemailer, configured entirely through env vars so it
// works with any provider (Gmail/Workspace, SendGrid, Mailgun, Resend SMTP…).
//
// Required env vars to actually send:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
// If they are not all set, sending is skipped (logged, not an error) so the
// booking flow keeps working before credentials are added.
import nodemailer from "nodemailer";

export type SendResult = { sent: boolean; skipped?: string; error?: string };

let cachedTransport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
  if (cachedTransport) return cachedTransport;

  const port = Number(SMTP_PORT);
  cachedTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return cachedTransport;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> {
  const transport = getTransport();
  if (!transport) {
    console.warn(
      `[email] SMTP not configured — skipped sending "${opts.subject}" to ${opts.to}. ` +
        "Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/MAIL_FROM in .env to enable.",
    );
    return { sent: false, skipped: "smtp_not_configured" };
  }

  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    return { sent: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : "unknown error";
    console.error(`[email] Failed to send "${opts.subject}" to ${opts.to}:`, error);
    return { sent: false, error };
  }
}
