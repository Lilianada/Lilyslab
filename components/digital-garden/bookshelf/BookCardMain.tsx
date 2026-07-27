import { Dancing_Script } from 'next/font/google';
import Link from 'next/link';
import { formatTimestampToYYMMDD } from "@/lib/utils"; // Import the utility function

// Setup Dancing Script font instance
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });

// Define the Book type locally (or move to a central types file later)
interface Book {
  id: string;
    title: string;
    status: 'current-reads' | 'read' | 'to-be-read';
  rating?: number;
  genre?: string;
  date?: number;
  url?: string; // URL to essay or note review
}

// Update Props interface
interface BookCardProps {
    book: Book;
    distorted?: boolean;
}

// Map book statuses to colors (adjust colors as needed)
const statusColors: Record<Book['status'], string> = {
    'read': '#A2CBAF', 
    'current-reads': '#A6C2EB', 
    'to-be-read': '#FAE680' 
};

/**
 * BookCard displays a genre card for a book.
 * @param book - The book data (required)
 * @param distorted - If true, applies a distortion effect (optional)
 */
const BookCard: React.FC<BookCardProps> = ({
    book,
    distorted,
}) => {
    // Removed isDraft logic, rely on status or other properties if needed

    // Use genre length for potential styling adjustments
    const genreCharCount = book.genre ? book.genre.length : 0;

    // Keep font size logic for genre if desired
    const getFontSize = (count: number) => {
        const minFontSize = 1.5; // Adjust as needed
        const maxFontSize = 2.5; // Adjust as needed
        const maxCharCount = 150; // Adjust based on typical genre length

        // Prevent division by zero or negative counts
        if (count <= 0) return `${minFontSize}rem`;

        const fontSize = Math.min(
            maxFontSize,
            Math.max(
                minFontSize,
                maxFontSize - (count / maxCharCount) * (maxFontSize - minFontSize)
            )
        );
        return `${fontSize.toFixed(2)}rem`;
    };

    const genreFontSize = getFontSize(genreCharCount);

    // Use the imported utility function
    const formattedDate = formatTimestampToYYMMDD(book.date);

    // Get background color based on status
    const backgroundColor = statusColors[book.status] || '#E0E0E0'; // Default gray

    // Keep distortion logic
    const randomMarginBottom = Math.floor(Math.random() * 8);
    const randomMarginRight = Math.floor(Math.random() * 8);
    const randomRotation = Math.floor(Math.random() * 4 - 2);
    // Removed type-specific random margins

    const transformStyles = distorted
        ? {
              transform: `translateY(${randomMarginBottom}px) translateX(${randomMarginRight}px) rotate(${randomRotation}deg)`
          }
        : {
              transform: `rotate(${randomRotation}deg)` // Keep rotation even if not distorted
          };

    const backgroundColorStyle = {
        backgroundColor: backgroundColor
    };

    // Update content structure to use book properties
    const content = (
        <div
            className="flex flex-col justify-between h-full w-full px-6 py-4 font-mono text-black border border-black rounded-md bg-white/80 relative paper-texture"
            style={{
                backgroundImage: 'url("/noise.svg")',
                backgroundRepeat: 'repeat',
                backgroundSize: '350px 350px',
                backgroundBlendMode: 'multiply',
            }}
        >
            <div>
                {/* Display status instead of category */}
                <ul className="flex gap-2 mb-2">
                    <li className="inline-block rounded-full border px-2 border-black py-[2px] text-[11px] text-black" style={{ backgroundColor: backgroundColor }}>
                        {book.status.replace('-', ' ')} {/* Make status readable */}
                    </li>
                    {/* Add rating if available */}
                    {book.rating !== undefined && book.rating !== null && (
                         <li className="inline-block rounded-full border px-2 border-black bg-siteYellow-300/70 py-[2px] text-[11px] text-black">
                            Rating: {book.rating}/5
                         </li>
                    )}
                </ul>
                {/* Use book.genre */}
                <h3 className="text-base font-medium text-left mb-1 truncate">{book.genre}</h3>
            </div>
            {/* Dashed separator line */}
            <div className="w-full border-t-2 border-dashed border-black my-2" />
            {/* Use book.title */}
            {book.title && (
                <p
                    className={`line-clamp-3 my-2 text-left font-script text-md font-italics leading-[1.1] opacity-90 ${dancingScript.className}`}
                    style={{
                        fontSize: genreFontSize, // Use dynamic font size for title
                        fontFeatureSettings: '"liga", "ss01", "ss02", "ss03"',
                        color: '#111',
                    }}
                >
                    {book.title}
                </p>
            )}
            {/* Dashed separator line */}
            <div className="w-full border-t-2 border-dashed border-black my-2" />
            {/* Display formatted date if available */}
            <div className="text-[12px] flex flex-col gap-1 items-start mt-2 text-black">
                 {formattedDate && <span className="block">Date: {formattedDate}</span>}
                {/* Add other relevant info if needed */}
            </div>
        </div>
    );

    // Use book.url if available, otherwise link to main bookshelf
    const bookHref = book.url || `/garden/bookshelf`;
    const isExternalLink = book.url && (book.url.startsWith('http') || book.url.startsWith('https'));
    
    // Determine if this should be a Link or an anchor tag
    const linkProps = isExternalLink ? {
        href: bookHref,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "relative block p-2 transition-all hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        style: backgroundColorStyle,
        "aria-label": `View review for ${book.title}${isExternalLink ? ' (opens in new tab)' : ''}`
    } : {
        href: bookHref,
        className: "relative block p-2 transition-all hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        style: backgroundColorStyle,
        "aria-label": `View review for ${book.title}`
    };

    return (
        <div className="group flex h-80 items-center">
            <div
                className={`noteCardEffect ticket w-full ${randomRotation >= 0 ? 'hide-after' : 'hide-before'}`}
                style={transformStyles}
            >
                {/* Ticket scallops left */}
                <div className="scallop left1" />
                <div className="scallop left2" />
                <div className="scallop left3" />
                {/* Ticket scallops right */}
                <div className="scallop right1" />
                <div className="scallop right2" />
                <div className="scallop right3" />
                {/* Use Link component for internal links, anchor for external */}
                {isExternalLink ? (
                    <a {...linkProps}>
                        {content}
                    </a>
                ) : (
                    <Link {...linkProps}>
                        {content}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default BookCard; // Export as BookCard
