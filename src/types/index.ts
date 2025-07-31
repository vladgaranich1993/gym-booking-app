export interface Event {
  id: string;
  title: string;
  category: string;
  time: string;
  image?: string;
  price: number;
  spotsAvailable: number;
  trainers: Trainer[];
}

export interface Booking {
  id: string;
  eventId: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Trainer {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}