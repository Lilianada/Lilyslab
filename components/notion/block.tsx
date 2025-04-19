import React from 'react'
import { BlockType } from './types'

interface BlockProps {
  block: any
  level?: number
}

export function Block({ block, level = 0 }: BlockProps) {
  if (!block) return null

  const { type, properties, content } = block.value || {}

  const renderContent = () => {
    if (!properties?.title) return null
    return properties.title[0][0]
  }

  const renderBlock = () => {
    switch (type as BlockType) {
      case 'paragraph':
        return <p className="mb-4">{renderContent()}</p>
      case 'heading_1':
        return <h1 className="text-2xl font-bold mb-4">{renderContent()}</h1>
      case 'heading_2':
        return <h2 className="text-xl font-bold mb-3">{renderContent()}</h2>
      case 'heading_3':
        return <h3 className="text-lg font-bold mb-2">{renderContent()}</h3>
      case 'bulleted_list_item':
        return <li className="ml-4">{renderContent()}</li>
      case 'numbered_list_item':
        return <li className="ml-4 list-decimal">{renderContent()}</li>
      case 'image':
        const src = block.value?.format?.display_source || ''
        return (
          <div className="my-4">
            <img 
              src={src} 
              alt={properties?.caption?.[0]?.[0] || 'Image'} 
              className="rounded-lg max-w-full"
            />
            {properties?.caption && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {properties.caption[0][0]}
              </p>
            )}
          </div>
        )
      case 'code':
        return (
          <pre className="bg-muted p-4 rounded-lg my-4 overflow-x-auto">
            <code>{renderContent()}</code>
          </pre>
        )
      case 'quote':
        return (
          <blockquote className="border-l-4 border-primary pl-4 my-4">
            {renderContent()}
          </blockquote>
        )
      case 'divider':
        return <hr className="my-8 border-border" />
      default:
        return <p className="mb-4">{renderContent()}</p>
    }
  }

  return (
    <>
      {renderBlock()}
      {content && level < 3 && (
        <div style={{ paddingLeft: level > 0 ? '1rem' : 0 }}>
          {content.map((blockId: string) => (
            <Block 
              key={blockId} 
              block={block[blockId]} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </>
  )
} 