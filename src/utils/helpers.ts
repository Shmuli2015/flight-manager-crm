
import { format, parseISO } from "date-fns";
import { FlightStatus, PaymentStatus } from "./types";

export const formatDate = (dateString: string, formatString: string = "MMM dd, yyyy"): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
};

export const getFlightStatusColor = (status: FlightStatus): string => {
  switch (status) {
    case FlightStatus.UPCOMING:
      return "bg-blue-50 text-blue-700 border-blue-200";
    case FlightStatus.HAPPENED:
      return "bg-green-50 text-green-700 border-green-200";
    case FlightStatus.CANCELED:
      return "bg-red-50 text-red-700 border-red-200";
    case FlightStatus.RESCHEDULED:
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.PAID:
      return "bg-green-50 text-green-700 border-green-200";
    case PaymentStatus.UNPAID:
      return "bg-red-50 text-red-700 border-red-200";
    case PaymentStatus.FREE_SERVICE:
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const generateMockId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
