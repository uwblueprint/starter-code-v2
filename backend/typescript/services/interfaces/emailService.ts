interface IEmailService {
  /**
   * Send email
   * @param to recipient's email
   * @param subject email subject
   * @param html email body as html
   * @throws Error if email was not sent successfully
   */
  sendEmail(to: string, subject: string, html: string): Promise<void>;
}

export default IEmailService;
