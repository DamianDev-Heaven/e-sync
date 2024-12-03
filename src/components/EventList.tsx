import { useEffect, useState } from 'react';
import EventCard from './EventCard';
import { supabase } from '../supabaseClient';
import type { Event } from './../types';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'sports', name: 'Deportes' },
    { id: 'esports', name: 'E-Sports' },
    { id: 'racing', name: 'Fórmula 1' },
    { id: 'entertainment', name: 'Entretenimiento' },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) {
        console.error('Error fetching events:', error.message);
      } else {
        setEvents(data);
      }

      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Cargando eventos...</div>;
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut(); // Cierra sesión en Supabase
    if (error) {
      console.error('Error closing session:', error.message);
    } else {
      console.log("Usuario ha cerrado sesión");
      navigate("/"); // Redirige a la página de inicio
    }
  };
  console.log(currentPage);
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Eventos Disponibles</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.filter(
            (event) => filter === 'all' || event.category === filter
          ).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Siguiente
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
