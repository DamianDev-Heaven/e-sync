import { useState, useEffect } from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Event } from './../types';
import Navbar from './Navbar';
import { supabase } from '../supabaseClient';

export default function PurchaseForm() {
  const location = useLocation();
  const { event } = location.state as { event: Event };
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [user, setUser] = useState<any>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        if (user) {
          setUser(user);
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('photo_url, uid')
            .eq('uid', user.id)
            .single();

          if (userError) throw userError;
          
          if (userData) {
            setProfileImageUrl(userData.photo_url);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setErrorMessage('Error al cargar los datos del usuario');
      }
    };

    fetchUser();
  }, []);

  const handleConfirmPurchase = async () => {
    try {
      if (!cardNumber || !expiryDate || !cvv) {
        setErrorMessage('Por favor, completa todos los campos de pago.');
        return;
      }

      if (!user) {
        setErrorMessage('No estás logueado. Por favor, inicia sesión para comprar.');
        return;
      }

      const total = event.price * quantity;
      
      const { error } = await supabase
        .from('purchases')
        .insert([
          {
            user_id: user.id,
            event_id: event.id,
            quantity: quantity,
            total_price: total,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      alert('¡Compra confirmada!');
      navigate('/');
    } catch (error) {
      console.error('Error al registrar la compra:', error);
      setErrorMessage('Error al procesar la compra. Inténtalo de nuevo más tarde.');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Usuario ha cerrado sesión");
      navigate('/');
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  const total = event.price * quantity;

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
    if (value.length > 2) {
      setExpiryDate(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    } else {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-4">
          {profileImageUrl && (
            <img
              src={profileImageUrl}
              alt="Perfil"
              className="h-10 w-10 rounded-full"
            />
          )}
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comprar Tickets</h2>
            {errorMessage && (
              <div className="mb-4 text-red-600">{errorMessage}</div>
            )}
            <div className="space-y-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.date} - {event.time}</p>
                <p className="text-sm text-gray-600">{event.venue}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad de Tickets
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'ticket' : 'tickets'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border rounded-lg flex items-center justify-center ${
                      paymentMethod === 'card'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <CreditCard className="h-6 w-6 mr-2" />
                    <span>Tarjeta de Crédito</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border rounded-lg flex items-center justify-center ${
                      paymentMethod === 'paypal'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Wallet className="h-6 w-6 mr-2" />
                    <span>PayPal</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Expiración
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={handleExpiryChange} 
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Resumen de la Orden</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Precio por ticket</span>
                    <span>${event.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cantidad</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={!cardNumber || !expiryDate || !cvv}
                className={`w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${!cardNumber || !expiryDate || !cvv ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Confirmar Compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
