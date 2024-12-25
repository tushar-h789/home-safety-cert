import { ADDRESS, BUSINESS_NAME, PHONE_NO, WEBSITE_URL } from "@/shared/data";

export const placedOrderEmailHtml = (
  firstName: string,
  invoiceNumber: string
) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Order Has Been Placed</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f7f7f7;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #007BFF;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .header h2 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 20px;
        }
        .content h2 {
          font-size: 22px;
          margin-bottom: 20px;
          color: #333;
        }
        .content p {
          font-size: 16px;
          margin-bottom: 20px;
          color: #555;
        }
        .button {
          display: inline-block;
          background-color: #007BFF;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
          font-size: 16px;
        }
        .button:hover {
          background-color: #0056b3;
        }
        .footer {
          background-color: #f1f1f1;
          padding: 10px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .footer a {
          color: #007BFF;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank You for Your Order</h2>
        </div>
        <div class="content">
          <p>Dear ${firstName},</p>
          <p>We are pleased to inform you that we have received your order. Your order number is <strong>${invoiceNumber}</strong>.</p>
          <p>We will process your order promptly and keep you updated on its status.</p>
          <p>If you have any questions or concerns, feel free to contact our customer support team.</p>
          <p>Best regards,<br>${BUSINESS_NAME}</p>
        </div>
        <div class="footer">
         <p>${BUSINESS_NAME} | ${PHONE_NO} | ${ADDRESS}</p>
          <p><a href="https://${WEBSITE_URL}">${WEBSITE_URL}</a></p>
        </div>
      </div>
    </body>
    </html>  
        `;
};
