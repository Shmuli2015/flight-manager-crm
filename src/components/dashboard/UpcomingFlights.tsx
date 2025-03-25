
import React from "react";
import { CalendarClock } from "lucide-react";
import { Flight, FlightStatus, PaymentStatus } from "@/utils/types";
import FlightCard from "@/components/ui/FlightCard";

interface UpcomingFlightsProps {
  flights: Array<{ 
    flight: Flight;
    clientName: string;
    paymentStatus: PaymentStatus;
  }>;
}

const UpcomingFlights: React.FC<UpcomingFlightsProps> = ({ flights }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarClock className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Upcoming Flights</h2>
      </div>
      
      {flights.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg bg-muted/50">
          <p className="text-muted-foreground">No upcoming flights</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {flights.map(({ flight, clientName, paymentStatus }) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              clientName={clientName}
              paymentStatus={paymentStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingFlights;
