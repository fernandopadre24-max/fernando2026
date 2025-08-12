
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Event, Artist, Contractor, PaymentMethod } from '@/types';

const eventSchema = z.object({
  date: z.string().min(1, 'A data é obrigatória.'),
  time: z.string().min(1, 'A hora é obrigatória.'),
  artistId: z.string().min(1, 'O artista é obrigatório.'),
  contractorId: z.string().min(1, 'O contratante é obrigatório.'),
  value: z.coerce.number().positive('O valor deve ser positivo.'),
  isDone: z.boolean(),
  isPaid: z.boolean(),
  paymentMethod: z.nativeEnum(PaymentMethod).nullable(),
  pixKey: z.string().optional().nullable(),
  observations: z.string().optional(),
  paidTo: z.string().optional().nullable(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  event: Event | null;
  artists: Artist[];
  contractors: Contractor[];
}

export function EventForm({
  isOpen,
  onClose,
  onSave,
  event,
  artists,
  contractors,
}: EventFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      date: event?.date || new Date().toISOString().split('T')[0],
      time: event?.time || '',
      artistId: event?.artistId || '',
      contractorId: event?.contractorId || '',
      value: event?.value || 0,
      isDone: event?.isDone || false,
      isPaid: event?.isPaid || false,
      paymentMethod: event?.paymentMethod || null,
      pixKey: event?.pixKey || '',
      observations: event?.observations || '',
      paidTo: event?.paidTo || '',
    },
  });
  
  const paymentMethod = watch('paymentMethod');

  const onSubmit = (data: EventFormData) => {
    const artist = artists.find(a => a.id === data.artistId)?.name || 'Desconhecido';
    const contractor = contractors.find(c => c.id === data.contractorId)?.name || 'Desconhecido';
    
    onSave({
      id: event?.id || '',
      ...data,
      artist,
      contractor,
      isTransferred: event?.isTransferred || false,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input id="time" type="time" {...register('time')} />
              {errors.time && <p className="text-sm text-red-500">{errors.time.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Artista</Label>
            <Controller name="artistId" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Selecione o artista" /></SelectTrigger>
                  <SelectContent>
                    {artists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            {errors.artistId && <p className="text-sm text-red-500">{errors.artistId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Contratante</Label>
            <Controller name="contractorId" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Selecione o contratante" /></SelectTrigger>
                  <SelectContent>
                    {contractors.map((contractor) => (
                      <SelectItem key={contractor.id} value={contractor.id}>{contractor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            {errors.contractorId && <p className="text-sm text-red-500">{errors.contractorId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Valor do Cachê</Label>
            <Input id="value" type="number" step="0.01" {...register('value')} />
            {errors.value && <p className="text-sm text-red-500">{errors.value.message}</p>}
          </div>

           <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <Controller name="paymentMethod" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                  <SelectTrigger><SelectValue placeholder="Selecione a forma de pagamento" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="Cartão">Cartão</SelectItem>
                  </SelectContent>
                </Select>
              )} />
          </div>

          {paymentMethod === 'PIX' && (
            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input id="pixKey" {...register('pixKey')} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea id="observations" {...register('observations')} />
          </div>

          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2">
                <Controller name="isDone" control={control} render={({ field }) => (
                    <Switch id="isDone" checked={field.value} onCheckedChange={field.onChange} />
                 )} />
                <Label htmlFor="isDone">Realizado?</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Controller name="isPaid" control={control} render={({ field }) => (
                    <Switch id="isPaid" checked={field.value} onCheckedChange={field.onChange} />
                 )} />
                <Label htmlFor="isPaid">Pago?</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
