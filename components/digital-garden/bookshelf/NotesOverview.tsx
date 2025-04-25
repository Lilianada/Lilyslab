import { useEffect, useState } from 'react';
// Import colors and NoteCard as named exports
import NoteCard, { colors } from './NoteCard'; // NoteCard is now a default import
// Define categoriesWhitelist locally or import from NoteCard if shared
export type GardenCategory = string;
export const categoriesWhitelist = ["Productivity", "Focus", "Creativity", "Career"];
// Container import removed; use a <div> instead if needed.

interface NotesOverviewProps {
    latestCreatedNotes: any[];
    latestEditedNotes: any[];
    basePath?: string;
    categories?: GardenCategory[];
}

const NotesOverview: React.FC<NotesOverviewProps> = ({
    latestCreatedNotes,
    latestEditedNotes,
    basePath = '',
    categories
}) => {
    const [activeTag, setActiveTag] = useState<'created' | 'edited'>('created');
    const [categoriesWithCounts, setCategoriesWithCounts] = useState<
        { category: string; count: number; color: string }[]
    >([]);

    useEffect(() => {
        if (!categories) return;
        // Map categoriesWhitelist to counts using categories as strings
        const entryCounts = categoriesWhitelist.map((whitelistCategory) => {
            const count = categories?.filter((cat) => cat === whitelistCategory).length || 0;
            return {
                category: whitelistCategory,
                count,
                color: colors[categoriesWhitelist.indexOf(whitelistCategory) % colors.length],
            };
        });

        const combinedCategories = entryCounts;

        combinedCategories.sort((a, b) => b.count - a.count);

        setCategoriesWithCounts(combinedCategories);
    }, [categories, colors, categoriesWhitelist]);

    // Replaced <Container> with <div> for compatibility
    return (
        <div>
            {categories && (
                <div className="mb-20 mt-12 lg:hidden">
                    <div className="mb-5 font-bold">Topics</div>
                    <ul className="flex flex-wrap gap-3">
                        {categoriesWithCounts.map((categoryWithCount, i) => (
                            <li
                                className="flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 px-3 py-1"
                                key={i}
                            >
                                <span
                                    style={{ backgroundColor: categoryWithCount.color }}
                                    className="h-2 w-2 rounded-full"
                                ></span>
                                <a href={`/garden/${categoryWithCount.category}`}>
                                    {categoryWithCount.category}
                                </a>
                                <span className="text-neutral-500">
                                    ({categoryWithCount.count})
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex items-center gap-3">
                <span className="font-bold">Notes</span>
                <ul className="flex flex-wrap gap-2">
                    <li
                        className={`cursor-pointer rounded px-2 py-1 ${
                            activeTag === 'created'
                                ? 'bg-neutral-100 text-neutral-800'
                                : 'text-neutral-400'
                        }`}
                        onClick={() => setActiveTag('created')}
                    >
                        newest
                    </li>
                    <li
                        className={`cursor-pointer rounded px-2 py-1 ${
                            activeTag === 'edited'
                                ? 'bg-neutral-100 text-neutral-800'
                                : 'text-neutral-400'
                        }`}
                        onClick={() => setActiveTag('edited')}
                    >
                        last edited
                    </li>
                </ul>
            </div>
            {/*
          Replaced <Container> with a regular <div> for layout.
          If you want a max-width or padding, add Tailwind classes here.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {activeTag === 'created' &&
                latestCreatedNotes?.map((note: any, i) => (
                    <NoteCard
                        data={note}
                        path={`${basePath}/${note.path}`}
                        category={note.path}
                        distorted
                        key={i}
                    />
                ))}
            {activeTag === 'edited' &&
                latestEditedNotes?.map((note: any, i) => (
                    <NoteCard
                        data={note}
                        path={`${basePath}/${note.path}`}
                        category={note.path}
                        distorted
                        key={i}
                    />
                ))}
        </div>
    </div>
  );
};

export default NotesOverview;
