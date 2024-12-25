import { Prisma } from "@prisma/client";
import dayjs from "dayjs"; // Assuming you are still using dayjs

import {
  BANK_ACCOUNT_NUMBER,
  BANK_SORT_CODE,
  BUSINESS_NAME,
  CONGESTION_FEE,
  PARKING_FEE,
} from "@/shared/data";

type OrderWithPackages = Prisma.OrderGetPayload<{
  include: {
    packages: true;
    user: {
      include: {
        address: true;
      };
    };
  };
}>;

export function generateInvoiceHtml(
  order: OrderWithPackages,
  cartTotal: number,
  totalPrice: number
) {
  const packageRows = order.packages
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td class="amount-column">£${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const congestionFee = order.isCongestionZone
    ? `<p><strong>Congestion Zone Fee:</strong> £${CONGESTION_FEE}.00</p>`
    : "";
  const parkingFee =
    order.parkingOptions !== "FREE"
      ? `<p><strong>Parking Fee:</strong> £${PARKING_FEE}.00</p>`
      : "";

  const bankDetails =
    order.paymentMethod !== "CREDIT_CARD"
      ? `
    <div class="bank-details">
        <h3 class="section-title">BANK DETAILS</h3>
        <div class="bank-details-grid">
            <span><strong>Account Name:</strong></span>
            <span>${BUSINESS_NAME}</span>
            <span><strong>Sort Code:</strong></span>
            <span>${BANK_SORT_CODE}</span>
            <span><strong>Account No:</strong></span>
            <span>${BANK_ACCOUNT_NUMBER}</span>
        </div>
        </div>
        <div class="footer">
        <p>Thank you for your business. Please make payment within 3 days of the invoice date.</p>
    </div>
  `
      : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Invoice - Home Safety Cert Limited</title>
    <style>
        :root {
            --primary-color: #267ECE;
            --secondary-color: #FFC527;
            --text-color: #2c3e50;
            --border-color: #bdc3c7;
            --background-color: #f8fafc;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            margin: 0;
            padding: 0;
            background-color: var(--background-color);
        }
        .container {
            max-width: 800px;
            margin: 40px auto;
            background-color: white;
            padding: 40px;
            border-radius: 8px;
        }
        .header {
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 20px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo-container {
            display: flex;
            align-items: center;
        }
        .logo {
            width: 150px;
            height: auto;
        }
        .company-details {
            text-align: right;
            font-size: 0.9em;
        }
        .invoice-title {
            font-size: 32px;
            color: var(--primary-color);
            margin: 0 0 10px 0;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .client-details, .invoice-info {
            flex-basis: 48%;
        }
        .section-title {
           font-size: 20px;
            color: var(--primary-color);
            margin-bottom: 5px; 
          
            padding-bottom: 3px;
        }
        .client-details p, .invoice-info p {
            margin-top: 5px; 
            margin-bottom: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        thead {
            background-color: var(--primary-color);
            color: white;
        }
        .amount-column {
            text-align: right;
        }
       .total-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end; 
            margin-top: 10px; 
        }
        .payment-status-section {
            flex-basis: 48%;
        }
        .totals {
            flex-basis: 48%;
            text-align: right;
        }
        .totals p {
            margin: 0 0 5px 0; /* Reduce vertical margins between paragraphs */
        }
        .total-row {
            font-size: 1.2em;
            font-weight: bold;
            color: var(--primary-color);
            margin-top: 5px;
        }
        .bank-details {
            margin-top: 20px;
            font-size: 0.9em;
            padding-top: 10px;
        }
        .bank-details-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 5px 10px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.9em;
            color: var(--text-color);
        }
        .payment-status {
           font-weight: bold;
            padding: 5px 10px;
            border-radius: 4px;
            display: inline-block;
            margin-bottom: 5px;
        }
        .status-UNPAID { background-color: #fecaca; color: #991b1b; }
        .status-PARTIALLY_PAID { background-color: #fef3c7; color: #92400e; }
        .status-PAID { background-color: #d1fae5; color: #065f46; }
        .status-REFUNDED { background-color: #e0e7ff; color: #3730a3; }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="logo-container">
               <img src="data:image/svg+xml;base64,${base64Logo}" alt="Home Safety Cert Logo" class="logo">

            </div>
            <div class="company-details">
                <h1 class="invoice-title">INVOICE</h1>
                <p>Home Safety Cert Limited<br>
                46d, Greatorex Street, Micro Business Park,<br>
                London, Great Britain, UK<br>
            </div>
        </header>

        <div class="invoice-details">
            <div class="client-details">
                <h2 class="section-title">Bill To</h2>
                <p>
                    ${order.user.name}<br>
                    ${order.user.address?.street},<br>
                    ${order.user.address?.city}, ${
    order.user.address?.postcode
  }<br>
                    United Kingdom
                </p>
            </div>
            <div class="invoice-info">
                <h2 class="section-title">Invoice Details</h2>
                <p>
                    <strong>Invoice Number:</strong> ${order.invoice}<br>
                    <strong>Date:</strong> ${dayjs(order.date).format(
                      "MMMM DD, YYYY"
                    )}<br>
                    <strong>Due Date:</strong> ${dayjs(order.date)
                      .add(3, "day")
                      .format("MMMM DD, YYYY")}
                </p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="amount-column">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${packageRows}
            </tbody>
        </table>

        <div class="total-section">
            <div class="payment-status-section">
                <div class="payment-status status-${order.paymentStatus}">
                    ${order.paymentStatus}
                </div>
            </div>
            <div class="totals">
                <p><strong>Subtotal:</strong> £${cartTotal.toFixed(2)}</p>
                ${congestionFee}
                ${parkingFee}
                <p class="total-row">Total: £${totalPrice.toFixed(
                  2
                )} <span>inc. Tax</span></p>
            </div>
        </div>

        ${bankDetails}
    </div>
</body>
</html>
  `;
}

const base64Logo =
  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNTUuNTIgMTYxLjczIj48ZGVmcz48c3R5bGU+LmNscy0xLC5jbHMtNXtmaWxsOiMxYzM1NTY7fS5jbHMtMntmaWxsOiM5M2FjNjE7fS5jbHMtM3tmaWxsOiNjMzQ2NGI7fS5jbHMtNHtmaWxsOiNmNWQzODQ7fS5jbHMtNXtzdHJva2U6IzFjMzU1NjtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6MC4yOHB4O308L3N0eWxlPjwvZGVmcz48ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj48ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEyOC43NSw5Ljc5VjY5LjFhNTAuNTIsNTAuNTIsMCwwLDEtMTguMywzOWMtLjQ5LjQxLTEsLjgxLTEuNTEsMS4ycy0uODguNjgtMS4zNCwxYy0uMTQuMS0uMjYuMTktLjM5LjI3YTUwLjU5LDUwLjU5LDAsMCwxLTU4LjA2LDBjLS41My0uMzgtMS0uNzUtMS41Ni0xLjE2cy0xLjE0LS45LTEuNy0xLjM2QTUwLjQxLDUwLjQxLDAsMCwxLDI3LjYsNjkuMVY5Ljc5UzY2LjQ1LDE1LjM5LDc4LjE3LDBDODkuOTEsMTUuMzksMTI4Ljc1LDkuNzksMTI4Ljc1LDkuNzlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NCkiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik03OC4xNyw0MC4yNCw0OS4xNSw1OXY1MS41NUE1MC41NSw1MC41NSwwLDAsMSwyNy42LDY5LjFWNDFMNDcuNCwyMS4xNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjg0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTEyOC43NSw0MVY2OS4xYTUwLjQ5LDUwLjQ5LDAsMCwxLTE5LjgxLDQwLjE1Yy0uNTYuNDUtMS4xNC44Ny0xLjczLDEuMjZWNTlsLTI5LTE4Ljc0LDMwLjc3LTE5LjFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NCkiLz48cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0xMTAuNDUsNTkuNTJ2NDguNTNjLS40OS40MS0xLC44MS0xLjUxLDEuMnMtLjg4LjY4LTEuMzQsMWMtLjE0LjEtLjI2LjE5LS4zOS4yN2E1MC41OSw1MC41OSwwLDAsMS01OC4wNiwwYy0uNTMtLjM4LTEtLjc1LTEuNTYtMS4xNnMtMS4xNC0uOS0xLjctMS4zNlY1OS41Mkw3OC4xNyw0MC4yNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjg0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTg3LjE0LDk4LjEyaC0xN1Y5Ny4wNmMwLTQuNDYtMi44MS04LjYxLTQtMTAuMzhhOC4xNCw4LjE0LDAsMCwxLS41OS0uOTMsMTQuMjMsMTQuMjMsMCwwLDEtMS40OC02LjM5LDE0LjU3LDE0LjU3LDAsMSwxLDI5LjEzLDAsMTIuMjgsMTIuMjgsMCwwLDEtMS41MSw2LjQ2bC0uMjkuNDJjLTIuODQsNC00LjI4LDcuNjQtNC4yOCwxMC44MlpNNzIuMjQsOTZIODUuMDdjLjI3LTMuMzYsMS44Mi03LDQuNjItMTEsLjEtLjEzLjE3LS4yMy4yLS4yOGExMC4yNSwxMC4yNSwwLDAsMCwxLjIxLTUuMzcsMTIuNDUsMTIuNDUsMCwxLDAtMjQuODksMCwxMi4xNSwxMi4xNSwwLDAsMCwxLjI1LDUuNDQsNy45Miw3LjkyLDAsMCwwLC40NS42OUM2OS4xMyw4Ny4yOSw3MS44Nyw5MS4zMyw3Mi4yNCw5NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjg0KSIvPjxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iNjkuNDMiIHk9Ijk5LjQiIHdpZHRoPSIxNi43OSIgaGVpZ2h0PSIyLjM0IiByeD0iMS4wNyIvPjxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iNjkuNDMiIHk9IjEwMi45OCIgd2lkdGg9IjE2Ljc5IiBoZWlnaHQ9IjIuMzQiIHJ4PSIxLjA3Ii8+PHBhdGggY2xhc3M9ImNscy01IiBkPSJNNzguNjUsMTExLjFjMy4yNywwLDUuOTItMiw1LjkyLTQuMzhINzIuNzRDNzIuNzQsMTA5LjE0LDc1LjM5LDExMS4xLDc4LjY1LDExMS4xWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuODQpIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNzguMTIsNjFoMGEuODMuODMsMCwwLDEtLjgyLS44M3YtOGEuODMuODMsMCwwLDEsLjgyLS44M2gwYS44My44MywwLDAsMSwuODMuODN2OEEuODMuODMsMCwwLDEsNzguMTIsNjFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NCkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik02OC42OCw2M`y44NWgwYS44My44MywwLDAsMS0xLjEzLS4zbC00LTYuOTRhLjgyLjgyLDAsMCwxLC4zLTEuMTNoMGEuODIuODIsMCwwLDEsMS4xMy4zbDQsNi45NEEuODMuODMsMCwwLDEsNjguNjgsNjMuODVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NCkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik02MS45MSw3MWgwYS44My44MywwLDAsMS0xLjEzLjNsLTYuOTQtNGEuODQuODQsMCwwLDEtLjMtMS4xNGgwYS44My44MywwLDAsMSwxLjEzLS4zbDYuOTQsNEEuODIuODIsMCwwLDEsNjEuOTEsNzFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NCkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01OS42Myw3OS41M2gwYS44My44MywwLDAsMS0uODMuODNoLThhLjgzLjgzLDAsMCwxLS44My0uODNoMGEuODMuODMsMCwwLDEsLjgzLS44M2g4QS44My44MywwLDAsMSw1OS42Myw3OS41M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjg0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTk2LjczLDc5LjUzaDBhLjgzLjgzLDAsMCwxLC44My0uODNoOGEuODMuODMsMCwwLDEsLjgzLjgzaDBhLjgzLjgzLDAsMCwxLS44My44M2gtOEEuODMuODMsMCwwLDEsOTYuNzMsNzkuNTNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NCkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik05NC44Nyw3MC4wOWgwYS44Mi44MiwwLDAsMSwuMy0xLjEzbDYuOTQtNGEuODMuODMsMCwwLDEsMS4xMy4zMWgwYS44My44MywwLDAsMS0uMywxLjEzbC02Ljk0LDRBLjgyLjgyLDAsMCwxLDk0Ljg3LDcwLjA5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuODQpIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODcuNzEsNjMuMzJoMGEuODIuODIsMCwwLDEtLjMtMS4xM2w0LTYuOTRhLjgyLjgyLDAsMCwxLDEuMTMtLjNoMGEuODMuODMsMCwwLDEsLjMxLDEuMTNsLTQsNi45NEEuODMuODMsMCwwLDEsODcuNzEsNjMuMzJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NCkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik02OS42LDc4LjkxaDBhLjkzLjkzLDAsMCwxLS45Mi0uOTMsOS4zNCw5LjM0LDAsMCwxLDguMTctOSwuOTMuOTMsMCwwLDEsLjI5LDEuODNBNy40MSw3LjQxLDAsMCwwLDcwLjUzLDc4LC45My45MywwLDAsMSw2OS42LDc4LjkxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuODQpIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTUsMTQwYy0uMTksMS0uOTUsMy44NC0xLjIsNC41OUguODR2LS45YzIuMzctLjE5LDIuNTgtLjM1LDIuNTgtMi42VjEzMC43OGMwLTIuMjQtLjI3LTIuNDMtMi4zMS0yLjZ2LS45SDl2LjljLTIuMDkuMTktMi4zNy4zNS0yLjM3LDIuNnYxMC41MWMwLDEuNTIuMTEsMi4wOCwxLjYsMi4xMWwxLjYzLDBhMi42MywyLjYzLDAsMCwwLDIuNDktMUExMC40MywxMC40MywwLDAsMCwxNCwxMzkuN1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjg0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTIzLjA4LDEzMS42MmM0LjI2LDAsNywyLjg5LDcsNi40OCwwLDQuMzktMy4yOCw2LjgyLTcsNi44Mi00LjUyLDAtNy0zLjE5LTctNi41OEMxNi4wOCwxMzMuOSwxOS43MSwxMzEuNjIsMjMuMDgsMTMxLjYyWm0tLjI0LDFjLTEuOSwwLTMuMzgsMS42NS0zLjM4LDUuMTlzMS40OSw2LjA4LDMuOTEsNi4wOGMxLjc4LDAsMy4zMS0xLjQsMy4zMS01LjNDMjYuNjgsMTM1LjI0LDI1LjM3LDEzMi42NCwyMi44NCwxMzIuNjRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NCkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik00NS42OCwxMzIuODhjLTEuNTQuMTYtMS44Mi40OS0xLjg3LDEuNDFzLS4wOCwxLjM1LS4wOCwzLjA5djcuMzZINDIuNDRsLTguMi05LjU4djRhMzAuMDksMzAuMDksMCwwLDAsLjA4LDNjLjA3LDEuMDkuNTUsMS4zNCwyLjE4LDEuNXYuOUgzMXYtLjljMS4xNy0uMDgsMS44My0uMzksMS45MS0xLjQ5LDAtLjY3LjA4LTEuMjEuMDgtM3YtNC41MWExLjM4LDEuMzgsMCwwLDAtLjI1LS45MmMtLjQzLS41Ni0uOS0uNzMtMi0uODNWMTMyaDQuNDdsNy4yMSw4LjE4di0yLjc4YzAtMS43NCwwLTIuNDItLjA3LTMuMS0uMDgtMS0uNjQtMS4zMS0yLjE4LTEuNFYxMzJoNS40N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjg0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTUyLjgsMTMyYzIuMzgsMCw0LjMzLjQ2LDUuNzUsMS43NGE1LjU3LDUuNTcsMCwwLDEsMS43Miw0LjEzYzAsNC42My0zLjYxLDYuNzItOC4yNCw2LjcySDQ2LjE1di0uOWMxLjY4LS4xOCwxLjg4LS4yNiwxLjg4LTJ2LTYuNzVjMC0xLjgyLS4yNy0xLjktMS44OC0yVjEzMlpNNTEsMTQxLjUzYzAsMS41Ny43OCwyLDIsMiwyLjQ4LDAsMy44My0xLjgxLDMuODMtNS4yNCwwLTMuNjQtMS43OC01LjMtNC40Ny01LjNhMS41MiwxLjUyLDAsMCwwLTEuMTUuMzFjLS4xOC4xOS0uMjQuNTItLjI0LDEuMloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjg0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTY4LjcsMTMxLjYyYzQuMjYsMCw3LDIuODksNyw2LjQ4LDAsNC4zOS0zLjI5LDYuODItNyw2LjgyLTQuNTIsMC03LTMuMTktNy02LjU4QzYxLjcsMTMzLjksNjUuMzIsMTMxLjYyLDY4LjcsMTMxLjYyWm0tLjI0LDFjLTEuOSwwLTMuMzksMS42NS0zLjM5LDUuMTlzMS40OSw2LjA4LDMuOTEsNi4wOGMxLjc4LDAsMy4zMi0xLjQsMy4zMi01LjNDNzIuMywxMzUuMjQsNzEsMTMyLjY0LDY4LjQ2LDEzMi42NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjg0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTkxLjMsMTMyLjg4Yy0xLjU1LjE2LTEuODIuNDktMS44OCwxLjQxcy0uMDgsMS4zNS0uMDgsMy4wOXY3LjM2SDg4LjA2bC04LjIxLTkuNTh2NGMwLDEuODcsMCwyLjM5LjA4LDMsLjA4LDEuMDkuNTUsMS4zNCwyLjE4LDEuNXYuOUg3Ni42MnYtLjljMS4xOC0uMDgsMS44My0uMzksMS45MS0xLjQ5LDAtLjY3LjA4LTEuMjEuMDgtM3YtNC41MWExLjM4LDEuMzgsMCwwLDAtLjI0LS45MmMtLjQzLS41Ni0uOS0uNzMtMi0uODNWMTMyaDQuNDdsNy4yMiw4LjE4di0yLjc4YzAtMS43NCwwLTIuNDItLjA3LTMuMS0uMDgtMS0uNjUtMS4zMS0yLjE4LTEuNFYxMzJIOTEuM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjg0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTExMC43NCwxMjguMThjLTIuMTIuMjEtMi4zMi4zNi0yLjMyLDIuNTh2MTAuMzZjMCwyLjIyLjIyLDIuMzUsMi4zMiwyLjU1di45SDEwMi45di0uOWMyLjE0LS4yNiwyLjMxLS4zMywyLjMxLTIuNTVWMTM2SDk3LjM2djUuMTJjMCwyLjIxLjIzLDIuMzIsMi4yOSwyLjU1di45SDkxLjg0di0uOWMyLS4yMiwyLjMtLjMzLDIuMy0yLjU1VjEzMC43NmMwLTIuMjItLjI0LTIuNDEtMi4zLTIuNTh2LS45aDcuODF2LjljLTIuMDYuMTgtMi4yOS4zNy0yLjI5LDIuNTh2NGg3Ljg1di00YzAtMi4yMS0uMjctMi4zOC0yLjMxLTIuNTh2LS45aDcuODRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NCkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMTguMjUsMTMxLjYyYzQuMjYsMCw3LDIuODksNyw2LjQ4LDAsNC4zOS0zLjI4LDYuODItNyw2LjgyLTQuNTIsMC03LTMuMTktNy02LjU4QzExMS4yNSwxMzMuOSwxMTQuODgsMTMxLjYyLDExOC4yNSwxMzEuNjJabS0uMjQsMWMtMS45LDAtMy4zOCwxLjY1LTMuMzgsNS4xOXMxLjQ5LDYuMDgsMy45MSw2LjA4YzEuNzgsMCwzLjMxLTEuNCwzLjMxLTUuM0MxMjEuODUsMTM1LjI0LDEyMC41NCwxMzIuNjQsMTE4LDEzMi42NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjg0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE0My43NSwxMzIuODhjLTEuOTEuMTQtMiwuMzEtMiwyLjA2bC4wOCw2Ljc1YzAsMS43My4yNCwxLjgyLDIsMnYuOUgxMzd2LS45YzEuNzQtLjEyLDEuODctLjI1LDEuODgtMmwuMDgtNy41OWMtMS41MiwzLjQyLTMuMzYsNy43LTQuNTEsMTAuNDloLS45NWMtMS4wNS0yLjgtMi43Ni02Ljg4LTQuMTQtMTAuMjYtLjEyLDMuNC0uMjUsNy4yNi0uMiw4LDAsMSwuNTEsMS4yMSwxLjkyLDEuMzJ2LjloLTUuMjh2LS45YzEuMzQtLjExLDEuNzUtLjQsMS45LTEuMzJzLjQyLTQuMzMuNTUtOGMwLTEtLjA4LTEuMzYtMS45MS0xLjUxVjEzMmg1bDMuNyw4LjI0LDMuNzUtOC4yNGg1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuODQpIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTU2LjM2LDE0MC45M2MtLjE1Ljk1LS42MiwzLjExLS43NSwzLjY0SDE0NC4yOHYtLjg3YzIuMDktLjE0LDIuMjEtLjI0LDIuMjEtMi4xNlYxMzVjMC0xLjg3LS4yMy0xLjk1LTEuODYtMi4xVjEzMmg3LjA5YzEuMDksMCwyLjg0LDAsMy4zOCwwLDAsLjU0LjA5LDIsLjIxLDMuMjZsLS45MS4xMmE3Ljg2LDcuODYsMCwwLDAtLjY0LTEuNWMtLjM0LS41MS0uNzQtLjY5LTEuNjEtLjY5aC0xLjg3Yy0uNzQsMC0uNzksMC0uNzkuOHYzLjU0aDEuNzJjMS4yOCwwLDEuNDYtLjM3LDEuNy0xLjdoLjkxdjQuNTZoLS45MWMtLjI3LTEuMzEtLjM0LTEuNjgtMS43LTEuNjhoLTEuNzJ2My4xMWMwLDEsLjIsMS41MS45MiwxLjZhMTAuNzYsMTAuNzYsMCwwLDAsMS41LjA3YzEuNDQsMCwxLjkzLS4xMiwyLjQ1LS42OWE3LjI4LDcuMjgsMCwwLDAsMS4xLTEuOTRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NCkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01MC40MiwxNTIuNGMtLjU0LTEuNzItMS41NC0zLTMuMTYtM2ExLjcyLDEuNzIsMCwwLDAtMS44NiwxLjczYzAsMS4yMywxLDEuNzUsMS45MSwyLjE3bC42Ny4zMWMyLjEyLDEsMy43MywxLjkzLDMuNzYsNC4xLDAsMi40Ny0yLjE0LDQtNS4xLDRBMTAuNzEsMTAuNzEsMCwwLDEsNDMsMTYxYTI5Ljg2LDI5Ljg2LDAsMCwxLS42OS0zLjU3bC44Ny0uMjJjLjU1LDEuNjcsMS43NywzLjQ5LDMuOTEsMy40OUExLjcyLDEuNzIsMCwwLDAsNDksMTU4Ljg5YzAtMS4wNy0uNzEtMS42OC0yLTIuMjhsLS44NC0uMzljLTEuNTEtLjczLTMuMzMtMS42OC0zLjMzLTMuOTRzMS43NC0zLjg1LDQuODctMy44NWExNi4yLDE2LjIsMCwwLDEsMy4yLjQxYy4wNy43MS4yNiwyLjI2LjQ0LDMuMzZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NCkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01OS45MywxNjEuMzl2LS44NWwuNTMtLjA2YzEtLjEsMS0uMzUuNjYtMS4yNmwtLjctMS42MUg1NmwtLjU4LDEuNjFjLS4yNy44Ny0uMSwxLjA5Ljg0LDEuMjJsLjY4LjF2Ljg1SDUxLjgzdi0uODVjMS4zLS4xNiwxLjczLS4zNCwyLjQ0LTJsNC4zNi05LjkyLDEuMDgtLjE2LDQuNDcsMTAuNDRhMi4xMywyLjEzLDAsMCwwLDIuMjIsMS42N3YuODVabS0xLjY5LTkuMjYtMS43Nyw0LjI2SDYwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuODQpIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNzYuMiwxNTIuMjVhNi41LDYuNSwwLDAsMC0uNzYtMS42OGMtLjMzLS40Ny0uNzMtLjctMi0uN0g3MS44M2MtLjcyLDAtLjc3LjE3LS43Ny43NHY0aDEuODhjMS41OSwwLDEuNjgtLjExLDItMS43aC45MXY0LjU0SDc1Yy0uMzItMS41NC0uNDEtMS43LTItMS43SDcxLjA2djIuNjljMCwxLjcyLjE4LDEuODksMi4xLDJ2LjloLTd2LS45YzEuNjMtLjE2LDEuODctLjI1LDEuODctMnYtNi43OWMwLTEuOC0uMjUtMS45LTEuODctMnYtLjkyaDcuNjFjMSwwLDIuNjEsMCwzLjA2LDAsMCwuNTQuMTEsMi4wNy4yNCwzLjQxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuODQpIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODkuNjYsMTU3Ljc1Yy0uMTUuOTQtLjYxLDMuMS0uNzQsMy42NEg3Ny41OXYtLjg4YzIuMDktLjE0LDIuMi0uMjQsMi4yLTIuMTZ2LTYuNTdjMC0xLjg3LS4yMi0xLjk1LTEuODUtMi4xdi0uODlIODVjMS4xLDAsMi44NSwwLDMuMzksMCwwLC41NC4wOSwyLC4yMSwzLjI2bC0uOTEuMTJhOC40Myw4LjQzLDAsMCwwLS42NC0xLjQ5Yy0uMzQtLjUyLS43NC0uNy0xLjYyLS43SDgzLjU4Yy0uNzMsMC0uNzkuMDYtLjc5Ljh2My41NWgxLjcyYzEuMjksMCwxLjQ3LS4zNywxLjcxLTEuNzFoLjl2NC41N2gtLjljLS4yNy0xLjMyLS4zNC0xLjY5LTEuNzEtMS42OUg4Mi43OXYzLjExYzAsMSwuMjEsMS41Mi45MywxLjYxYTEyLjg1LDEyLjg1LDAsMCwwLDEuNS4wNmMxLjQ0LDAsMS45My0uMTIsMi40NC0uNjlhNi43Nyw2Ljc3LDAsMCwwLDEuMS0xLjk0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuODQpIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTAxLjMxLDE1Mi40NGE1LjQ2LDUuNDYsMCwwLDAtLjg5LTJjLS4zMi0uMzctLjY2LS41Ny0xLjg2LS41N0g5Ny41djguNDJjMCwxLjkyLjE1LDIsMi4wOCwyLjJ2LjlIOTIuNDd2LS45YzEuODMtLjIzLDItLjMxLDItMi4xOXYtOC40M2gtLjc0Yy0xLjQ1LDAtMS43OS4yLTIuMTQuNjNhNi4yLDYuMiwwLDAsMC0uODgsMS45NGgtLjkxYy4wOC0uNzYuMjMtMy4xMy4yNS00LjE0aC42NWMuMzEuNDIuNTMuNDksMS4xOC40OWg4LjM2YTEuMDgsMS4wOCwwLDAsMCwxLjA3LS40OUgxMDJjMCwuOTQuMTUsMywuMjYsNC4wOFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjg0KSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTExNi4yMywxNDkuN2EyLjc4LDIuNzgsMCwwLDAtMi42LDEuNjhjLS41OSwxLTEuNDMsMi40Ny0yLjM3LDQuMjdhMiwyLDAsMCwwLS4yNywxLjF2MS42N2MwLDEuNzQuMTksMS45MSwyLjA3LDIuMDd2LjloLTcuMTd2LS45YzEuOTMtLjE2LDItLjMyLDItMi4wNVYxNTdhMi4xOCwyLjE4LDAsMCwwLS4zMy0xLjI5Yy0uNzUtMS4zNC0xLjYtMy0yLjQ5LTQuNDVhMi40NCwyLjQ0LDAsMCwwLTIuMy0xLjUydi0uOTFoNi4zMnYuOTFsLS43Ni4xYy0uNTguMTEtLjU2LjQtLjI4LDEsLjcyLDEuMzYsMS42NCwzLjA3LDIuMjYsNC4xOS43OC0xLjM3LDEuNzktMy4yOSwyLjItNC4xNnMwLS45Mi0uNjMtMWwtLjc1LS4wOXYtLjkxaDVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NCkiLz48L2c+PC9nPjwvc3ZnPg==";
