import { Menu, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';

interface NavbarProps {
  onLogout: () => Promise<void>;
}

export default function Navbar({ onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    if (!user) {
      navigate('/LoginPage');
    } else {
      navigate(path);
    }
  };

  const handleProfileClick = () => {
    if (!user) {
      navigate('/LoginPage');
    } else {
      navigate('/AccountControl');
    }
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img src="/LOGO-E-SYNC.png" className="h-12 w-auto" alt="E-SYNC Logo" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="/" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">Inicio</a>
                <button 
                  onClick={() => handleLinkClick('/EventList')} 
                  className="text-indigo-100 hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Eventos
                </button>
                <button 
                  onClick={() => handleLinkClick('/AccountControl')} 
                  className="text-indigo-100 hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Mi Cuenta
                </button>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={onLogout} className="text-indigo-100 hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">Cerrar Sesión</button>
            <button 
              onClick={handleProfileClick} 
              className="text-indigo-100 hover:bg-indigo-500 p-2 rounded-full flex items-center"
            >
              {user?.photo_url ? ( 
                <img 
                  src={user.photo_url} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-indigo-100 hover:bg-indigo-500 p-2 rounded-md"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="text-white block px-3 py-2 rounded-md text-base font-medium">Inicio</a>
            <button 
              onClick={() => handleLinkClick('/EventList')} 
              className="text-indigo-100 block px-3 py-2 rounded-md text-base font-medium"
            >
              Eventos
            </button>
            <button 
              onClick={() => handleLinkClick('/AccountControl')} 
              className="text-indigo-100 block px-3 py-2 rounded-md text-base font-medium"
            >
              Mi Cuenta
            </button>
            <a href="/support" className="text-indigo-100 block px-3 py-2 rounded-md text-base font-medium">Ayuda</a>
            <button onClick={onLogout} className="text-indigo-100 block px-3 py-2 rounded-md text-base font-medium">Cerrar Sesión</button>
          </div>
        </div>
      )}
    </nav>
  );
}
