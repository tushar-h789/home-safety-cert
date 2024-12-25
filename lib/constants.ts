import {
    CommercialType,
    OrderStatus,
    PackageCategory,
    PackageType,
    PaymentStatus,
    PropertyType,
    ResidentialType,
  } from "@prisma/client";
  
  export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
    "CANCELLED",
    "COMPLETED",
    "IN_PROGRESS",
    "PENDING",
    "CONFIRMED",
  ];
  
  export const PAYMENT_STATUS_OPTION: PaymentStatus[] = [
    "UNPAID",
    "PARTIALLY_PAID",
    "PAID",
    "REFUNDED",
  ];
  
  export const SERVICE_TYPE_OPTIONS: PackageType[] = [
    "CERTIFICATE",
    "REPAIR",
    "INSTALLATION",
    "INSPECTION",
    "OTHER",
  ];
  
  export const SERVICE_CATEGORY_OPTION: PackageCategory[] = [
    "ELECTRICAL",
    "FIRE",
    "GAS",
    "HEALTH_SAFETY",
  ];
  
  export const PROPERTY_TYPE_OPTIONS: PropertyType[] = [
    "RESIDENTIAL",
    "COMMERCIAL",
  ];
  
  export const RESIDENTIAL_TYPE_OPTIONS: ResidentialType[] = [
    "BUNGALOW",
    "MID_TERRACED_HOUSE",
    "DETACHED_HOUSE",
    "SEMI_DETACHED_HOUSE",
    "FLAT",
    "APARTMENT",
    "OTHER",
  ];
  
  export const COMMERCIAL_TYPE_OPTIONS: CommercialType[] = [
    "PUB",
    "STORE",
    "OFFICE",
    "RESTAURANT",
    "WAREHOUSE",
    "OTHER",
  ];
  
  export const NON_INVERTED_ROUTES = [
    "cart",
    "checkout",
    "admin/login",
    "payment",
  ];
  