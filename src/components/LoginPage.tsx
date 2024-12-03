import React, { useState } from 'react';
import LoginButton from './LoginButton';
import { Ticket } from 'lucide-react';
import useAuth from './hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ContactSupportModal from './ContactSupportModal';


const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    if (!loading && user) {
      navigate('/EventList');
    }
  }, [user, loading, navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Ticket className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to E.Sync</h1>
            <p className="text-gray-600">Your ultimate ticketing platform</p>
          </div>

          {/* Login Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <LoginButton />
              
              <div className="text-center text-sm text-gray-500">
                By continuing, you agree to E.Sync's{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {''}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need help?{' '}
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 hover:underline"
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>

      {/* Modal de soporte */}
      <ContactSupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        
    </div>
  );
};

export default LoginPage;
