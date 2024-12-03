import { ReactNode } from "react";

export interface Event {
    image: string | undefined;
    location: ReactNode;
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    price: number;
    category: 'sports' | 'esports' | 'entertainment' | 'racing';
    image_url: string;
  }
  
  export interface Ticket {
    event_id: number; // o string, según tu definición en la base de datos
    quantity: number; // Cantidad de tickets comprados
    total_price: number; // Precio total de la compra
    created_at: string; // Fecha de compra en formato ISO
    event: Event; // Información adicional del evento (opcional)
    location: string;
  }

  export interface User {
    id?: string; // Cambiado a opcional
    name?: string; // Cambiado a opcional
    email?: string; // Cambiado a opcional
    tickets?: string[]; // Cambiado a opcional
    display_name?: string; // Cambiado a opcional
    photo_url?: string;
  }