export enum ServiceType {
    CERTIFICATE = "CERTIFICATE",
    REPAIR = "REPAIR",
    INSTALLATION = "INSTALLATION",
    INSPECTION = "INSPECTION",
    OTHER = "OTHER",
  }
  
  export enum Role {
    ADMIN = "ADMIN",
    STAFF = "STAFF",
    USER = "USER",
  }
  
  export enum PropertyType {
    RESIDENTIAL = "RESIDENTIAL",
    COMMERCIAL = "COMMERCIAL",
  }
  
  export enum ResidentialType {
    BUNGALOW = "BUNGALOW",
    MID_TERRACED_HOUSE = "MID_TERRACED_HOUSE",
    DETACHED_HOUSE = "DETACHED_HOUSE",
    SEMI_DETACHED_HOUSE = "SEMI_DETACHED_HOUSE",
    FLAT = "FLAT",
    APARTMENT = "APARTMENT",
    OTHER = "OTHER",
  }
  
  export enum CommercialType {
    PUB = "PUB",
    STORE = "STORE",
    OFFICE = "OFFICE",
    RESTAURANT = "RESTAURANT",
    WAREHOUSE = "WAREHOUSE",
    OTHER = "OTHER",
  }
  
  export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
  }
  
  export enum PaymentStatus {
    UNPAID = "UNPAID",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    PAID = "PAID",
    REFUNDED = "REFUNDED",
  }
  