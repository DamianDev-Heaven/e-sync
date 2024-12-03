import { Calendar, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { supabase } from '../supabaseClient';
import ImageLoader from './ImageLoader'; // Componente para cargar imágenes
import type { Event } from '../types'; // Importa los tipos necesarios
import type { User } from '@supabase/supabase-js'; // Asegura el tipo de usuario de Supabase

interface EventCardProps {
  event: Event;
  onSelect?: (event: Event) => void;
}

export default function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null); // Estado del usuario logueado

  // Verificar el estado de la sesión del usuario
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    fetchSession();
  }, []);

  // Formateo de la fecha del evento
  const eventDate = parseISO(event.date);
  if (!isValid(eventDate)) {
    console.error('Fecha no válida:', event.date);
    return <div>Error al cargar el evento.</div>;
  }
  const formattedDate = format(eventDate, 'dd/MM/yyyy');
  const formattedTime = format(eventDate, 'HH:mm');

  // Manejar el clic en el botón de compra
  const handleBuyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) {
      alert('Debes iniciar sesión para comprar boletos.');
      navigate('/LoginPage');
    } else {
      navigate('/BuyTickets', { state: { event } });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <ImageLoader
        imageUrl={event.image_url}
        altText={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{event.description}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.venue}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600">
            ${event.price.toFixed(2)}
          </span>
          <button
            onClick={handleBuyClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-center"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
