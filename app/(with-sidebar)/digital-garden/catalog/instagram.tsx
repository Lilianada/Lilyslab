import { getInstagramFeed } from '@/lib/instagram';
import { InstagramFeed } from '@/components/digital-garden/catalog/instagram-feed';

export default async function InstagramPage() {
  // Fetch Instagram posts (limit to 12)
  const instagramPosts = await getInstagramFeed(12);
  
  return (
    <div className="container max-w-3xl mx-auto px-0 sm:px-4 py-8">
      <InstagramFeed initialPosts={instagramPosts} />
    </div>
  );
}
