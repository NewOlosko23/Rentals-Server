import africastalking from 'africastalking';
const at = africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});
export const sms = at.SMS;
