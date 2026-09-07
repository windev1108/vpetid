import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

export interface PetLocationShareEmailData {
  petName: string;
  petCode: string;
  latitude: number;
  longitude: number;
  message?: string;
  finderName?: string;
  finderPhone?: string;
}

function buildPetLocationShareHtml(data: PetLocationShareEmailData, siteUrl: string): string {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`;

  const finderBlock = data.finderName || data.finderPhone
    ? `<table cellpadding="0" cellspacing="0" style="margin:0 0 16px;width:100%;">
             ${data.finderName
      ? `<tr>
                     <td style="padding:2px 0;font-size:13px;color:#717171;width:90px;">Người tìm thấy</td>
                     <td style="padding:2px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${data.finderName}</td>
                   </tr>`
      : ''
    }
             ${data.finderPhone
      ? `<tr>
                     <td style="padding:2px 0;font-size:13px;color:#717171;">Điện thoại</td>
                     <td style="padding:2px 0;font-size:14px;">
                       <a href="tel:${data.finderPhone.replace(/[^\d+]/g, '')}" style="color:#1a3c34;text-decoration:underline;font-weight:600;">
                         📞 ${data.finderPhone}
                       </a>
                     </td>
                   </tr>`
      : ''
    }
           </table>`
    : '';

  const messageBlock = data.message
    ? `<p style="margin:0 0 20px;font-size:14px;color:#1a1a1a;line-height:1.6;white-space:pre-line;">
             &ldquo;${data.message}&rdquo;
           </p>`
    : '';

  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:#ba1a1a;padding:28px 40px;text-align:center;">
            <span style="color:#ffffff;font-size:22px;font-weight:700;">VPetId</span>
            <span style="color:#ffdad6;font-size:13px;display:block;margin-top:4px;">
              📍 Có người vừa chia sẻ vị trí thú cưng của bạn
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px 8px;">
            <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1a1a1a;">
              ${data.petName} (${data.petCode})
            </h1>
            ${finderBlock}
            ${messageBlock}
            <div style="text-align:center;margin:24px 0 8px;">
              <a href="${mapsUrl}" target="_blank"
                 style="display:inline-block;background:#ba1a1a;color:#ffffff;text-decoration:none;
                        padding:14px 32px;border-radius:9999px;font-size:15px;font-weight:600;">
                Xem vị trí trên Google Maps
              </a>
            </div>
            <p style="margin:24px 0 0;font-size:12px;color:#717171;text-align:center;">
              Toạ độ: ${data.latitude}, ${data.longitude}
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 32px;border-top:1px solid #ededed;">
            <p style="margin:0;font-size:12px;color:#717171;text-align:center;line-height:1.6;">
              Email này được gửi tự động vì bạn là thành viên quản lý hồ sơ pet trên VPetId.<br>
              <a href="${siteUrl}" style="color:#1a3c34;text-decoration:underline;">vpetid.vn</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    private readonly config: ConfigService,
  ) { }

  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: this.config.getOrThrow<string>('SMTP_HOST'),
        port: Number(this.config.get('SMTP_PORT') ?? 587),
        secure: this.config.get('SMTP_PORT') === '465',
        auth: {
          user: this.config.getOrThrow<string>('SMTP_USER'),
          pass: this.config.getOrThrow<string>('SMTP_PASS'),
        },
      });
    }
    return this.transporter;
  }
  async sendPetLocationShared(
    recipientEmails: string[],
    data: PetLocationShareEmailData,
  ): Promise<void> {
    if (recipientEmails.length === 0) {
      this.logger.warn(
        `No membership emails found for pet ${data.petCode} — skip sending location-shared email`,
      );
      return;
    }

    const from = this.config.get<string>('SMTP_FROM') ?? 'VPetId <noreply@vpetid.vn>';
    const siteUrl = this.config.get<string>('APP_SITE_URL') ?? 'https://vpetid.vn';

    try {
      await this.getTransporter().sendMail({
        from,
        to: from,
        bcc: recipientEmails.join(','),
        subject: `📍 Có người chia sẻ vị trí của ${data.petName}`,
        html: buildPetLocationShareHtml(data, siteUrl),
      });
    } catch (err) {
      this.logger.error(
        `Failed to send pet-location-shared email: ${(err as Error).message}`,
      );
    }
  }
}

