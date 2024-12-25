import { ADDRESS, WEBSITE_URL } from "@/shared/data";

export const adminNotificationEmailSubject = "New Contact Form Submission";

export const contactAdminNotificationEmailHtml = (
  name: string,
  email: string,
  subject: string,
  message: string,
  phone: string
) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
<div style="background-color: #267ECE; color: white; padding: 20px; text-align: center;">
  <img src="https://via.placeholder.com/150x50?text=Logo" alt="Company Logo" style="margin-bottom: 20px;">
  <h2>New Contact Form Submission</h2>
</div>
<div style="padding: 20px;">
  <p style="font-size: 18px;">You have a new contact form submission:</p>
  <div style="margin-top: 20px; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
    <p style="font-size: 16px; font-weight: bold;">Name:</p>
    <p style="font-size: 16px; margin-left: 20px;">${name}</p>
    <p style="font-size: 16px; font-weight: bold;">Email:</p>
    <p style="font-size: 16px; margin-left: 20px;">${email}</p>
      <p style="font-size: 16px; font-weight: bold;">Phone:</p>
    <p style="font-size: 16px; margin-left: 20px;">${phone}</p>
    <p style="font-size: 16px; font-weight: bold;">Subject:</p>
    <p style="font-size: 16px; margin-left: 20px;">${subject}</p>
    <p style="font-size: 16px; font-weight: bold;">Message:</p>
    <p style="font-size: 16px; margin-left: 20px;">${message}</p>
  </div>
</div>
<div style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #666;">
  <p>Home Safety Cert Limited, ${ADDRESS}</p>
  <p><a href="https://${WEBSITE_URL}" style="color: #267ECE;">${WEBSITE_URL}</a></p>
</div>
</div>
`;
