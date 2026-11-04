import { AnimationLab } from "@/components/playground/AnimationLab";
import { ToyShell } from "@/components/playground/ToyShell";

export const metadata = {
  title: "Animation Lab",
  description: "Easing is the difference between a thing moving and a thing being alive. Drag the sliders.",
};

export default function Page() {
  return (
    <ToyShell title="Animation Lab" intro="Easing is the difference between a thing moving and a thing being alive. Drag the sliders.">
      <AnimationLab />
    </ToyShell>
  );
}
