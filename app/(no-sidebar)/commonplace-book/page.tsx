import { Metadata } from 'next';
import CommonplaceBookClient from './CommonplaceBookClient';

export const metadata: Metadata = {
  title: 'Commonplace Book | Lily\'s Lab',
  description: 'A digital commonplace book collecting thoughts, quotes, articles, and inspiration from across the web.',
};

export default function CommonplaceBookPage() {
  return <CommonplaceBookClient />;
}
