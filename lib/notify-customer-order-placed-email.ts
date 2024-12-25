import { ADDRESS, BUSINESS_NAME, PHONE_NO, WEBSITE_URL } from "@/shared/data";
import { OrderWithRelation } from "@/types/order";
import dayjs from "dayjs";

export const notifyUserOrderPlacedEmailHtml = (
  orderDetails: OrderWithRelation | null
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Placed</title>
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
    .header img {
      margin-bottom: 20px;
    }
    .content {
      padding: 20px;
    }
    .content p {
      font-size: 16px;
      margin-bottom: 20px;
      color: #555;
    }
    .message-box {
      margin-top: 20px;
      padding: 10px;
      background-color: #f9f9f9;
      border-radius: 5px;
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
    ul {
      list-style: none;
      padding: 0;
    }
    ul li {
      padding: 5px 0;
    }
    @media (max-width: 600px) {
      .container {
        width: 100%;
        margin: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Order Placed Successfully</h2>
    </div>
    <div class="content">
      <p>Dear ${orderDetails?.user.name},</p>
      <p>
        Thank you for placing your order with us! We have received your request and are currently processing it. Below are the details of your order:
      </p>
      <div class="message-box">
        <p style="font-weight: bold;">Order Summary:</p>
        <p style="margin-left: 20px;">
          <strong>Order Number:</strong> ${orderDetails?.id}<br>
          <strong>Address:</strong> ${orderDetails?.user.address?.street}, ${
  orderDetails?.user.address?.postcode
}, ${orderDetails?.user.address?.city}<br>
          <strong>Phone:</strong> ${orderDetails?.user.phone}<br>
          <strong>Email:</strong> ${orderDetails?.user.email}<br>
          <strong>Scheduled:</strong> ${orderDetails?.inspectionTime}, ${dayjs(
  orderDetails?.date
).format("DD MMMM YYYY")}
        </p>
        <p style="font-weight: bold;">Services Ordered:</p>
        <ul style="margin-left: 20px;">
          ${orderDetails?.packages
            .map(
              (item) => `<li>${item.name} - ${item.category} ${item.price}</li>`
            )
            .join("")}
        </ul>
      </div>
      <p style="margin-top: 20px;">
        We will notify you once your order is complete. If you have any questions or need further assistance, please don't hesitate to contact us.
      </p>
      <p>
        Thank you for choosing ${BUSINESS_NAME}!<br/>
        <strong>The ${BUSINESS_NAME} Team</strong>
      </p>
    </div>
    <div class="footer">
    <p>${BUSINESS_NAME} | ${PHONE_NO} | ${ADDRESS}</p>
      <p><a href="https://${WEBSITE_URL}">${WEBSITE_URL}</a></p>
    </div>
  </div>
</body>
</html>
`;
