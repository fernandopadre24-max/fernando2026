
export type PaymentMethod = 'PIX' | 'Dinheiro' | 'Cartão';

export type Event = {
  id: string;
  date: string;
  time: string;
  artist: string;
  artistId: string;
  contractor: string;
  contractorId: string;
  value: number;
  isDone: boolean;
  isPaid: boolean;
  paymentMethod?: PaymentMethod | null;
};

export type Artist = {
  id: string;
  name: string;
};

export type Contractor = {
  id: string;
  name: string;
};
