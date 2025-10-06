
'use server';

/**
 * @fileOverview A flow for sending emails using Nodemailer.
 *
 * - sendEmail - A function that handles sending emails.
 * - SendEmailInput - The input type for the sendEmail function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import * as nodemailer from "nodemailer";
import smtpConfig from "@/lib/data/smtp-config.json";
import siteConfig from "@/lib/data/site-config.json";

export const SendEmailInputSchema = z.object({
  name: z.string().describe("The name of the person sending the message."),
  from: z.string().email().describe("The email address of the sender."),
  subject: z.string().describe("The subject of the email."),
  message: z.string().describe("The content of the message."),
});

export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

export async function sendEmail(input: SendEmailInput): Promise<{ success: boolean; message: string }> {
  return sendEmailFlow(input);
}

const sendEmailFlow = ai.defineFlow(
  {
    name: "sendEmailFlow",
    inputSchema: SendEmailInputSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
  },
  async (input) => {
    
    if (!smtpConfig.host || !smtpConfig.user || !smtpConfig.pass) {
        console.error("SMTP configuration is incomplete.");
        return { success: false, message: "Server is not configured to send emails." };
    }

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.port === 465, // true for 465, false for other ports
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    });
    
    const mailOptions = {
      from: `"${siteConfig.siteName}" <${smtpConfig.sender || smtpConfig.user}>`, // sender address
      to: siteConfig.contact.email, // list of receivers from site config
      replyTo: input.from,
      subject: `New Contact Form Message: ${input.subject}`, // Subject line
      html: `
        <p>You have received a new message from the contact form on ${siteConfig.siteName}.</p>
        <hr>
        <p><b>Name:</b> ${input.name}</p>
        <p><b>Email:</b> ${input.from}</p>
        <hr>
        <h3>Message:</h3>
        <p>${input.message.replace(/\n/g, "<br>")}</p>
        <hr>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true, message: "Email sent successfully." };
    } catch (error: any) {
      console.error("Error sending email:", error);
      return { success: false, message: `Failed to send email: ${error.message}` };
    }
  }
);
