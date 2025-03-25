
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import Layout from "@/components/layout/Layout";
import FlightCard from "@/components/ui/FlightCard";
import { FlightStatus, PaymentStatus } from "@/utils/types";
import { generateMockId } from "@/utils/helpers";

const FlightsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState({
    upcoming: false,
    happened: false,
    canceled: false,
    rescheduled: false,
  });
  const [paymentFilters, setPaymentFilters] = useState({
    paid: false,
    unpaid: false,
    free: false,
  });

  // Mock data - will be replaced with Supabase data
  const mockFlights = [
    {
      flight: {
        id: generateMockId(),
        clientId: generateMockId(),
        date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        airline: "Delta Airlines",
        ticketNumber: "DL123456",
        status: FlightStatus.UPCOMING,
        createdAt: new Date().toISOString(),
      },
      clientName: "John Smith",
      paymentStatus: PaymentStatus.UNPAID,
    },
    {
      flight: {
        id: generateMockId(),
        clientId: generateMockId(),
        date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
        airline: "United Airlines",
        ticketNumber: "UA678901",
        status: FlightStatus.UPCOMING,
        createdAt: new Date().toISOString(),
      },
      clientName: "Sarah Johnson",
      paymentStatus: PaymentStatus.PAID,
    },
    {
      flight: {
        id: generateMockId(),
        clientId: generateMockId(),
        date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        airline: "American Airlines",
        ticketNumber: "AA234567",
        status: FlightStatus.HAPPENED,
        createdAt: new Date().toISOString(),
      },
      clientName: "Michael Thompson",
      paymentStatus: PaymentStatus.FREE_SERVICE,
    },
    {
      flight: {
        id: generateMockId(),
        clientId: generateMockId(),
        date: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
        airline: "British Airways",
        ticketNumber: "BA345678",
        status: FlightStatus.CANCELED,
        createdAt: new Date().toISOString(),
      },
      clientName: "Emily Davis",
      paymentStatus: PaymentStatus.UNPAID,
    },
    {
      flight: {
        id: generateMockId(),
        clientId: generateMockId(),
        date: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
        airline: "Lufthansa",
        ticketNumber: "LH456789",
        status: FlightStatus.RESCHEDULED,
        createdAt: new Date().toISOString(),
      },
      clientName: "David Wilson",
      paymentStatus: PaymentStatus.PAID,
    },
  ];

  // Filter flights based on search query and filters
  const filteredFlights = mockFlights.filter(({ flight, clientName }) => {
    // Search filter
    const matchesSearch = 
      clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filters
    const statusFilterActive = Object.values(statusFilters).some(Boolean);
    const matchesStatus = !statusFilterActive || (
      (statusFilters.upcoming && flight.status === FlightStatus.UPCOMING) ||
      (statusFilters.happened && flight.status === FlightStatus.HAPPENED) ||
      (statusFilters.canceled && flight.status === FlightStatus.CANCELED) ||
      (statusFilters.rescheduled && flight.status === FlightStatus.RESCHEDULED)
    );
    
    // Payment filters
    const paymentFilterActive = Object.values(paymentFilters).some(Boolean);
    const matchesPayment = !paymentFilterActive || (
      (paymentFilters.paid && PaymentStatus.PAID === PaymentStatus.PAID) ||
      (paymentFilters.unpaid && PaymentStatus.UNPAID === PaymentStatus.UNPAID) ||
      (paymentFilters.free && PaymentStatus.FREE_SERVICE === PaymentStatus.FREE_SERVICE)
    );
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusFilterChange = (key: keyof typeof statusFilters) => {
    setStatusFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePaymentFilterChange = (key: keyof typeof paymentFilters) => {
    setPaymentFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setStatusFilters({
      upcoming: false,
      happened: false,
      canceled: false,
      rescheduled: false,
    });
    setPaymentFilters({
      paid: false,
      unpaid: false,
      free: false,
    });
  };

  const isFiltering = Object.values(statusFilters).some(Boolean) || Object.values(paymentFilters).some(Boolean);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Flights</h1>
        <Button asChild>
          <Link to="/flights/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Flight
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, airline, or ticket number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status</span>
                {Object.values(statusFilters).some(Boolean) && (
                  <span className="flex h-2 w-2 rounded-full bg-primary ml-1"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilters.upcoming}
                onCheckedChange={() => handleStatusFilterChange('upcoming')}
              >
                Upcoming
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilters.happened}
                onCheckedChange={() => handleStatusFilterChange('happened')}
              >
                Happened
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilters.canceled}
                onCheckedChange={() => handleStatusFilterChange('canceled')}
              >
                Canceled
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilters.rescheduled}
                onCheckedChange={() => handleStatusFilterChange('rescheduled')}
              >
                Rescheduled
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Payment</span>
                {Object.values(paymentFilters).some(Boolean) && (
                  <span className="flex h-2 w-2 rounded-full bg-primary ml-1"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Payment</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={paymentFilters.paid}
                onCheckedChange={() => handlePaymentFilterChange('paid')}
              >
                Paid
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={paymentFilters.unpaid}
                onCheckedChange={() => handlePaymentFilterChange('unpaid')}
              >
                Unpaid
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={paymentFilters.free}
                onCheckedChange={() => handlePaymentFilterChange('free')}
              >
                Free Service
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isFiltering && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {filteredFlights.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg bg-muted/50">
          <p className="text-muted-foreground">No flights found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFlights.map(({ flight, clientName, paymentStatus }) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              clientName={clientName}
              paymentStatus={paymentStatus}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default FlightsPage;
