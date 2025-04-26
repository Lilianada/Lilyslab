import React from "react";
import type { ExtendedRecordMap } from "notion-types";

// This is a stub for the ReactNotionX component. Replace with the real NotionX renderer if available.
export interface ReactNotionXProps {
  recordMap: ExtendedRecordMap;
  fullPage?: boolean;
  darkMode?: boolean;
  previewImages?: boolean;
  showCollectionViewDropdown?: boolean;
  showTableOfContents?: boolean;
  minTableOfContentsItems?: number;
  defaultPageIcon?: string;
  defaultPageCover?: string;
  defaultPageCoverPosition?: number;
  mapPageUrl?: (pageId: string, recordMap: ExtendedRecordMap) => string;
  mapImageUrl?: (url: string, block: any) => string;
  components?: Record<string, React.ComponentType<any>>;
}

const ReactNotionX: React.FC<ReactNotionXProps> = ({
  recordMap,
  ...props
}) => {
  return (
    <div className="notion-stub p-4 border rounded-md bg-muted/20">
      <p>This is a stub for the NotionX renderer.</p>
      <pre className="text-xs text-muted-foreground mt-2 overflow-x-auto">
        {JSON.stringify(recordMap, null, 2)}
      </pre>
    </div>
  );
};

export default ReactNotionX;
