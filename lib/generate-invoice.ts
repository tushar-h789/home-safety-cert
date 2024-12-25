import prisma from "@/lib/prisma";
import {
  AREA_NAME,
  BANK_ACCOUNT_NUMBER,
  BANK_SORT_CODE,
  BUSINESS_NAME,
  LANDLINE,
  POSTCODE,
  STREET_NAME,
} from "@/shared/data";
import { Order, Prisma } from "@prisma/client";
import { jsPDF } from "jspdf";
import path from "path";
import fs from "fs";

export async function generateInvoiceId() {
  const mostRecentOrder = await prisma.order.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!mostRecentOrder || !mostRecentOrder.invoice) {
    return "INV00001A";
  }

  const match = mostRecentOrder.invoice.match(/INV(\d{5})([A-Z])/);
  if (!match) {
    console.error("Invalid invoice ID format:", mostRecentOrder.invoice);
    return "INV00001A";
  }

  let [, numericPart, alphabetPart] = match;
  let nextNumericPart = parseInt(numericPart, 10) + 1;

  if (nextNumericPart > 99999) {
    nextNumericPart = 1;
    alphabetPart = String.fromCharCode(alphabetPart.charCodeAt(0) + 1);
    if (alphabetPart > "Z") {
      throw new Error("Reached the maximum invoice ID");
    }
  }

  const paddedNumericPart = nextNumericPart.toString().padStart(5, "0");
  return `INV${paddedNumericPart}${alphabetPart}`;
}

type OrderWithRelation = Prisma.OrderGetPayload<{
  include: {
    user: {
      include: {
        address: true;
      };
    };
    packages: true;
  };
}>;

type InvoiceData = {
  order: OrderWithRelation;
  subTotal: number;
  totalPrice: number; // Removed parking and congestion fees
};

export function generateInvoiceTemplate(doc: jsPDF, data: InvoiceData) {
  const { order, subTotal, totalPrice } = data;

  // Colors
  const primaryColor = "#267ECE";
  const secondaryColor = "#FFC527";
  const lightGray = "#EAF3FB";
  const darkGray = "#636B74";
  const white = "#FFFFFF";

  // Fonts
  doc.setFont("helvetica");

  // Header
  doc.setFillColor(white);
  doc.rect(0, 0, 210, 40, "F");

  // Add logo
  const currentDir = process.cwd();
  const publicFolderPath = path.join(currentDir, "public");
  const imagePath = path.join(publicFolderPath, "logo.png");

  // Read the image file
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");
  const imgData = `data:image/png;base64,${base64Image}`;

  doc.addImage(imgData, "PNG", 20, 7, 30, 30);

  const rightMargin = 188;

  doc.setTextColor(primaryColor);
  doc.setFontSize(32);
  drawBolderText(doc, "INVOICE", rightMargin, 25, { align: "right" });

  doc.setTextColor(darkGray);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`#${order.invoice}`, rightMargin, 35, {
    align: "right",
  });

  // Company details
  doc.setFontSize(10);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(BUSINESS_NAME, 130, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(STREET_NAME, rightMargin, 62, { align: "right" });
  doc.text(AREA_NAME, rightMargin, 69, { align: "right" });
  doc.text(`London ${POSTCODE}`, rightMargin, 76, { align: "right" });
  doc.text(`Date: ${order.date.toLocaleDateString()}`, rightMargin, 83, {
    align: "right",
  });

  // Customer details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${order.user.name}`, 20, 62);
  doc.text(order.user.email, 20, 69);
  if (order.user.address) {
    doc.text(`${order.user.address.street}`, 20, 76);
    doc.text(
      `${order.user.address.city}, ${order.user.address.postcode}`,
      20,
      83
    );
  }

  // Table header
  const tableTop = 100;
  doc.setFillColor(primaryColor);
  doc.rect(20, tableTop, 170, 10, "F");
  doc.setTextColor(white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 25, tableTop + 7);
  doc.text("Amount", 185, tableTop + 7, { align: "right" });

  // Table content
  let yPos = tableTop + 20;
  doc.setTextColor(darkGray);
  doc.setFont("helvetica", "normal");

  order.packages.forEach((pkg, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(lightGray);
    } else {
      doc.setFillColor(white);
    }
    doc.rect(20, yPos - 5, 170, 10, "F");

    const description = `${pkg.serviceName}: ${pkg.name}`;
    yPos = wrapText(doc, description, 25, yPos, 130, 10);
    doc.text(`£${pkg.price.toFixed(2)}`, 185, yPos, { align: "right" });
    yPos += 15;
  });

  // Subtotal
  yPos += 10;
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Subtotal (inc Tax):", 135, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(`£${subTotal.toFixed(2)}`, 190, yPos, { align: "right" });
  yPos += 10;

  // Total
  yPos += 5;
  doc.setFillColor(primaryColor);
  doc.rect(120, yPos - 5, 70, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  const rectHeight = 10;
  const textDimensions = doc.getTextDimensions("Total (inc Tax):");
  const textHeight = textDimensions.h;

  // Calculate the Y position to center the text vertically
  const textY = yPos - 5 + (rectHeight - textHeight) / 2 + textHeight;

  doc.text("Total (inc Tax):", 125, textY);
  doc.text(`£${totalPrice.toFixed(2)}`, 185, textY, { align: "right" });

  // Bank details (if payment method is credit card)
  if (order.paymentMethod !== "CREDIT_CARD") {
    yPos += 30;
    doc.setTextColor(darkGray);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BANK DETAILS", 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Account Name: ${BUSINESS_NAME}`, 20, yPos);
    yPos += 7;
    doc.text(`Sort Code: ${BANK_SORT_CODE}`, 20, yPos);
    yPos += 7;
    doc.text(`Account No: ${BANK_ACCOUNT_NUMBER}`, 20, yPos);
  }

  // Footer
  doc.setTextColor(darkGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business!", 105, 280, { align: "center" });
  doc.text(
    "www.homesafetycert.co.uk | info@homesafetycert.co.uk",
    105,
    285,
    { align: "center" }
  );
}

function wrapText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let yPos = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = doc.getTextDimensions(testLine);
    const testWidth = metrics.w;

    if (testWidth > maxWidth && i > 0) {
      doc.text(line.trim(), x, yPos);
      line = words[i] + " ";
      yPos += lineHeight;
    } else {
      line = testLine;
    }
  }
  doc.text(line.trim(), x, yPos);
  return yPos;
}

function drawBolderText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  options?: { align: "right" | "center" | "left" }
) {
  doc.setFont("helvetica", "bold");
  const offset = 0.1;

  if (options?.align === "right") {
    const textWidth = doc.getTextWidth(text);
    x -= textWidth;
  }

  doc.text(text, x, y);
  doc.text(text, x + offset, y);
  doc.text(text, x, y + offset);
  doc.text(text, x + offset, y + offset);
}
