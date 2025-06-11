"use client";

import React, { useEffect } from 'react';
import katex from 'katex';

// Interface for the KaTeX component
interface KaTeXProps {
  math: string;
  block?: boolean;
  errorColor?: string;
  renderError?: (error: Error) => React.ReactNode;
}

// KaTeX component for rendering math equations
const KaTeX: React.FC<KaTeXProps> = ({
  math,
  block = false,
  errorColor,
  renderError,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      katex.render(math, containerRef.current, {
        displayMode: block,
        errorColor: errorColor || '#cc0000',
        throwOnError: Boolean(renderError),
      });
    } catch (error) {
      if (renderError && error instanceof Error) {
        const customError = renderError(error);
        if (containerRef.current && customError !== undefined) {
          containerRef.current.innerHTML = '';
          const errorNode = document.createElement('span');
          errorNode.textContent = String(customError);
          containerRef.current.appendChild(errorNode);
        }
      }
    }
  }, [math, block, errorColor, renderError]);

  return <div ref={containerRef} />;
};

// Regex patterns for inline and block math
const inlineMathRegex = /\$([^\$]+)\$/g;
const blockMathRegex = /\$\$([^\$]+)\$\$/g;

// Function to replace math expressions with KaTeX components
export const processMathExpressions = (content: string): React.ReactNode[] => {
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  
  // First process block math
  let blockMatch;
  while ((blockMatch = blockMathRegex.exec(content)) !== null) {
    const [fullMatch, mathContent] = blockMatch;
    
    // Add text before this math block
    if (blockMatch.index > lastIndex) {
      result.push(content.substring(lastIndex, blockMatch.index));
    }
    
    // Add the math block
    result.push(
      <KaTeX 
        key={`block-math-${blockMatch.index}`}
        math={mathContent}
        block={true}
      />
    );
    
    lastIndex = blockMatch.index + fullMatch.length;
  }
  
  const remainingContent = content.substring(lastIndex);
  
  // Then process inline math in the remaining content
  let inlineResult: React.ReactNode[] = [];
  lastIndex = 0;
  let inlineMatch;
  
  while ((inlineMatch = inlineMathRegex.exec(remainingContent)) !== null) {
    const [fullMatch, mathContent] = inlineMatch;
    
    // Add text before this inline math
    if (inlineMatch.index > lastIndex) {
      inlineResult.push(remainingContent.substring(lastIndex, inlineMatch.index));
    }
    
    // Add the inline math
    inlineResult.push(
      <KaTeX 
        key={`inline-math-${inlineMatch.index}`}
        math={mathContent}
        block={false}
      />
    );
    
    lastIndex = inlineMatch.index + fullMatch.length;
  }
  
  // Add any remaining content
  if (lastIndex < remainingContent.length) {
    inlineResult.push(remainingContent.substring(lastIndex));
  }
  
  if (inlineResult.length > 0) {
    result.push(...inlineResult);
  }
  
  return result.length > 0 ? result : [content];
};

export const KaTeXComponent = KaTeX;
