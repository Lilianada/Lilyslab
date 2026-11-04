import { ToyPager } from "@/components/playground/ToyPager";

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToyPager />
    </>
  );
}
