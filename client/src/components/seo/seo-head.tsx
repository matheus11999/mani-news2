import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  articleData?: {
    title: string;
    author: string;
    publishedTime: string;
    modifiedTime: string;
    section: string;
    tags: string[];
  };
}

export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  ogImage,
  articleData 
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag("description", description);
    if (keywords) updateMetaTag("keywords", keywords);

    // Update Open Graph tags
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:url", window.location.href, "property");
    
    if (ogImage) {
      updateMetaTag("og:image", ogImage, "property");
    }

    // Update Twitter Card tags
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    if (ogImage) {
      updateMetaTag("twitter:image", ogImage);
    }

    // Article-specific meta tags
    if (articleData) {
      updateMetaTag("og:type", "article", "property");
      updateMetaTag("article:author", articleData.author, "property");
      updateMetaTag("article:published_time", articleData.publishedTime, "property");
      updateMetaTag("article:modified_time", articleData.modifiedTime, "property");
      updateMetaTag("article:section", articleData.section, "property");
      
      // Remove existing article:tag meta tags
      const existingTags = document.querySelectorAll('meta[property="article:tag"]');
      existingTags.forEach(tag => tag.remove());
      
      // Add new article:tag meta tags
      articleData.tags.forEach(tag => {
        const metaTag = document.createElement("meta");
        metaTag.setAttribute("property", "article:tag");
        metaTag.setAttribute("content", tag);
        document.head.appendChild(metaTag);
      });

      // Add JSON-LD structured data for articles
      updateStructuredData(articleData, ogImage);
    } else {
      updateMetaTag("og:type", "website", "property");
    }
  }, [title, description, keywords, ogImage, articleData]);

  return null;
}

function updateMetaTag(name: string, content: string, attribute: string = "name") {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute("content", content);
}

function updateStructuredData(articleData: SEOHeadProps["articleData"], ogImage?: string) {
  if (!articleData) return;

  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]#article-structured-data');
  if (existingScript) {
    existingScript.remove();
  }

  // Create new structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": articleData.title,
    "author": {
      "@type": "Person",
      "name": articleData.author
    },
    "datePublished": articleData.publishedTime,
    "dateModified": articleData.modifiedTime,
    "articleSection": articleData.section,
    "keywords": articleData.tags.join(", "),
    "publisher": {
      "@type": "Organization",
      "name": "Mani News",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/icon-512.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  if (ogImage) {
    (structuredData as any).image = {
      "@type": "ImageObject",
      "url": ogImage
    };
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "article-structured-data";
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}
