import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function AuthCallback() {
  useEffect(() => {
    // Supabase automatically handles the hash fragment and saves the session.
    // We just need to wait for it to finish and then close the popup.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || session) {
        if (window.opener) {
          // Send a message to the parent window that login was successful
          window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
          // Close the popup
          window.close();
        }
      }
    });

    // Fallback: if we're in a popup and there's a hash, just close after a short delay
    // to give Supabase time to process the token.
    if (window.opener && window.location.hash.includes('access_token')) {
      setTimeout(() => {
        window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
        window.close();
      }, 1500);
    }

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h2 className="text-xl font-semibold">Completing login...</h2>
        <p className="text-zinc-500">This window will close automatically.</p>
      </div>
    </div>
  );
}
