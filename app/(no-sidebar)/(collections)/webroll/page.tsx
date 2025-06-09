import { getWebrollLinks } from '@/lib/garden/webroll';
import WebrollClient from './webroll-client';

export default async function WebrollPage() {
  // Fetch webroll data on the server
  const webrollLinks = await getWebrollLinks();

  return <WebrollClient initialLinks={webrollLinks} />;
}
