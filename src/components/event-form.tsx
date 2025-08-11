
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, DollarSign, Loader2, Mic, UserSquare } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Artist, Contractor, Event } from '@/types';
import { useEffect } from 'react';

const formSchema = z.object({
  date: z.string().min(1, 'Data é obrigatória.'),
  time: z.string().min(1, 'Hora é obrigatória.'),
  artistId: z.string().min(1, 'Selecione um artista.'),
  contractorId: z.string().min(1, 'Selecione um contratante.'),
  value: z.coerce.number().min(0, 'Valor deve ser um número positivo.'),
});

export type EventFormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  onEventAdd: (data: EventFormValues) => Promise<void>;
  isSubmitting: boolean;
  artists: Artist[];
  contractors: Contractor[];
  eventToEdit?: Event | null;
  onEventUpdate?: (data: Event) => void;
  onClose?: () => void;
}

export function EventForm({ onEventAdd, isSubmitting, artists, contractors, eventToEdit, onEventUpdate, onClose }: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: '',
      time: '',
      artistId: '',
      contractorId: '',
      value: 100,
    },
  });

  useEffect(() => {
    if (eventToEdit) {
      form.reset({
        date: eventToEdit.date,
        time: eventToEdit.time,
        artistId: eventToEdit.artistId,
        contractorId: eventToEdit.contractorId,
        value: eventToEdit.value,
      });
    } else {
        form.reset({
            date: '',
            time: '',
            artistId: '',
            contractorId: '',
            value: 100,
        });
    }
  }, [eventToEdit, form]);

  async function onSubmit(values: EventFormValues) {
    if (eventToEdit && onEventUpdate) {
        onEventUpdate({
            ...eventToEdit,
            ...values,
        });
        if(onClose) onClose();
    } else {
      await onEventAdd(values);
      form.reset();
    }
  }

  return (
    <Card className={!onEventUpdate ? '' : 'border-0 shadow-none'}>
      <CardHeader className={!onEventUpdate ? '' : 'px-1'}>
        <CardTitle className="font-headline text-2xl">
            {eventToEdit ? 'Editar Evento' : 'Criar Novo Evento'}
        </CardTitle>
      </CardHeader>
      <CardContent className={!onEventUpdate ? '' : 'px-1'}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Evento</FormLabel>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="date" className="pl-10" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora do Evento</FormLabel>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="time" className="pl-10" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="artistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artista</FormLabel>
                  <div className="relative">
                    <Mic className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Selecione um artista" />
                        </SelectTrigger>
                        <SelectContent>
                          {artists.map((artist) => (
                            <SelectItem key={artist.id} value={artist.id}>
                              {artist.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contratante</FormLabel>
                   <div className="relative">
                    <UserSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Selecione um contratante" />
                        </SelectTrigger>
                        <SelectContent>
                          {contractors.map((contractor) => (
                            <SelectItem key={contractor.id} value={contractor.id}>
                              {contractor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Evento</FormLabel>
                     <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" placeholder="ex: 5000" className="pl-10" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" disabled={isSubmitting} className="w-full font-headline">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {eventToEdit ? 'Salvar Alterações' : 'Adicionar Evento'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
