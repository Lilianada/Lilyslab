
import { Dancing_Script } from 'next/font/google';

// Setup Dancing Script font instance
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });
// const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'] });
// Then apply caveat.className to the full article body.

interface NoteCardProps {
    data: any;
    path: string;
    category: string;
    distorted?: boolean;
}

export const colors = [
    '#9EAAFA',
    '#FAE680',
    '#A2CBAF',
    '#E8ADB1',
    '#A6C2EB',
    '#F4E8C8',
    '#CCA7ED',
    '#F29874',
    '#F4DAA0',
    '#6C95CF'
];

/**
 * NoteCard displays a summary card for a note or book.
 * @param data - The note/book data (required)
 * @param path - The base path for navigation (required)
 * @param category - The note category (required)
 * @param distorted - If true, applies a distortion effect (optional)
 */
const NoteCard: React.FC<NoteCardProps> = ({
    data,
    path: currentPath,
    distorted,
    category
}) => {
    const isDraft = !data.body || data.body.trim() === '' || data.body.trim() === 'TBD';

    const charCount = data.frontmatter?.description ? data.frontmatter.description.length : 0;

    const getFontSize = (count: number) => {
        const minFontSize = 1.5;
        const maxFontSize = 2.5;
        const maxCharCount = 50;

        const fontSize = Math.min(
            maxFontSize,
            Math.max(
                minFontSize,
                maxFontSize - (count / maxCharCount) * (maxFontSize - minFontSize)
            )
        );
        return `${fontSize.toFixed(2)}rem`;
    };

    const typeFontSize = getFontSize(charCount);

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day} / ${month} / ${year}`;
    }

    const createdDay = formatDate(data.frontmatter?.created);

    const categoriesWhitelist = ["Productivity", "Focus", "Creativity", "Career"];
    const categoryIndex = categoriesWhitelist.indexOf(category);
    const backgroundColor = colors[categoryIndex] || colors[0];

    const randomMarginBottom = Math.floor(Math.random() * 8);
    const randomMarginRight = Math.floor(Math.random() * 8);
    const randomRotation = Math.floor(Math.random() * 4 - 2);
    const randomTypeMarginBottom = Math.floor(Math.random() * 12 - 6);
    const randomTypeRotation = Math.floor(Math.random() * 4 - 2);
    const randomTypeMarginRight = Math.floor(Math.random() * 12 - 6);

    const transformStyles = distorted
        ? {
              transform: `translateY(${randomMarginBottom}px) translateX(${randomMarginRight}px) rotate(${randomRotation}deg)`
          }
        : {
              transform: `rotate(${randomRotation}deg)`
          };

    const backgroundColorStyle = {
        backgroundColor: backgroundColor
    };

    const content = (
        <div
            className="flex flex-col justify-between h-full w-full px-6 py-4 font-mono text-black border border-black rounded-md bg-white/80 relative paper-texture"
            style={{
                backgroundImage: 'url("/Noise.png")',
                backgroundRepeat: 'repeat',
                backgroundSize: '350px 350px',
                backgroundBlendMode: 'multiply',
            }}
        >
            <div>
                <ul className="flex gap-2 mb-2">
                    <li className="inline-block rounded-full border px-2 border-black bg-pink-400/70 py-[2px] text-[11px] text-black">
                        {category}
                    </li>
                    {isDraft && (
                        <li className="inline-block rounded-full border px-2 py-[2px] text-[11px] border-black bg-gray-300/80 text-black">
                            Draft
                        </li>
                    )}
                </ul>
                <h3 className="text-lg font-bold text-left mb-1 truncate">{data.name.replace(/\.md$/, '')}</h3>
            </div>
            {/* Dashed separator line above description */}
            <div className="w-full border-t-2 border-dashed border-black my-2" />
            {data.frontmatter?.description && (
                <p
                    className={`line-clamp-3 my-2 text-left font-script text-md font-italics leading-[1.1] opacity-90 ${dancingScript.className}`}
                    style={{
                        fontSize: typeFontSize,
                        fontFeatureSettings: '"liga", "ss01", "ss02", "ss03"',
                        color: '#111',
                    }}
                >
                    {data.frontmatter.description}
                </p>
            )}
            {/* Dashed separator line below description */}
            <div className="w-full border-t-2 border-dashed border-black my-2" />
            <div className="text-[12px] flex flex-col gap-1 items-start mt-2 text-black">
                <span className="block">created: {createdDay}</span>
            </div>
        </div>
    );

    return (
        <div className="group flex h-full min-h-[280px] items-center">
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
                {isDraft ? (
                    <div className="relative cursor-not-allowed p-2" style={backgroundColorStyle}>
                        {content}
                    </div>
                ) : (
                    <a
                        className="relative block p-2 transition-all hover:scale-105 hover:shadow-md"
                        href={`${currentPath}/${data.name}`}
                        style={backgroundColorStyle}
                    >
                        {content}
                    </a>
                )}
            </div>
        </div>
    );
};

export default NoteCard;
