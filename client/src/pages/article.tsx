import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowLeft, Eye, User, Calendar, Copy, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo/seo-head";
import NewsCard from "@/components/news/news-card";
import { shareToWhatsApp, shareToFacebook, shareToTwitter, copyToClipboard } from "@/lib/share";
import { formatRelativeTime } from "@/lib/seo";
import { ArticleWithCategory } from "@shared/schema";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, error } = useQuery<ArticleWithCategory>({
    queryKey: ["/api/articles", slug],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Article not found");
        }
        throw new Error("Failed to fetch article");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  const { data: relatedArticles = [] } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles", article?.categoryId],
    queryFn: async () => {
      if (!article?.categoryId) return [];
      const response = await fetch(`/api/articles?categoryId=${article.categoryId}&limit=3`);
      if (!response.ok) return [];
      const articles = await response.json();
      return articles.filter((a: ArticleWithCategory) => a.id !== article.id);
    },
    enabled: !!article?.categoryId,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-20 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
          <div className="w-full h-96 bg-gray-300 rounded-xl mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artigo não encontrado</h1>
          <p className="text-gray-600 mb-6">O artigo que você está procurando não existe ou foi removido.</p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-primary hover:bg-secondary"
            data-testid="button-go-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const articleUrl = `${window.location.origin}/article/${article.slug}`;

  return (
    <>
      <SEOHead
        title={`${article.title} | Mani News`}
        description={article.metaDescription || article.summary}
        keywords={article.metaKeywords || article.tags.join(", ")}
        ogImage={article.featuredImage}
        articleData={{
          title: article.title,
          author: article.author,
          publishedTime: article.publishedAt?.toISOString() || new Date().toISOString(),
          modifiedTime: article.updatedAt?.toISOString() || new Date().toISOString(),
          section: article.category.name,
          tags: article.tags,
        }}
      />

      <article className="container mx-auto px-4 py-8 max-w-4xl page-content">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-primary"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <Badge 
              style={{ backgroundColor: article.category.color }}
              className="text-white font-medium"
            >
              {article.category.name}
            </Badge>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatRelativeTime(new Date(article.publishedAt!))}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-article-title">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-xl text-gray-600 mb-6" data-testid="text-article-subtitle">
              {article.subtitle}
            </p>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span data-testid="text-article-author">Por {article.author}</span>
              <span className="mx-2">•</span>
              <Eye className="h-4 w-4 mr-1" />
              <span data-testid="text-article-views">{article.views || 0} visualizações</span>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => shareToWhatsApp(articleUrl, article.title)}
                data-testid="button-share-whatsapp"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => shareToFacebook(articleUrl)}
                data-testid="button-share-facebook"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(articleUrl)}
                data-testid="button-copy-link"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <figure className="mb-8">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full rounded-xl shadow-lg"
            loading="lazy"
            data-testid="img-article-featured"
          />
          {article.imageCaption && (
            <figcaption className="text-sm text-gray-600 mt-2 text-center" data-testid="text-image-caption">
              {article.imageCaption}
            </figcaption>
          )}
        </figure>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none" 
          dangerouslySetInnerHTML={{ __html: article.content }}
          data-testid="content-article-body"
        />

        {/* Article Tags */}
        {article.tags.length > 0 && (
          <div className="border-t border-gray-200 pt-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">Tags relacionadas</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  data-testid={`tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-2xl font-bold mb-6">Notícias relacionadas</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <NewsCard key={relatedArticle.id} article={relatedArticle} compact />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
