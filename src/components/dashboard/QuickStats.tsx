
import React from "react";
import { Users, Plane, CircleDollarSign, ClipboardCheck } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="rounded-lg border border-border p-3 md:p-4 glass-dark animate-scale-in">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <div className="mt-2 md:mt-3">
        <p className="text-xs md:text-sm text-muted-foreground">{title}</p>
        <h3 className="text-xl md:text-2xl font-semibold mt-0.5 md:mt-1">{value}</h3>
      </div>
    </div>
  );
};

interface QuickStatsProps {
  totalClients: number;
  upcomingFlights: number;
  unpaidPayments: number;
  completedFlights: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  totalClients,
  upcomingFlights,
  unpaidPayments,
  completedFlights,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <StatCard
        title="Total Clients"
        value={totalClients}
        icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
      />
      
      <StatCard
        title="Upcoming Flights"
        value={upcomingFlights}
        icon={<Plane className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
      />
      
      <StatCard
        title="Unpaid Payments"
        value={unpaidPayments}
        icon={<CircleDollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
      />
      
      <StatCard
        title="Completed Flights"
        value={completedFlights}
        icon={<ClipboardCheck className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
      />
    </div>
  );
};

export default QuickStats;
