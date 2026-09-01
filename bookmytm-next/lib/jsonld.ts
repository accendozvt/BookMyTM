import { SITE } from './site';

/**
 * One @graph per page. Nodes are cross-referenced by @id so the Organization and
 * WebSite are declared once and pointed at, rather than repeated in every node.
 */

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;
const LANG = 'en-IN';

export type Crumb = { label: string; href: string };

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    // legalName is deliberately omitted — the registered entity name has not been
    // confirmed, and guessing it would put a wrong company name in structured data.
    description:
      "India's trusted platform for trademark registration, ISO certification, startup registration, and IP services.",
    slogan: SITE.tagline,
    email: SITE.email,
    telephone: SITE.phone1,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.url}/images/logo.png`,
      width: 300,
      height: 75,
    },
    image: `${SITE.url}/assets/opengraph/preview.webp`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot No 207, Behind Onam Park, Mavelipuram, Kakkanad',
      addressLocality: 'Kochi',
      addressRegion: 'Kerala',
      postalCode: '682030',
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE.phone1,
        contactType: 'customer service',
        email: SITE.email,
        areaServed: 'IN',
        availableLanguage: ['en', 'ml'],
      },
      {
        '@type': 'ContactPoint',
        telephone: SITE.phone2,
        contactType: 'sales',
        areaServed: 'IN',
        availableLanguage: ['en', 'ml'],
      },
    ],
    sameAs: [SITE.facebook, SITE.instagram],
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: SITE.name,
    url: SITE.url,
    inLanguage: LANG,
    publisher: { '@id': ORG_ID },
  };
}

export function webPageNode(a: {
  path: string;
  name: string;
  description: string;
  hasBreadcrumb?: boolean;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const url = SITE.url + a.path;
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: a.name,
    description: a.description,
    isPartOf: { '@id': SITE_ID },
    inLanguage: LANG,
    ...(a.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: abs(a.image) } } : {}),
    ...(a.hasBreadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    ...(a.datePublished ? { datePublished: a.datePublished } : {}),
    ...(a.dateModified ? { dateModified: a.dateModified } : {}),
  };
}

export function breadcrumbNode(path: string, crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${SITE.url}${path}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: SITE.url + c.href,
    })),
  };
}

export function serviceNode(a: {
  path: string;
  name: string;
  description: string;
  /** Only pass a price that is actually printed on the page. */
  price?: string;
}) {
  const url = SITE.url + a.path;
  // Pull the digit run out of strings like "Rs. 6,400" — stripping to [\d.] instead
  // kept the dot after "Rs" and produced an invalid price of ".6400".
  const m = a.price ? a.price.match(/([\d,]+)/) : null;
  const amount = m ? m[1].replace(/,/g, '') : '';
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: a.name,
    description: a.description,
    serviceType: a.name,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'India' },
    ...(amount
      ? {
          offers: {
            '@type': 'Offer',
            price: amount,
            priceCurrency: 'INR',
            url,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}

export function articleNode(a: {
  path: string;
  headline: string;
  description: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  datePublished?: string;
  dateModified?: string;
}) {
  const url = SITE.url + a.path;
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: a.headline,
    description: a.description,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    inLanguage: LANG,
    ...(a.image
      ? {
          image: {
            '@type': 'ImageObject',
            url: abs(a.image),
            ...(a.imageWidth ? { width: a.imageWidth } : {}),
            ...(a.imageHeight ? { height: a.imageHeight } : {}),
          },
        }
      : {}),
    ...(a.datePublished ? { datePublished: a.datePublished } : {}),
    // Falls back to datePublished: claiming a modification date we don't track
    // would be inventing data.
    dateModified: a.dateModified || a.datePublished,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
  };
}

export function faqNode(path: string, items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE.url}${path}#faq`,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function abs(src: string) {
  return /^https?:\/\//.test(src) ? src : SITE.url + src;
}

/** Wraps nodes into a single @graph document. */
export function graph(...nodes: (object | null | undefined | false)[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}
