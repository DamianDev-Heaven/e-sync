import { User, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { User as UserType, Ticket as TicketType } from '../types/index';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

type TicketPopupProps = {
  ticket: TicketType | null;
  onClose: () => void;
};

const TicketPopup = ({ ticket, onClose }: TicketPopupProps) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
        <h3 className="text-lg font-bold">{ticket.event.title}</h3>
        <img src={ticket.event.image} alt={ticket.event.title} className="mt-2 mb-4 rounded-md" />
        <p><strong>Fecha:</strong> {new Date(ticket.event.date).toLocaleDateString()}</p>
        <p><strong>Hora:</strong> {ticket.event.time}</p>
        <p><strong>Lugar:</strong> {ticket.event.location}</p>
        <p><strong>Descripción:</strong> {ticket.event.description}</p>
        <button className="mt-4 text-indigo-600 hover:text-indigo-500" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default function AccountDashboard() {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null); // Estado para el ticket seleccionado
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error cerrando sesión:", error.message);
    } else {
      console.log("Usuario ha cerrado sesión");
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error fetching session:', sessionError.message);
        setLoading(false);
        return;
      }

      const user = session?.user;

      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('uid', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error.message);
        } else {
          setUserData(data);
        }

        // Obtener tickets del usuario
        const { data: ticketsData, error: ticketsError } = await supabase
        .from('purchases')
        .select('event_id, quantity, total_price, created_at')
        .eq('user_id', user.id);

        if (ticketsError) {
          console.error('Error fetching tickets:', ticketsError.message);
        } else {
          const enrichedTickets = await Promise.all(
          ticketsData.map(async (ticket) => {
        const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', ticket.event_id)
        .single();

      if (eventError) {
        console.error('Error fetching event details:', eventError.message);
        return null;
      }

      return {
        ...ticket,
        event: eventData,
      };
    })
  );

  setTickets(enrichedTickets.filter(Boolean) as TicketType[]);
}


      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleViewTicket = async (ticket: TicketType) => {
    try {
      const { data: eventData, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', ticket.event_id)
        .single();

      if (error) {
        console.error('Error fetching event data:', error.message);
        return;
      }

      const ticketWithEventDetails = { ...ticket, event: eventData };
      setSelectedTicket(ticketWithEventDetails);
    } catch (err) {
      console.error('Unexpected error:', (err as Error).message);
    }
  };

  const handleClosePopup = () => {
    setSelectedTicket(null);
  };

  if (loading) {
    return <div>Cargando información del usuario...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      <section>
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900">Mi Cuenta</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 rounded-full p-3">
                        {userData?.photo_url ? (
                          <img src={userData.photo_url} alt="Profile" className="h-10 w-10 rounded-full" />
                        ) : (
                          <User className="h-6 w-6 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{userData?.display_name}</p>
                          <p className="text-sm text-gray-600">{userData?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-indigo-100 rounded-full p-3">
                        <Ticket className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Mis Tickets</h3>
                    </div>

                    <div className="space-y-4">
                      {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                          <div key={ticket.event_id} className="bg-white p-4 rounded-md shadow-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-gray-900">{/* Título del evento */}</h4>
                                <p className="text-sm text-gray-500">{ticket.quantity} tickets</p>
                                <p className="text-sm text-gray-500">Total: ${ticket.total_price.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">Comprado el: {new Date(ticket.created_at).toLocaleDateString()}</p>
                              </div>
                              <button
                                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                                onClick={() => handleViewTicket(ticket)}
                              >
                                Ver Ticket
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No tienes tickets.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedTicket && <TicketPopup ticket={selectedTicket} onClose={handleClosePopup} />}
    </div>
  );
}