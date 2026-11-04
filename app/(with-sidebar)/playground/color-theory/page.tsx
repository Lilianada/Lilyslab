import { ColorTheory } from "@/components/playground/ColorTheory";
import { ToyShell } from "@/components/playground/ToyShell";

export const metadata = {
  title: "Color Theory",
  description: "Pick a color and see who it gets along with. Click any swatch to copy it.",
};

export default function Page() {
  return (
    <ToyShell title="Color Theory" intro="Pick a color and see who it gets along with. Click any swatch to copy it.">
      <ColorTheory />
    </ToyShell>
  );
}
