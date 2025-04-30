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
  date?: string | null
}

export interface SearchProps {
  placeholder?: string
  onSearch: (value: string) => void
  className?: string
}

export interface AppDissection {
  id: string
  name: string
  description: string
  platforms: string[]
  url: string
  analysis: {
    architecture: string
    features: string[]
    techStack: string[]
  }
}
