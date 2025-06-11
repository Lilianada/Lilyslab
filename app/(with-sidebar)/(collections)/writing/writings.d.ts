// Define types for Next.js page components
declare module "next" {
  interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
  }
}
