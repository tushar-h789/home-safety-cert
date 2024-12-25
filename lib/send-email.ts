import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY as string,
  process.env.MAILJET_API_SECRET as string
);

interface EmailOptions {
  fromName: string;
  fromEmail: string;
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    ContentType: string;
    Filename: string;
    Base64Content: string;
  }>;
}

interface MailjetResponse {
  body: {
    Messages: Array<{
      To: Array<{
        Email: string;
        MessageID: string;
      }>;
    }>;
  };
}

export async function sendEmail({
  fromName,
  fromEmail,
  to,
  subject,
  html,
  attachments,
}: EmailOptions): Promise<void> {
  try {
    const request: MailjetResponse = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: fromName,
            },
            To: [
              {
                Email: to,
              },
            ],
            Subject: subject,
            HTMLPart: html,
            Attachments: attachments,
          },
        ],
      });

    console.log(
      `Email sent to ${to}: ${request.body.Messages[0].To[0].MessageID}`
    );
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error(
      "We're sorry, but it looks like something went wrong on our end"
    );
  }
}
