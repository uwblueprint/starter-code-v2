interface IEmailService {
  /**
   * Send email
   * @param from sender's email, formatted as '"Display Name" <address@email.com>'
   * @param to recipient's email
   * @param subject email subject
   * @param htmlBody email body as html
   * @throws Error if email was not sent successfully
   */
  sendEmail(
    from: string,
    to: string,
    subject: string,
    htmlBody: string,
  ): Promise<void>;
}

export default IEmailService;
