export type Event = {
  id: string;
  date: string;
  time: string;
  artist: string;
  contractor: string;
  value: number;
};

export type Artist = {
  id: string;
  name: string;
};

export type Contractor = {
  id: string;
  name: string;
};
