import nodemailer, { Transporter } from "nodemailer";
import IEmailService from "../interfaces/emailService";
import { NodemailerConfig } from "../../types";
import Logger from "../../utilities/logger";

class EmailService implements IEmailService {
  transporter: Transporter;

  constructor(nodemailerConfig: NodemailerConfig) {
    this.transporter = nodemailer.createTransport(nodemailerConfig);
  }

  async sendEmail(
    from: string,
    to: string,
    subject: string,
    htmlBody: string,
  ): Promise<void> {
    const mailOptions = {
      from,
      to,
      subject,
      html: htmlBody,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      Logger.error(`Failed to send email. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default EmailService;
