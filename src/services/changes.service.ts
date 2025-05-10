import { supabase } from './supabase.service';

export const subscribeToChanges = (table: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        callback
      )
      .subscribe();
  };