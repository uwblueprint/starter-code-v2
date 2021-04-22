import nodemailer from "nodemailer";
import NODEMAILER_CONFIG from "./nodemailer.config";
import IEmailService from "../interfaces/emailService";
import Logger from "../../utilities/logger";

const EMAIL_FROM = `"Display Name" <address@email.org>`;
const transporter = nodemailer.createTransport(NODEMAILER_CONFIG);

class EmailService implements IEmailService {
  /* eslint-disable class-methods-use-this */
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: EMAIL_FROM,
      to,
      subject,
      html,
    };

    try {
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      Logger.error(`Failed to send email. Reason = ${error.message}`);
      return Promise.reject(error);
    }
  }
}

export default EmailService;
