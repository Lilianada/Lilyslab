export type BlockMap = {
  [blockId: string]: {
    value: {
      id: string
      type: string
      properties?: {
        title?: string[][]
        caption?: string[][]
        [key: string]: any
      }
      content?: string[]
      format?: {
        block_width?: number
        block_height?: number
        display_source?: string
        page_icon?: string
        page_cover?: string
      }
    }
    role: string
  }
}

export type BlockType = 
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'to_do'
  | 'toggle'
  | 'child_page'
  | 'image'
  | 'code'
  | 'quote'
  | 'callout'
  | 'divider'
  | 'bookmark'
  | 'video'
  | 'file'
  | 'pdf' 