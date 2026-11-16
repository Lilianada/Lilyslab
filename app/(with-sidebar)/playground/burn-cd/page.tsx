import BurnCd from "@/components/playground/burn-cd/BurnCd";

export const metadata = {
  title: "Burn CD | Lab | Lilyslab",
  description: "Plan a mix CD from a Spotify or YouTube playlist and your own MP3s: check it fits, design the cover, and download a folder ready to burn.",
};

export default function BurnCdPage() {
  return (
    <div className="animate-fade-in">
      <BurnCd />
    </div>
  );
}
