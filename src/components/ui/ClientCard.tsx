
import React from "react";
import { Link } from "react-router-dom";
import { Phone, Calendar, Badge, ArrowRight } from "lucide-react";
import { Client, PaymentStatus } from "@/utils/types";
import { getInitials, getPaymentStatusColor } from "@/utils/helpers";
import { Badge as UiBadge } from "@/components/ui/badge";

interface ClientCardProps {
  client: Client;
  paymentStatus?: PaymentStatus;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, paymentStatus = PaymentStatus.UNPAID }) => {
  const statusClass = getPaymentStatusColor(client.isFreeService ? PaymentStatus.FREE_SERVICE : paymentStatus);
  
  return (
    <Link 
      to={`/client/${client.id}`}
      className="block w-full transition-all duration-300 rounded-lg border border-border p-4 group glass-dark hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-semibold text-lg">
          {getInitials(client.name)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground truncate">{client.name}</h3>
            <UiBadge 
              variant="outline" 
              className={`ml-2 ${statusClass}`}
            >
              {client.isFreeService ? "Free Service" : paymentStatus}
            </UiBadge>
          </div>
          
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>{client.phone}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{client.birthdate}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 self-center">
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
};

export default ClientCard;
