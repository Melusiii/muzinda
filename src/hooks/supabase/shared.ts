import { supabase } from '../../lib/supabase'

export const withLockRetry = async <T>(operation: () => Promise<T>, maxRetries = 2): Promise<T> => {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (err: any) {
      lastError = err;
      const isLockError = err.message?.includes('Lock') || err.name === 'NavigatorLockAcquireTimeoutError';
      if (isLockError && i < maxRetries) {
        console.warn(`useSupabase: Lock contention, retrying (${i + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
};

export const createNotification = async (userId: string, title: string, message: string, type: string) => {
  const { error } = await supabase
    .from('notifications')
    .insert([{
      user_id: userId,
      title,
      message,
      type,
      read: false
    }]);
  if (error) throw error;
};
