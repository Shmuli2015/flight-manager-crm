
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Plane, CircleDollarSign, FileText, CalendarClock, PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Layout from "@/components/layout/Layout";
import FlightCard from "@/components/ui/FlightCard";
import { PaymentStatus, FlightStatus, ActivityType } from "@/utils/types";
import { generateMockId, formatDate, getPaymentStatusColor } from "@/utils/helpers";

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [clientForm, setClientForm] = useState({
    name: "",
    phone: "",
    birthdate: "",
    isFreeService: false
  });
  
  // Mock data - will be replaced with Supabase data
  const [client, setClient] = useState({
    id: id || generateMockId(),
    name: "John Smith",
    phone: "+1 (555) 123-4567",
    birthdate: "1985-06-15",
    isFreeService: false,
    createdAt: "2023-04-20T10:30:00Z",
  });
  
  const mockFlights = [
    {
      id: generateMockId(),
      clientId: client.id,
      date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
      airline: "Delta Airlines",
      ticketNumber: "DL123456",
      status: FlightStatus.UPCOMING,
      createdAt: new Date().toISOString(),
      paymentStatus: PaymentStatus.UNPAID,
    },
    {
      id: generateMockId(),
      clientId: client.id,
      date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
      airline: "United Airlines",
      ticketNumber: "UA678901",
      status: FlightStatus.HAPPENED,
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      paymentStatus: PaymentStatus.PAID,
    },
  ];
  
  const mockActivityLogs = [
    {
      id: generateMockId(),
      clientId: client.id,
      type: ActivityType.FLIGHT_BOOKED,
      description: "Flight to New York booked",
      metadata: {
        airline: "Delta Airlines",
        flightDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      },
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
      id: generateMockId(),
      clientId: client.id,
      type: ActivityType.PAYMENT_RECEIVED,
      description: "Payment received for United Airlines flight",
      metadata: {
        amount: 350,
        method: "Card",
      },
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: generateMockId(),
      clientId: client.id,
      type: ActivityType.NOTE,
      description: "Client requested window seat for next flight",
      metadata: {},
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.FLIGHT_BOOKED:
      case ActivityType.FLIGHT_RESCHEDULED:
      case ActivityType.FLIGHT_CANCELED:
        return <Plane className="w-5 h-5 text-primary" />;
      case ActivityType.PAYMENT_RECEIVED:
        return <CircleDollarSign className="w-5 h-5 text-green-500" />;
      case ActivityType.MARKED_FREE_SERVICE:
        return <Badge className="w-5 h-5 text-purple-500" />;
      case ActivityType.NOTE:
        return <FileText className="w-5 h-5 text-amber-500" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const openEditDialog = () => {
    setClientForm({
      name: client.name,
      phone: client.phone,
      birthdate: client.birthdate,
      isFreeService: client.isFreeService
    });
    setIsEditDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setClientForm({
      ...clientForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveEdit = () => {
    // In a real app, this would update the database via Supabase
    setClient({
      ...client,
      ...clientForm
    });
    setIsEditDialogOpen(false);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="shrink-0">
              <Link to="/clients">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{client.name}</h1>
              <p className="text-sm text-muted-foreground">Client since {formatDate(client.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex gap-2 self-start">
            <Button variant="outline" size="sm" onClick={openEditDialog}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-lg border bg-card mobile-card">
              <h2 className="text-xl font-semibold mb-4">Client Information</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium mobile-text-base">{client.phone}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Birthdate</p>
                  <p className="font-medium mobile-text-base">{formatDate(client.birthdate)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <div className="mt-1">
                    <Badge 
                      variant="outline"
                      className={getPaymentStatusColor(client.isFreeService ? PaymentStatus.FREE_SERVICE : PaymentStatus.UNPAID)}
                    >
                      {client.isFreeService ? "Free Service" : "Unpaid"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card mobile-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button className="justify-start">
                  <Plane className="mr-2 h-4 w-4" />
                  Book New Flight
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <CircleDollarSign className="mr-2 h-4 w-4" />
                  Record Payment
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Reschedule Flight
                </Button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="flights" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="flights">Flights</TabsTrigger>
                <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="flights" className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Flight History</h2>
                  <Button size="sm" asChild>
                    <Link to={`/flights/new?clientId=${client.id}`}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Add Flight</span>
                      <span className="sm:hidden">Add</span>
                    </Link>
                  </Button>
                </div>
                
                {mockFlights.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-lg bg-muted/50">
                    <p className="text-muted-foreground">No flights found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {mockFlights.map(flight => (
                      <FlightCard
                        key={flight.id}
                        flight={flight}
                        clientName={client.name}
                        paymentStatus={flight.paymentStatus}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="activity" className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Activity Timeline</h2>
                </div>
                
                {mockActivityLogs.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-lg bg-muted/50">
                    <p className="text-muted-foreground">No activity found</p>
                  </div>
                ) : (
                  <div className="relative pl-6 border-l">
                    {mockActivityLogs.map((log, index) => (
                      <div 
                        key={log.id} 
                        className={`relative pb-6 ${index === mockActivityLogs.length - 1 ? '' : ''}`}
                      >
                        <div className="absolute -left-[22px] h-8 w-8 rounded-full bg-background border-2 border-border flex items-center justify-center">
                          {getActivityIcon(log.type)}
                        </div>
                        
                        <div className="pl-4">
                          <div className="flex items-center gap-2">
                            <p className="font-medium mobile-text-base">{log.description}</p>
                          </div>
                          <time className="text-sm text-muted-foreground">
                            {formatDate(log.createdAt)}
                          </time>
                          
                          {log.type === ActivityType.PAYMENT_RECEIVED && log.metadata.amount && (
                            <p className="mt-2 text-sm">
                              Amount: <span className="font-medium">${log.metadata.amount}</span> • 
                              Method: <span className="font-medium">{log.metadata.method}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={clientForm.name} 
                onChange={handleFormChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={clientForm.phone} 
                onChange={handleFormChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input 
                id="birthdate" 
                name="birthdate" 
                type="date" 
                value={clientForm.birthdate} 
                onChange={handleFormChange} 
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="free-service" 
                name="isFreeService"
                checked={clientForm.isFreeService} 
                onCheckedChange={(checked) => setClientForm({...clientForm, isFreeService: checked})} 
              />
              <Label htmlFor="free-service">Free Service</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ClientDetails;
