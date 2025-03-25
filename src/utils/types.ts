
export interface Client {
  id: string;
  name: string;
  phone: string;
  birthdate: string;
  isFreeService: boolean;
  createdAt: string;
}

export interface Flight {
  id: string;
  clientId: string;
  date: string;
  airline: string;
  ticketNumber: string;
  status: FlightStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  clientId: string;
  flightId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  clientId: string;
  type: ActivityType;
  description: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export enum FlightStatus {
  UPCOMING = "upcoming",
  HAPPENED = "happened",
  CANCELED = "canceled",
  RESCHEDULED = "rescheduled",
  COMPLETED = "completed",
  DELAYED = "delayed"
}

export enum PaymentStatus {
  PAID = "paid",
  UNPAID = "unpaid",
  FREE_SERVICE = "free"
}

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  BANK_TRANSFER = "bank_transfer",
  OTHER = "other"
}

export enum ActivityType {
  FLIGHT_BOOKED = "flight_booked",
  FLIGHT_RESCHEDULED = "flight_rescheduled",
  FLIGHT_CANCELED = "flight_canceled",
  PAYMENT_RECEIVED = "payment_received",
  MARKED_FREE_SERVICE = "marked_free_service",
  NOTE = "note",
  OTHER = "other"
}

export interface User {
  id: string;
  email: string;
  name: string;
}
