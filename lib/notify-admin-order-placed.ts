import { ADDRESS, BUSINESS_NAME, PHONE_NO, WEBSITE_URL } from "@/shared/data";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

export type OrderWithRelation = Prisma.OrderGetPayload<{
  include: {
    packages: true;
    user: {
      include: {
        address: true;
      };
    };
  };
}>;

export const notifyAdminOrderPlacedEmailHtml = (
  orderDetails: OrderWithRelation | null
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Received</title>
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
      background-color: #28a745;
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
    .content p {
      font-size: 16px;
      margin-bottom: 20px;
      color: #555;
    }
    .order-details {
      background-color: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      padding: 15px;
      margin-bottom: 20px;
    }
    .order-details h3 {
      margin-top: 0;
      color: #28a745;
    }
    .footer {
      background-color: #f1f1f1;
      padding: 10px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Order Received</h2>
    </div>
    <div class="content">
      <p>A new order has been placed. Here are the details:</p>
      
      <div class="order-details">
        <h3>Order Information</h3>
        <table>
          <tr>
            <th>Order ID:</th>
            <td>${orderDetails?.id}</td>
          </tr>
          <tr>
            <th>Invoice Number:</th>
            <td>${orderDetails?.invoice}</td>
          </tr>
          <tr>
            <th>Order Date:</th>
            <td>${dayjs(orderDetails?.createdAt).format(
              "DD MMMM YYYY HH:mm:ss"
            )}</td>
          </tr>
         
          <tr>
            <th>Total Price:</th>
            <td>£${orderDetails?.totalPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Payment Status:</th>
            <td>${orderDetails?.paymentStatus}</td>
          </tr>
          <tr>
            <th>Payment Method:</th>
            <td>${orderDetails?.paymentMethod}</td>
          </tr>
          <tr>
     
        </table>
      </div>

      <div class="order-details">
        <h3>Customer Information</h3>
        <table>
          <tr>
            <th>Name:</th>
            <td>${orderDetails?.user.name}
}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>${orderDetails?.user.email}</td>
          </tr>
          <tr>
            <th>Phone:</th>
            <td>${orderDetails?.user.phone || "N/A"}</td>
          </tr>
          <tr>
            <th>Address:</th>
            <td>${orderDetails?.user.address?.street}, ${
  orderDetails?.user.address?.postcode
}, ${orderDetails?.user.address?.city}</td>
          </tr>
        </table>
      </div>

      <div class="order-details">
        <h3>Ordered Services</h3>
        <table>
          <tr>
            <th>Service Name</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
          ${orderDetails?.packages
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.category}</td>
              <td>£${item.price.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </table>
      </div>

      <p>Please process this order according to our standard procedures. If you have any questions or concerns, please contact the customer support team.</p>
    </div>
    <div class="footer">
      <p>${BUSINESS_NAME} | ${PHONE_NO} | ${ADDRESS}</p>
      <p><a href="https://${WEBSITE_URL}">${WEBSITE_URL}</a></p>
    </div>
  </div>
</body>
</html>
`;
