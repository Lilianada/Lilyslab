"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ClientOnly } from "@/components/client-only"

interface PageCreditProps {
  inspirationName: string
  inspirationUrl: string
  pageName?: string
  color: string
}

export function PageCredit({ 
  inspirationName, 
  inspirationUrl,
  color,
  pageName = "this page"
}: PageCreditProps) {
  
  return (
    <>
      <Separator className="my-6" />
      
      <p className="text-sm text-muted-foreground/60 mt-8">
        Credit to <a href={inspirationUrl} className={color + " hover:underline"} target="_blank" rel="noopener noreferrer">{inspirationName}</a> for the inspiration behind {pageName}. 
        Find me elsewhere on <a href="https://twitter.com/lilian_okeke" className={ color + " hover:underline"} target="_blank" rel="noopener noreferrer">Twitter</a>, <a href="https://github.com/lilianokeke" className={ color + " hover:underline"} target="_blank" rel="noopener noreferrer">GitHub</a>, and <a href="https://linkedin.com/in/lilianada" className={ color + " hover:underline"} target="_blank" rel="noopener noreferrer">LinkedIn</a>. 
        Email me at <a href="mailto:lilianokeke.ca@gmail.com" className={ color + " hover:underline"}>lilianokeke.ca@gmail.com</a>, especially about this site, vibe coding, lifestyle, design, productivity, and finding hidden talent. 
        View my portfolio site <a href="https://lilianada.com" className={ color + " hover:underline"} target="_blank" rel="noopener noreferrer">here</a> ❤️.
      </p>
    </>
  )
}
