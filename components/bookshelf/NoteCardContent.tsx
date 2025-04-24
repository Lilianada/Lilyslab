import React from "react";

interface NoteCardContentProps {
  data: any;
  category: string;
  isDraft: boolean;
  frontmatter: {
    created: string;
    edited: string;
    description: string;
  };
  distorted?: boolean;
  classes?: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
}

const NoteCardContent: React.FC<NoteCardContentProps> = ({
  data,
  category,
  isDraft,
  frontmatter,
  distorted,
  classes,
}) => {
  const createdDay = formatDate(frontmatter.created);
  const editedDay = formatDate(frontmatter.edited);
  const charCount = frontmatter.description.length;

  // Font size logic
  const getFontSize = (count: number) => {
    const minFontSize = 1.5;
    const maxFontSize = 2.5;
    const maxCharCount = 50;
    const fontSize = Math.min(
      maxFontSize,
      Math.max(minFontSize, maxFontSize - (count / maxCharCount) * (maxFontSize - minFontSize))
    );
    return `${fontSize.toFixed(2)}rem`;
  };
  const typeFontSize = getFontSize(charCount);

  const randomTypeRotation = Math.floor(Math.random() * 4 - 2);
  const randomTypeMarginBottom = Math.floor(Math.random() * 12 - 6);
  const randomTypeMarginRight = Math.floor(Math.random() * 12 - 6);

  const getTextAlignment = (charCount: number) => {
    if (charCount < 30) {
      return "text-center";
    } else {
      return "text-left";
    }
  };
  const textAlignmentClass = getTextAlignment(charCount);

  return (
    <>
      <div className="texture" />
      <div className="flex h-full flex-col justify-between border p-3 font-mono">
        <div>
          <ul className="flex gap-2">
            <li className="mb-2 inline-block rounded-full border px-2 py-[2px] text-[11px]">
              {category}
            </li>
            {isDraft && (
              <li className="mb-2 inline-block rounded-full border px-2 py-[2px] text-[11px]">
                Draft
              </li>
            )}
          </ul>
          <h3 className="mt-3 text-base font-bold">{data.name.replace(/\.md$/, "")}</h3>
        </div>
        {frontmatter.description && (
          <div style={{ filter: "url(#distort)" }}>
            <div className="my-1 truncate text-clip font-mono text-base tracking-widest text-black">
              ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            </div>
            <p
              className={`line-clamp-3 py-1 ${textAlignmentClass} font-script text-md leading-[1.1] opacity-60`}
              style={{
                fontSize: typeFontSize,
                transform: `translateY(${randomTypeMarginBottom}px) translateX(${randomTypeMarginRight}px) rotate(${randomTypeRotation}deg)`,
                opacity: 0.9,
                fontFeatureSettings: '"liga", "ss01", "ss02", "ss03"',
              }}
            >
              {frontmatter.description}
            </p>
          </div>
        )}
        <div className="text-[12px]">
          <div className="my-1 truncate text-clip font-mono text-base tracking-widest text-black">
            ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
          </div>
          <p>
            <span className="inline-block min-w-[72px]">created:</span> {createdDay}
          </p>
          {createdDay !== editedDay && (
            <p>
              <span className="inline-block min-w-[72px]">edited:</span> {editedDay}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default NoteCardContent;
