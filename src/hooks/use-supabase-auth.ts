import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

/**
 * Inyecta el JWT de Clerk en el cliente global de Supabase para que
 * todas las queries pasen las Row-Level Security (RLS) policies.
 *
 * Uso:
 *   const { ready } = useSupabaseAuth();
 *   if (!ready) return <Loading />;
 *   const { data } = await supabase.from('cameras').select('*');
 */
export function useSupabaseAuth() {
  const { getToken } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function injectToken() {
      try {
        // Solicita el JWT template "supabase" (HS256, compartido con Supabase)
        // en lugar del session token por defecto (RS256).
        const token = await getToken({ template: "supabase" });
        if (!token || cancelled) return;
        // Inyecta el JWT de Clerk como access_token de Supabase.
        // Esto hace que supabase-js envíe Authorization: Bearer <token>
        // en todas las requests HTTP subsiguientes.
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: "",
        });
        if (!cancelled) setReady(true);
      } catch (err) {
        console.error("[useSupabaseAuth] error inyectando token:", err);
      }
    }

    injectToken();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  return { supabase, ready };
}
