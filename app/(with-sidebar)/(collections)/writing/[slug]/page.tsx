import { WritingClient } from "./writing-client";

interface PageParams {
  slug: string;
}

export default function WritingPage({ params }: { params: PageParams }) {
  return <WritingClient slug={params.slug} />;
}
