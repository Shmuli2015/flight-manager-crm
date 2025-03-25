
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Plane, CreditCard, User } from "lucide-react";
import { Flight, FlightStatus, PaymentStatus } from "@/utils/types";
import { formatDate, getFlightStatusColor, getPaymentStatusColor } from "@/utils/helpers";
import { Badge } from "@/components/ui/badge";

interface FlightCardProps {
  flight: Flight;
  clientName: string;
  paymentStatus: PaymentStatus;
}

const FlightCard: React.FC<FlightCardProps> = ({ 
  flight, 
  clientName,
  paymentStatus,
}) => {
  const statusClass = getFlightStatusColor(flight.status);
  const paymentClass = getPaymentStatusColor(paymentStatus);
  
  return (
    <div className="w-full rounded-lg border border-border p-4 glass-dark animate-scale-in">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-primary" />
            <h3 className="font-medium">{flight.airline}</h3>
          </div>
          <Badge variant="outline" className={statusClass}>
            {flight.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(flight.date)}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CreditCard className="w-3.5 h-3.5" />
            <span className={paymentClass.includes('text-') ? paymentClass.split('text-')[1].split(' ')[0] : ''}>
              {paymentStatus}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
            <User className="w-3.5 h-3.5" />
            <Link to={`/client/${flight.clientId}`} className="hover:text-primary transition-colors">
              {clientName}
            </Link>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-1">
          Ticket: {flight.ticketNumber}
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
