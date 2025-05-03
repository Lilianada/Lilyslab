// Use Next.js Script component for structured data
import Script from 'next/script';

export const PersonStructuredData = () => {
  const data = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Lilian Ada",
  "alternateName": "Lily",
  "description": "Software engineer, product manager, and digital creator",
  "image": "https://lilyslab.xyz/12.png",
  "url": "https://lilyslab.xyz",
  "sameAs": [
    "https://twitter.com/lilian_ada_",
    "https://github.com/lilianada",
    "https://linkedin.com/in/lilianada"
  ],
  "jobTitle": "Software Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "Lily's Lab"
  },
  "knowsAbout": [
    "Web Development",
    "User Interface Design",
    "Product Management",
    "Digital Content Creation"
  ]
};
  
  return (
    <Script 
      id="person-schema"
      type="application/ld+json"
      strategy="afterInteractive"
    >
      {JSON.stringify(data)}
    </Script>
  );
};

export const WebsiteStructuredData = () => {
  const data = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Lily's Lab",
  "alternateName": "Lilyslab",
  "url": "https://lilyslab.xyz",
  "description": "Software engineer, product manager, and digital creator",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://lilyslab.xyz/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};
  
  return (
    <Script 
      id="website-schema"
      type="application/ld+json"
      strategy="afterInteractive"
    >
      {JSON.stringify(data)}
    </Script>
  );
};

interface ArticleStructuredDataProps {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: string;
}

export const ArticleStructuredData = ({ title, description, slug, date, image }: ArticleStructuredDataProps) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image || "https://lilyslab.xyz/12.png",
    "datePublished": date,
    "dateModified": date,
    "author": {
      "@type": "Person",
      "name": "Lilian Ada",
      "url": "https://lilyslab.xyz"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Lily's Lab",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lilyslab.xyz/12.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://lilyslab.xyz/writing/${slug}`
    }
  };
  
  return (
    <Script 
      id={`article-schema-${slug}`}
      type="application/ld+json"
      strategy="afterInteractive"
    >
      {JSON.stringify(data)}
    </Script>
  );
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbStructuredData = ({ items }: BreadcrumbStructuredDataProps) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
  
  return (
    <Script 
      id="breadcrumb-schema"
      type="application/ld+json"
      strategy="afterInteractive"
    >
      {JSON.stringify(data)}
    </Script>
  );
};
