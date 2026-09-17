import { supabase, isSupabaseConfigured } from '../lib/supabase';

type ChangeCallback = (payload: unknown) => void;

export function subscribeToTableChanges(
  table: string,
  callback: ChangeCallback
): () => void {
  if (!isSupabaseConfigured || !supabase) {
    // Return dummy unsubscriber when using local storage
    return () => {};
  }

  const channel = supabase
    .channel(`realtime_${table}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}

