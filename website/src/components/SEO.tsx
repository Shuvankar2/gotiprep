import React, { useEffect } from 'react';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DOMAIN = 'https://gotiprep.suvnkr.in';
const DEFAULT_IMAGE = `${DOMAIN}/og-image.svg`;
const SITE_NAME = 'GotiPrep';
const TWITTER_HANDLE = '@suvnkrr';
const AUTHOR_NAME = 'Shuvankar Debnath (SUVNKR)';

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  breadcrumbs,
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = formattedTitle;

    // 2. Helper to set or create meta tag
    const setMetaTag = (selector: string, attrName: string, attrVal: string, contentVal: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentVal);
    };

    // 3. Compute normalized full URL
    const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
    const fullUrl = `${DOMAIN}${cleanPath}`;
    const fullImageUrl = image.startsWith('http') ? image : `${DOMAIN}${image.startsWith('/') ? image : `/${image}`}`;

    // 4. Primary Standard SEO Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    if (keywords) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    }
    setMetaTag('meta[name="author"]', 'name', 'author', AUTHOR_NAME);
    setMetaTag('meta[name="publisher"]', 'name', 'publisher', 'https://suvnkr.in');

    // Search Engine Directives
    const robotsVal = noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    setMetaTag('meta[name="robots"]', 'name', 'robots', robotsVal);
    setMetaTag('meta[name="googlebot"]', 'name', 'googlebot', robotsVal);
    setMetaTag('meta[name="bingbot"]', 'name', 'bingbot', robotsVal);

    // 5. Open Graph Meta Tags
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', formattedTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', fullUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', fullImageUrl);
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', formattedTitle);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_US');

    // 6. Twitter Card Meta Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', TWITTER_HANDLE);
    setMetaTag('meta[name="twitter:creator"]', 'name', 'twitter:creator', TWITTER_HANDLE);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', formattedTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', fullImageUrl);
    setMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', fullUrl);

    // 7. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // 8. Dynamic JSON-LD Structured Data Schema Injection
    const schemaList: any[] = [];

    // Auto-generate BreadcrumbList schema if breadcrumbs are supplied
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemaList.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((bc, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: bc.name,
          item: bc.path.startsWith('http') ? bc.path : `${DOMAIN}${bc.path.startsWith('/') ? bc.path : `/${bc.path}`}`,
        })),
      });
    }

    // Append custom page jsonLd schemas if supplied
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        schemaList.push(...jsonLd);
      } else {
        schemaList.push(jsonLd);
      }
    }

    const jsonLdId = 'gotiprep-page-jsonld';
    let scriptEl = document.getElementById(jsonLdId) as HTMLScriptElement | null;

    if (schemaList.length > 0) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = jsonLdId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schemaList.length === 1 ? schemaList[0] : schemaList);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      // Cleanup custom page JSON-LD on unmount
      const el = document.getElementById(jsonLdId);
      if (el) {
        el.remove();
      }
    };
  }, [title, description, keywords, path, image, type, noindex, breadcrumbs, jsonLd]);

  return null;
};

export default SEO;
