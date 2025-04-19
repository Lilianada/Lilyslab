'use client'

import dynamic from 'next/dynamic'
import { ExtendedRecordMap } from 'notion-types'
import { NotionRenderer } from 'react-notion-x'

// Import required components for NotionRenderer
const Code = dynamic(() => import('react-notion-x/build/third-party/code').then((m) => m.Code))
const Collection = dynamic(() => import('react-notion-x/build/third-party/collection').then((m) => m.Collection))
const Equation = dynamic(() => import('react-notion-x/build/third-party/equation').then((m) => m.Equation))
const Modal = dynamic(() => import('react-notion-x/build/third-party/modal').then((m) => m.Modal), { ssr: false })

export default function ClientNotionRenderer({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      components={{
        Code,
        Collection,
        Equation,
        Modal
      }}
      fullPage={false}
      darkMode={false}
      disableHeader={true}
    />
  )
}
