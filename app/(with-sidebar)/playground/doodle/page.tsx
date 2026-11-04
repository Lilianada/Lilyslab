import { DoodlePad } from "@/components/playground/DoodlePad";
import { ToyShell } from "@/components/playground/ToyShell";

export const metadata = {
  title: "Doodle Pad",
  description: "No talent required. Draw something, then stick it on your fridge.",
};

export default function Page() {
  return (
    <ToyShell title="Doodle Pad" intro="No talent required. Draw something, then stick it on your fridge.">
      <DoodlePad />
    </ToyShell>
  );
}
