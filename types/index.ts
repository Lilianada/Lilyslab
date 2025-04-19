export interface Tool {
  id: string
  name: string
  description: string
  logo: string | null
  url: string | null
  category: string
  platforms: string[]
  published?: boolean
  newSuggestion?: boolean
}

export interface Resource {
  id: string
  name: string
  description: string
  url: string | null
  tags: string[]
  category: string
}

export interface SearchProps {
  placeholder?: string
  onSearch: (value: string) => void
  className?: string
} 

