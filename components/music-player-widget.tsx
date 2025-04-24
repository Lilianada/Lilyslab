import Image from "next/image";

interface MusicPlayerWidgetProps {
  imageUrl: string;
  title: string;
  artist: string;
  lastPlayed: string;
}

export const MusicPlayerWidget = ({
  imageUrl,
  title,
  artist,
  lastPlayed,
}: MusicPlayerWidgetProps) => {
  return (
    <div className="bg-muted rounded-lg p-2 shadow-sm opacity-0 animate-slide-up transition-colors duration-300">
      {/* Inner container for main content with card background */}
      <div className="bg-accent rounded-md border p-1 flex items-center gap-4">
        {/* Album Art */}
        <div className="flex-shrink-0">
          <Image
            src={imageUrl}
            alt={`${title} album art`}
            width={56} 
            height={56} 
            className="rounded-md object-cover"
          />
        </div>
        {/* Text Info */}
        <div>
          <p className="font-medium text-base text-card-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{artist}</p>
        </div>
      </div>
      {/* Footer section within the outer container */}
      <div className="flex items-center gap-2 pt-2 px-2">
        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
        <span className="text-xs text-muted-foreground">{lastPlayed}</span>
      </div>
    </div>
  );
};