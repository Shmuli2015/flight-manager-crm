
import React from "react";
import { CircleDollarSign } from "lucide-react";
import { Client, PaymentStatus } from "@/utils/types";
import ClientCard from "@/components/ui/ClientCard";

interface UnpaidPaymentsProps {
  clients: Client[];
}

const UnpaidPayments: React.FC<UnpaidPaymentsProps> = ({ clients }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CircleDollarSign className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Unpaid Payments</h2>
      </div>
      
      {clients.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg bg-muted/50">
          <p className="text-muted-foreground">No unpaid payments</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {clients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              paymentStatus={PaymentStatus.UNPAID}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UnpaidPayments;
