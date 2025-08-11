'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, DollarSign, Loader2, Mic, UserSquare, MessageSquareText } from 'lucide-react';

const formSchema = z.object({
  date: z.string().min(1, 'Date is required.'),
  time: z.string().min(1, 'Time is required.'),
  artist: z.string().min(2, 'Artist name must be at least 2 characters.'),
  contractor: z.string().min(2, 'Contractor name must be at least 2 characters.'),
  value: z.coerce.number().min(0, 'Value must be a positive number.'),
  historicalFeedback: z.string().optional(),
});

export type EventFormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  onEventAdd: (data: EventFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function EventForm({ onEventAdd, isSubmitting }: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: '',
      time: '',
      artist: '',
      contractor: '',
      value: 0,
      historicalFeedback: '',
    },
  });

  async function onSubmit(values: EventFormValues) {
    await onEventAdd(values);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
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
                    <FormLabel>Event Time</FormLabel>
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
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <div className="relative">
                    <Mic className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="e.g., The Vibe Setters" className="pl-10" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contractor</FormLabel>
                   <div className="relative">
                    <UserSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="e.g., Venue Masters Inc." className="pl-10" {...field} />
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
                    <FormLabel>Event Value</FormLabel>
                     <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5000" className="pl-10" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalFeedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Feedback (Optional)</FormLabel>
                    <div className="relative">
                       <MessageSquareText className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                       <FormControl>
                        <Textarea
                          placeholder="Provide any past feedback for similar events to improve AI insights..."
                          className="pl-10 resize-none"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" disabled={isSubmitting} className="w-full font-headline">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Event & Get Insights
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
