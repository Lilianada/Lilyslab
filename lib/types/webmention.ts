export interface WebmentionAuthor {
  type: string
  name: string
  photo: string
  url: string
}

export interface WebmentionEntry {
  type: 'entry'
  author: WebmentionAuthor
  url: string
  published: string
  'wm-id': number
  'wm-source': string
  'wm-target': string
  'wm-protocol': 'webmention' | 'pingback'
  'wm-property': 'mention-of' | 'in-reply-to' | 'like-of' | 'repost-of' | 'bookmark-of'
  'wm-private': boolean
  'wm-received': string
  content?: {
    text: string
    html: string
  }
}

export interface WebmentionFeed {
  type: 'feed'
  name: string
  children: WebmentionEntry[]
}