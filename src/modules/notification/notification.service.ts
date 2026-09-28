import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { getEnv } from "@/lib/env";
import { renderEmailLayout } from "../email/email.service";

export const notificationService = {
  async notifyAdmin(event: string, data: any) {
    try {
      const rules = await prisma.notificationRule.findMany({
        where: { event, active: true }
      });

      if (!rules.length) return;

      const env = getEnv();
      if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return;

      const resend = new Resend(env.RESEND_API_KEY);

      for (const rule of rules) {
        if (rule.action === "SEND_EMAIL") {
          await resend.emails.send({
            from: env.EMAIL_FROM,
            to: rule.target,
            subject: `Lighthouse Admin | Notificação: ${event}`,
            html: renderEmailLayout({
              subject: `Notificação: ${event}`,
              preview: "Um novo evento ocorreu no sistema.",
              content: `<h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#223164">Novo evento: ${event}</h1>
                        <p>Os seguintes dados foram registrados:</p>
                        <pre style="background:#f3f4f6;padding:12px;border-radius:8px;font-size:12px;overflow-x:auto;">${JSON.stringify(data, null, 2)}</pre>`
            })
          });
        }
      }
    } catch (e) {
      console.error("Failed to execute notification rules", e);
    }
  }
};
