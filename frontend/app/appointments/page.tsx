'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApiContext } from '@/lib/contexts/api-context';

type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface Appointment {
  id: string;
  client_id: string;
  client?: Client;
  time: string;
  notes: string;
  status: AppointmentStatus;
  created_at: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AppointmentsPage() {
  const api = useApiContext();
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Appointment>, 'items'> | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<AppointmentStatus | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    client_id: '',
    time: '',
    notes: '',
    status: 'scheduled' as AppointmentStatus,
  });

  const fetchAppointments = async (page: number = 1, filters: Record<string, any> = {}) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: '10',
        ...(filters.search && { search: filters.search }),
        ...(filters.start_date && { start_date: filters.start_date }),
        ...(filters.end_date && { end_date: filters.end_date }),
        ...(filters.status && { status: filters.status }),
      });
      
      const response = await api.get<PaginatedResponse<Appointment>>(`/api/v1/appointments?${params}`);
      
      // Fetch client details for each appointment
      const appointmentsWithClients = await Promise.all(
        response.items.map(async (appointment) => {
          try {
            const client = await api.get<Client>(`/api/v1/clients/${appointment.client_id}`);
            return { ...appointment, client };
          } catch (error) {
            console.error(`Failed to fetch client for appointment ${appointment.id}:`, error);
            return appointment;
          }
        })
      );

      setAppointments(appointmentsWithClients);
      setPagination({
        total: response.total,
        page: response.page,
        page_size: response.page_size,
        total_pages: response.total_pages,
        has_next: response.has_next,
        has_previous: response.has_previous,
      });
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get<PaginatedResponse<Client>>('/api/v1/clients?page_size=100');
      setClients(response.items);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  useEffect(() => {
    const filters = {
      search: searchTerm,
      start_date: startDate,
      end_date: endDate,
      status: status,
    };
    
    fetchAppointments(currentPage, filters);
  }, [searchTerm, startDate, endDate, status, currentPage]);

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateAppointment = async () => {
    try {
      setIsLoading(true);
      await api.post('/api/v1/appointments', newAppointment);
      setIsNewAppointmentModalOpen(false);
      setNewAppointment({
        client_id: '',
        time: '',
        notes: '',
        status: 'scheduled',
      });
      fetchAppointments(currentPage);
    } catch (error) {
      console.error('Failed to create appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAppointment = async () => {
    if (!selectedAppointment) return;
    try {
      setIsLoading(true);
      await api.put(`/api/v1/appointments/${selectedAppointment.id}`, selectedAppointment);
      setIsEditAppointmentModalOpen(false);
      setSelectedAppointment(null);
      fetchAppointments(currentPage);
    } catch (error) {
      console.error('Failed to update appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setStatus(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
        <Dialog open={isNewAppointmentModalOpen} onOpenChange={setIsNewAppointmentModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Select
                  value={newAppointment.client_id}
                  onValueChange={(value) => setNewAppointment({ ...newAppointment, client_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Input
                  type="datetime-local"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Select
                  value={newAppointment.status}
                  onValueChange={(value: AppointmentStatus) => setNewAppointment({ ...newAppointment, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleCreateAppointment}
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Appointment'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <Select
            value={status || undefined}
            onValueChange={(value: AppointmentStatus) => setStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 items-center">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-[180px]"
          />
          <span className="text-gray-500">to</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-[180px]"
          />
          {(searchTerm || startDate || endDate || status) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.client?.name || 'Unknown Client'}</TableCell>
                  <TableCell>{new Date(appointment.time).toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`capitalize ${
                      appointment.status === 'completed' ? 'text-green-600' :
                      appointment.status === 'cancelled' ? 'text-red-600' :
                      appointment.status === 'confirmed' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell>{appointment.notes}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setIsEditAppointmentModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.page_size) + 1} to{' '}
            {Math.min(pagination.page * pagination.page_size, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.has_previous || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.has_next || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      <Dialog open={isEditAppointmentModalOpen} onOpenChange={setIsEditAppointmentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Select
                  value={selectedAppointment.client_id}
                  onValueChange={(value) => setSelectedAppointment({ ...selectedAppointment, client_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Input
                  type="datetime-local"
                  value={selectedAppointment.time}
                  onChange={(e) => setSelectedAppointment({ ...selectedAppointment, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Select
                  value={selectedAppointment.status}
                  onValueChange={(value: AppointmentStatus) => setSelectedAppointment({ ...selectedAppointment, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Notes"
                  value={selectedAppointment.notes}
                  onChange={(e) => setSelectedAppointment({ ...selectedAppointment, notes: e.target.value })}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleEditAppointment}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 