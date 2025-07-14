'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
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
import { useApiContext } from '@/lib/contexts/api-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '@/styles/phone-input.css';

// Define the form schema with Zod
const clientFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
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

export default function ClientsPage() {
  const api = useApiContext();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Client>, 'items'> | null>(null);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const fetchClients = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: '10',
        ...(search && { search }),
      });
      
      const response = await api.get<PaginatedResponse<Client>>(`/api/v1/clients/?${params}`);
      setClients(response.items);
      setPagination({
        total: response.total,
        page: response.page,
        page_size: response.page_size,
        total_pages: response.total_pages,
        has_next: response.has_next,
        has_previous: response.has_previous,
      });
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsLoading(true);
      await api.post('/api/v1/clients/', {
        ...data,
        created_at: new Date().toISOString(),
      });
      setIsNewClientModalOpen(false);
      reset();
      fetchClients(currentPage);
    } catch (error) {
      console.error('Failed to create client:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
        <Dialog 
          open={isNewClientModalOpen} 
          onOpenChange={(open) => {
            setIsNewClientModalOpen(open);
            if (!open) reset();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Name
                </label>
                <Input
                  {...register('name')}
                  placeholder="Enter client name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input
                  type="email"
                  {...register('email')}
                  placeholder="Enter client email"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Phone Number
                </label>
                <div className={`rounded-md border ${errors.phone ? 'border-red-500' : ''}`}>
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={watch('phone')}
                    onChange={(value) => setValue('phone', value || '')}
                    className="flex h-10 w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit"
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Client'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{new Date(client.created_at).toLocaleDateString()}</TableCell>
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
    </div>
  );
} 