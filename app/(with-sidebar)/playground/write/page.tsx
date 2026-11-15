import Write from "@/components/playground/Write";

export const metadata = {
  title: "Write | Playground | Lilyslab",
  description: "A quiet place to write. Notes are kept in your browser and never leave it.",
};

export default function WritePage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col pt-12">
      <Write />
    </div>
  );
}
