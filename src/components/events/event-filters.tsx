
'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Artist, Contractor } from '@/types';
import { DateRange } from 'react-day-picker';
import { X } from 'lucide-react';

interface EventFiltersProps {
  artists: Artist[];
  contractors: Contractor[];
  artistFilter: string;
  onArtistChange: (value: string) => void;
  contractorFilter: string;
  onContractorChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  paymentStatusFilter: string;
  onPaymentStatusChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (date: DateRange | undefined) => void;
  onClearFilters: () => void;
}

export function EventFilters({
  artists,
  contractors,
  artistFilter,
  onArtistChange,
  contractorFilter,
  onContractorChange,
  statusFilter,
  onStatusChange,
  paymentStatusFilter,
  onPaymentStatusChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
}: EventFiltersProps) {
  return (
    <div className="p-4 bg-card border rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <Select value={artistFilter} onValueChange={onArtistChange}>
          <SelectTrigger><SelectValue placeholder="Filtrar por artista..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Artistas</SelectItem>
            {artists.map(artist => (
              <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={contractorFilter} onValueChange={onContractorChange}>
          <SelectTrigger><SelectValue placeholder="Filtrar por contratante..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Contratantes</SelectItem>
            {contractors.map(contractor => (
              <SelectItem key={contractor.id} value={contractor.id}>{contractor.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <DatePickerWithRange date={dateRange} onDateChange={onDateRangeChange} />

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger><SelectValue placeholder="Filtrar por status do evento..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="true">Realizado</SelectItem>
            <SelectItem value="false">Pendente</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentStatusFilter} onValueChange={onPaymentStatusChange}>
          <SelectTrigger><SelectValue placeholder="Filtrar por status do pagamento..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Pagamentos</SelectItem>
            <SelectItem value="true">Pago</SelectItem>
            <SelectItem value="false">Pendente</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onClearFilters} variant="ghost">
          <X className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
