// src/LoginButton.tsx
import React from 'react';
import  {supabase}  from '../supabaseClient';

const LoginButton: React.FC = () => {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        className="w-5 h-5 mr-2"
      />
      <span>Continue with Google</span>
    </button>
  );
};

export default LoginButton;
