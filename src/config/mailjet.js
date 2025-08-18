import Mailjet from "node-mailjet";

export const mailjet = new Mailjet({
  apiKey: process.env.MJ_API_KEY,
  apiSecret: process.env.MJ_API_SECRET,
});
export async function sendMail({ toEmail, toName, subject, html }) {
  await mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.MJ_SENDER_EMAIL,
          Name: process.env.MJ_SENDER_NAME,
        },
        To: [{ Email: toEmail, Name: toName || toEmail }],
        Subject: subject,
        HTMLPart: html,
      },
    ],
  });
}
