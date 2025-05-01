/**
 * Structured Data Generator Script
 * 
 * This script generates JSON-LD structured data for the website
 * to improve SEO and enable rich snippets in search results.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Generate Person structured data
const generatePersonData = () => {
  const personData = {
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

  return personData;
};

// Generate WebSite structured data
const generateWebsiteData = () => {
  const websiteData = {
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

  return websiteData;
};

// Generate Article structured data for blog posts
const generateArticleData = (title, description, slug, date, image) => {
  const articleData = {
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

  return articleData;
};

// Generate BreadcrumbList structured data
const generateBreadcrumbData = (items) => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return breadcrumbData;
};

// Write structured data to files
const writeStructuredData = async () => {
  // Create directory if it doesn't exist
  const outputDir = path.join(process.cwd(), 'public', 'structured-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate and write person data
  const personData = generatePersonData();
  fs.writeFileSync(
    path.join(outputDir, 'person.json'),
    JSON.stringify(personData, null, 2)
  );
  
  // Generate and write website data
  const websiteData = generateWebsiteData();
  fs.writeFileSync(
    path.join(outputDir, 'website.json'),
    JSON.stringify(websiteData, null, 2)
  );
  
  // Generate example breadcrumb data
  const breadcrumbData = generateBreadcrumbData([
    { name: "Home", url: "https://lilyslab.xyz" },
    { name: "Digital Garden", url: "https://lilyslab.xyz/digital-garden" },
    { name: "Notes", url: "https://lilyslab.xyz/digital-garden/notes" }
  ]);
  fs.writeFileSync(
    path.join(outputDir, 'breadcrumb-example.json'),
    JSON.stringify(breadcrumbData, null, 2)
  );
  
  // Generate example article data
  const articleData = generateArticleData(
    "Example Blog Post",
    "This is an example blog post description.",
    "example-post",
    "2025-01-01T12:00:00Z",
    "https://lilyslab.xyz/example-image.jpg"
  );
  fs.writeFileSync(
    path.join(outputDir, 'article-example.json'),
    JSON.stringify(articleData, null, 2)
  );
  
  // Generate script tags for embedding
  const scriptTags = {
    person: `<script type="application/ld+json">${JSON.stringify(personData)}</script>`,
    website: `<script type="application/ld+json">${JSON.stringify(websiteData)}</script>`,
    breadcrumb: `<script type="application/ld+json">${JSON.stringify(breadcrumbData)}</script>`,
    article: `<script type="application/ld+json">${JSON.stringify(articleData)}</script>`
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'script-tags.txt'),
    Object.entries(scriptTags)
      .map(([key, value]) => `<!-- ${key} structured data -->\n${value}\n`)
      .join('\n')
  );
  
  // Generate React component for structured data
  const reactComponent = `
import React from 'react';

export const PersonStructuredData = () => {
  const data = ${JSON.stringify(personData, null, 2)};
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export const WebsiteStructuredData = () => {
  const data = ${JSON.stringify(websiteData, null, 2)};
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export const ArticleStructuredData = ({ title, description, slug, date, image }) => {
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
      "@id": \`https://lilyslab.xyz/writing/\${slug}\`
    }
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export const BreadcrumbStructuredData = ({ items }) => {
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
`;
  
  fs.writeFileSync(
    path.join(process.cwd(), 'components', 'structured-data.tsx'),
    reactComponent
  );
  
  console.log('Structured data generated successfully!');
  console.log(`Files saved to ${outputDir}`);
  console.log('React component saved to components/structured-data.tsx');
};

// Main function
const main = async () => {
  console.log('Generating structured data...');
  await writeStructuredData();
  
  console.log('\n=== Structured Data Generation Complete ===');
  console.log('\nTo implement structured data in your website:');
  console.log('1. Add the PersonStructuredData and WebsiteStructuredData components to your app/layout.tsx');
  console.log('2. Add the ArticleStructuredData component to your blog post pages');
  console.log('3. Add the BreadcrumbStructuredData component to your pages with breadcrumb navigation');
  console.log('\nExample usage in app/layout.tsx:');
  console.log(`
import { PersonStructuredData, WebsiteStructuredData } from '@/components/structured-data';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Other head elements */}
        <PersonStructuredData />
        <WebsiteStructuredData />
      </head>
      <body>{children}</body>
    </html>
  );
}
  `);
  
  console.log('\nExample usage in app/writing/[slug]/page.tsx:');
  console.log(`
import { ArticleStructuredData } from '@/components/structured-data';

export default function BlogPost({ params }) {
  const post = getPostBySlug(params.slug);
  
  return (
    <>
      <ArticleStructuredData
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        date={post.date}
        image={post.coverImage}
      />
      {/* Rest of your component */}
    </>
  );
}
  `);
};

// Run the script
main().catch(err => {
  console.error('Error generating structured data:', err);
  process.exit(1);
});
