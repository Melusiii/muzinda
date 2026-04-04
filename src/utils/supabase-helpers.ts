/**
 * Normalizes image URLs from Supabase storage buckets.
 * Handles both full URLs and relative paths stored in the database.
 */
export const getImageUrl = (url: string | null, bucket: string = 'property-images') => {
  if (!url) return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
  
  // If it's a full URL (external or already normalized), return as is
  if (url.startsWith('http')) return url;
  
  // If it's a relative path from the bucket, prepend the public storage URL
  const projectUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wkqxtecmejmjjubnjtwn.supabase.co';
  const cleanUrl = url.trim().replace(/^\//, ''); // Remove leading slash if any
  
  // Construct the public public URL
  return `${projectUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${cleanUrl}`;
};
