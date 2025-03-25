
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import QuickStats from "@/components/dashboard/QuickStats";
import UpcomingFlights from "@/components/dashboard/UpcomingFlights";
import UnpaidPayments from "@/components/dashboard/UnpaidPayments";
import { FlightStatus, PaymentStatus, Client, Flight } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";

// Extended client interface for the dashboard that includes payment status
interface ClientWithPaymentStatus extends Client {
  paymentStatus: PaymentStatus;
}

const Index: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<ClientWithPaymentStatus[]>([]);
  const [flights, setFlights] = useState<Array<{ 
    flight: Flight;
    clientName: string;
    paymentStatus: PaymentStatus;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    upcomingFlights: 0,
    unpaidPayments: 0,
    completedFlights: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch clients
        const { data: clientsData, error: clientsError } = await supabase
          .from("clients")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (clientsError) throw clientsError;
        
        const clientsWithPaymentStatus = clientsData.map(client => ({
          ...client,
          id: client.id,
          name: client.name,
          phone: client.phone || "",
          birthdate: client.birthdate || "",
          isFreeService: client.is_free_service,
          createdAt: client.created_at,
          // Mock payment status for now, would be from a payments table in a real app
          paymentStatus: client.is_free_service 
            ? PaymentStatus.FREE_SERVICE 
            : Math.random() > 0.5 ? PaymentStatus.PAID : PaymentStatus.UNPAID
        }));
        
        setClients(clientsWithPaymentStatus);
        
        // Fetch flights with client names
        const { data: flightsData, error: flightsError } = await supabase
          .from("flights")
          .select(`
            *,
            clients (
              name,
              is_free_service
            )
          `)
          .order("date", { ascending: true });
        
        if (flightsError) throw flightsError;
        
        const processedFlights = flightsData.map(flight => ({
          flight: {
            id: flight.id,
            clientId: flight.client_id,
            date: flight.date,
            airline: flight.airline,
            ticketNumber: flight.ticket_number || "",
            status: flight.status as FlightStatus,
            createdAt: flight.created_at,
          },
          clientName: flight.clients?.name || "Unknown Client",
          // Mock payment status for now
          paymentStatus: flight.clients?.is_free_service 
            ? PaymentStatus.FREE_SERVICE 
            : Math.random() > 0.5 ? PaymentStatus.PAID : PaymentStatus.UNPAID
        }));
        
        setFlights(processedFlights);
        
        // Calculate stats
        const upcomingFlightsCount = flightsData.filter(
          flight => flight.status === FlightStatus.UPCOMING || flight.status === FlightStatus.DELAYED
        ).length;
        
        const completedFlightsCount = flightsData.filter(
          flight => flight.status === FlightStatus.COMPLETED
        ).length;
        
        const unpaidPaymentsCount = clientsWithPaymentStatus.filter(
          client => !client.isFreeService && client.paymentStatus === PaymentStatus.UNPAID
        ).length;
        
        setStats({
          totalClients: clientsWithPaymentStatus.length,
          upcomingFlights: upcomingFlightsCount,
          unpaidPayments: unpaidPaymentsCount,
          completedFlights: completedFlightsCount,
        });
        
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="flex-1 sm:flex-initial justify-center">
            <Link to="/clients/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Client</span>
              <span className="sm:hidden">Client</span>
            </Link>
          </Button>
          <Button asChild className="flex-1 sm:flex-initial justify-center">
            <Link to="/flights/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Flight</span>
              <span className="sm:hidden">Flight</span>
            </Link>
          </Button>
        </div>
      </div>
      
      <QuickStats
        totalClients={stats.totalClients}
        upcomingFlights={stats.upcomingFlights}
        unpaidPayments={stats.unpaidPayments}
        completedFlights={stats.completedFlights}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 md:mt-8">
        <UpcomingFlights 
          flights={flights.filter(f => 
            f.flight.status === FlightStatus.UPCOMING || 
            f.flight.status === FlightStatus.DELAYED
          ).slice(0, 5)} 
        />
        <UnpaidPayments 
          clients={clients.filter(client => 
            !client.isFreeService && client.paymentStatus === PaymentStatus.UNPAID
          ).slice(0, 5)} 
        />
      </div>
    </Layout>
  );
};

export default Index;
