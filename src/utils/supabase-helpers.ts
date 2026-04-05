/**
 * Normalizes image URLs from Supabase storage buckets.
 * Handles both full URLs and relative paths stored in the database.
 */
export const getImageUrl = (url: string | null, bucket: string = 'property-images') => {
   if (!url) return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop';
   
   // Normalize project URL
   const projectUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://wkqxtecmejmjjubnjtwn.supabase.co').replace(/\/$/, '');
   
   // If it's a full URL, check if it's from our own project. 
   // If it is, we still normalize it to ensure the path is consistent.
   if (url.startsWith('http')) {
     if (url.includes(projectUrl)) {
        // Extract the path after the bucket name to re-construct it cleanly
        const pathParts = url.split(`/public/${bucket}/`);
        if (pathParts.length > 1) {
           return `${projectUrl}/storage/v1/object/public/${bucket}/${pathParts[1]}`;
        }
     }
     return url;
   }
   
   const cleanPath = url.trim().replace(/^\//, '');
   return `${projectUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
};
