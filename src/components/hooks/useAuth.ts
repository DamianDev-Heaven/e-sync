import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

type User = {
  uid: string;
  display_name: string | null;
  email: string;
  photo_url: string | null;
  last_sign_in_at: string;
};

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const session = supabase.auth.getSession(); // Check current session
      if (!session) {
        setUser(null); // No active session
        setLoading(false);
        return;
      }

      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
        return;
      }

      if (supabaseUser) {
        const user: User = {
          uid: supabaseUser.id,
          display_name: supabaseUser.user_metadata?.full_name || null,
          email: supabaseUser.email || '',
          photo_url: supabaseUser.user_metadata?.avatar_url || null,
          last_sign_in_at: new Date().toISOString(),
        };
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const supabaseUser = session.user;
        if (supabaseUser) {
          const user: User = {
            uid: supabaseUser.id,
            display_name: supabaseUser.user_metadata?.full_name || null,
            email: supabaseUser.email || '',
            photo_url: supabaseUser.user_metadata?.avatar_url || null,
            last_sign_in_at: new Date().toISOString(),
          };
          setUser(user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null); // Clear user data on sign out
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};

export default useAuth;
