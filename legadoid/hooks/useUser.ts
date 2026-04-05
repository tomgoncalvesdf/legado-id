"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import type { User } from "@/types";

interface UseUserReturn {
  supabaseUser: SupabaseUser | null;
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const supabase = createClient();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(
    async (supaUser: SupabaseUser) => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", supaUser.id)
        .single();

      if (!error && data) {
        setUser(data as User);
      }
    },
    [supabase]
  );

  const refreshUser = useCallback(async () => {
    const { data: { user: supaUser } } = await supabase.auth.getUser();
    if (supaUser) {
      setSupabaseUser(supaUser);
      await fetchUserProfile(supaUser);
    }
  }, [supabase, fetchUserProfile]);

  useEffect(() => {
    // Sessão inicial
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setSupabaseUser(s?.user ?? null);
      if (s?.user) {
        fetchUserProfile(s.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        setSession(s);
        setSupabaseUser(s?.user ?? null);

        if (s?.user) {
          await fetchUserProfile(s.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchUserProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    setSession(null);
    window.location.href = "/";
  }, [supabase]);

  return { supabaseUser, user, session, loading, signOut, refreshUser };
}
