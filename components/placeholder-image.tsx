import Image from "next/image"

interface PlaceholderImageProps {
  width: number
  height: number
  className?: string
  alt?: string
  src?: string
}

export default function PlaceholderImage({
  width,
  height,
  className,
  alt = "Placeholder image",
  src,
}: PlaceholderImageProps) {
  // If src is provided, use it
  if (src && !src.includes("placeholder.svg")) {
    return <Image src={src || "/placeholder.svg"} width={width} height={height} className={className} alt={alt} />
  }

  // Generate a placeholder SVG with the specified dimensions
  const svgString = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f0f0f0"/>
      <text x="50%" y="50%" fontFamily="Arial" fontSize="20" fill="#888" textAnchor="middle" dominantBaseline="middle">${width}x${height}</text>
    </svg>
  `

  // Convert SVG to base64 for use in the src attribute
  const svgBase64 = Buffer.from(svgString).toString("base64")
  const dataUri = `data:image/svg+xml;base64,${svgBase64}`

  return <Image src={dataUri || "/placeholder.svg"} width={width} height={height} className={className} alt={alt} />
}
