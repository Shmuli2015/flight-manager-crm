
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import ClientCard from "@/components/ui/ClientCard";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { PaymentStatus } from "@/utils/types";
import { generateMockId } from "@/utils/helpers";

const ClientsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    showUnpaid: false,
    showFreeService: false,
    showWithUpcomingFlights: false,
  });

  // Mock data - will be replaced with Supabase data
  const mockClients = [
    {
      id: generateMockId(),
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      birthdate: "1985-06-15",
      isFreeService: false,
      createdAt: new Date().toISOString(),
      paymentStatus: PaymentStatus.UNPAID,
      hasUpcomingFlights: true,
    },
    {
      id: generateMockId(),
      name: "Sarah Johnson",
      phone: "+1 (555) 987-6543",
      birthdate: "1990-03-22",
      isFreeService: false,
      createdAt: new Date().toISOString(),
      paymentStatus: PaymentStatus.PAID,
      hasUpcomingFlights: true,
    },
    {
      id: generateMockId(),
      name: "Michael Thompson",
      phone: "+1 (555) 456-7890",
      birthdate: "1978-11-07",
      isFreeService: true,
      createdAt: new Date().toISOString(),
      paymentStatus: PaymentStatus.FREE_SERVICE,
      hasUpcomingFlights: false,
    },
    {
      id: generateMockId(),
      name: "Emily Davis",
      phone: "+1 (555) 789-0123",
      birthdate: "1995-09-30",
      isFreeService: false,
      createdAt: new Date().toISOString(),
      paymentStatus: PaymentStatus.UNPAID,
      hasUpcomingFlights: false,
    },
    {
      id: generateMockId(),
      name: "David Wilson",
      phone: "+1 (555) 234-5678",
      birthdate: "1982-04-12",
      isFreeService: false,
      createdAt: new Date().toISOString(),
      paymentStatus: PaymentStatus.PAID,
      hasUpcomingFlights: true,
    },
  ];

  // Filter clients based on search query and filters
  const filteredClients = mockClients.filter((client) => {
    // Search filter
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           client.phone.includes(searchQuery);
    
    // Check if any filter is active
    const isFilterActive = filters.showUnpaid || filters.showFreeService || filters.showWithUpcomingFlights;
    
    // If no filters are active, only apply search filter
    if (!isFilterActive) {
      return matchesSearch;
    }
    
    // Apply each active filter
    const matchesUnpaid = filters.showUnpaid ? client.paymentStatus === PaymentStatus.UNPAID : false;
    const matchesFreeService = filters.showFreeService ? client.isFreeService : false;
    const matchesUpcoming = filters.showWithUpcomingFlights ? client.hasUpcomingFlights : false;
    
    // Return true if search matches AND at least one active filter matches
    return matchesSearch && (matchesUnpaid || matchesFreeService || matchesUpcoming);
  });

  const handleFilterChange = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setFilters({
      showUnpaid: false,
      showFreeService: false,
      showWithUpcomingFlights: false,
    });
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <Button asChild>
          <Link to="/clients/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Client
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
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
                <span>Filter</span>
                {(filters.showUnpaid || filters.showFreeService || filters.showWithUpcomingFlights) && (
                  <span className="flex h-2 w-2 rounded-full bg-primary ml-1"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Clients</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.showUnpaid}
                onCheckedChange={() => handleFilterChange('showUnpaid')}
              >
                Unpaid Payments
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.showFreeService}
                onCheckedChange={() => handleFilterChange('showFreeService')}
              >
                Free Service
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.showWithUpcomingFlights}
                onCheckedChange={() => handleFilterChange('showWithUpcomingFlights')}
              >
                With Upcoming Flights
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={clearFilters}
                  disabled={!Object.values(filters).some(Boolean)}
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {filteredClients.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg bg-muted/50">
          <p className="text-muted-foreground">No clients found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map(client => (
            <ClientCard 
              key={client.id} 
              client={client} 
              paymentStatus={client.paymentStatus}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default ClientsPage;
