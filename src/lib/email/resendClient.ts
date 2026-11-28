import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Shape Radar <notifications@shaperadar.com>";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendTransactionalEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.info(`[Email Simulator] RESEND_API_KEY not configured. Transactional email to <${to}> logged: "${subject}"`);
    return { success: true, mocked: true, messageId: `mock_${Date.now()}` };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error("[Resend Exception]:", err);
    return { success: false, error: err.message };
  }
}
