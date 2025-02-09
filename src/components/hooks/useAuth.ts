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

  const syncUserWithDatabase = async (supabaseUser: any) => {
    try {
      // Verificar si el usuario ya existe en la tabla `users`
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('uid')
        .eq('uid', supabaseUser.id)
        .maybeSingle(); // <-- Usar maybeSingle

      if (userError) throw userError;

      if (!userData) {
        // Si el usuario no existe, crear un registro en la tabla `users`
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              uid: supabaseUser.id,
              email: supabaseUser.email,
              display_name: supabaseUser.user_metadata?.full_name || null,
              photo_url: supabaseUser.user_metadata?.avatar_url || null,
              last_sign_in_at: new Date().toISOString(),
            },
          ]);

        if (insertError) throw insertError;
        console.log('Usuario creado en la tabla `users`');
      }
    } catch (error) {
      console.error('Error al sincronizar el usuario con la base de datos:', error);
    }
  };

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
        // Sincronizar el usuario con la tabla `users`
        await syncUserWithDatabase(supabaseUser);

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

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const supabaseUser = session.user;
        if (supabaseUser) {
          // Sincronizar el usuario con la tabla `users`
          await syncUserWithDatabase(supabaseUser);

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
