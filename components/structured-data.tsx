import { AUTHOR, SITE_URL } from "@/lib/seo";

/**
 * schema.org data for search engines, written straight into the HTML (not added
 * later by JavaScript) so crawlers see it on the first read.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here once "<" is escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Who the site belongs to: the person Google shows for a name search. */
export const PersonStructuredData = () => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR.name,
      alternateName: AUTHOR.alternateName,
      url: SITE_URL,
      image: `${SITE_URL}/images/logo.png`,
      description: "Writer and software engineer. Essays and notes on writing, creativity and the personal web, plus small web apps.",
      jobTitle: ["Writer", "Software Engineer", "Product Manager"],
      sameAs: AUTHOR.sameAs,
      knowsAbout: [
        "Writing",
        "Essays",
        "Digital gardens",
        "Personal websites",
        "IndieWeb",
        "Web development",
        "User interface design",
        "Product management",
      ],
    }}
  />
);

/** The site itself, and that it belongs to the person above. */
export const WebsiteStructuredData = () => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Lily's Lab",
      alternateName: ["Lilyslab", "Lily's Garden"],
      url: SITE_URL,
      description: "Lilian Ada's digital garden: essays, notes and small web apps.",
      inLanguage: "en",
      author: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#person` },
    }}
  />
);

/** A trail of pages, shown by Google in place of the address. */
export const BreadcrumbStructuredData = ({ items }: { items: { name: string; url: string }[] }) => (
  <JsonLd
    data={{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
      })),
    }}
  />
);
