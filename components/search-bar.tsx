import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { type SearchProps } from "@/types"
import { cn } from "@/lib/utils"

export function SearchBar({ placeholder = "Search...", onSearch, className }: SearchProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  )
} 