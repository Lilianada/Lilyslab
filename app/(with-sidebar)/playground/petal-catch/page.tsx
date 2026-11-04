import { PetalCatch } from "@/components/playground/PetalCatch";
import { ToyShell } from "@/components/playground/ToyShell";

export const metadata = {
  title: "Petal Catch",
  description: "A small game about catching things and avoiding bees.",
};

export default function Page() {
  return (
    <ToyShell title="Petal Catch" intro="A small game about catching things and avoiding bees.">
      <PetalCatch />
    </ToyShell>
  );
}
