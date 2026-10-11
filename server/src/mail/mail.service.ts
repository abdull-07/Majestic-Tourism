import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
for (const key of required) {
    if (!process.env[key]) throw new Error(`${key} must be set in .env`);
}

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT as string, 10),
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendVerificationEmail(to: string, fullName: string, token: string) {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to,
                subject: 'Verify your email — Majestic Tourism',
                html: `
          <p>Hi ${fullName},</p>
          <p>Thanks for registering with Majestic Tourism. Please verify your email address:</p>
          <p><a href="${verifyUrl}">Verify Email</a></p>
          <p>This link expires in 24 hours.</p>
        `,
            });
            this.logger.log(`Verification email sent to ${to}`);
        } catch (err) {
            // Don't fail registration/resend just because the mail provider hiccuped —
            // log it loudly so it's noticed, but let the account still exist.
            this.logger.error(`Failed to send verification email to ${to}`, err);
        }
    }
}