import { Metadata } from 'next';
import HomeV2Client from '../page';

export const metadata: Metadata = {
  title: 'Lily\'s Lab',
  description: 'My personal website and digital garden where I share essays, notes, and more.',
};

export default function HomeV2Page() {
  return <HomeV2Client />;
}
