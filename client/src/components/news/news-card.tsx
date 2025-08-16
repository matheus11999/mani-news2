import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle } from "lucide-react";
import { formatRelativeTime } from "@/lib/seo";
import { shareToWhatsApp } from "@/lib/share";
import { ArticleWithCategory } from "@shared/schema";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  article: ArticleWithCategory;
  compact?: boolean;
}

export default function NewsCard({ article, compact = false }: NewsCardProps) {
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const articleUrl = `${window.location.origin}/article/${article.slug}`;
    shareToWhatsApp(articleUrl, article.title);
  };

  return (
    <article className={cn(
      "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer news-card",
      compact && "shadow-md"
    )}>
      <Link 
        href={`/article/${article.slug}`}
        className="block"
        data-testid={`article-card-${article.slug}`}
      >
        <img
          src={article.featuredImage}
          alt={article.title}
          className={cn(
            "w-full object-cover",
            compact ? "h-32" : "h-48"
          )}
          loading="lazy"
          data-testid="img-article-featured"
        />
        
        <div className={cn("p-6", compact && "p-4")}>
          <div className="flex items-center justify-between mb-3">
            <Badge 
              style={{ backgroundColor: article.category.color }}
              className="text-white text-xs font-medium"
              data-testid="badge-category"
            >
              {article.category.name}
            </Badge>
            <span className="text-gray-500 text-sm" data-testid="text-published-time">
              {formatRelativeTime(new Date(article.publishedAt!))}
            </span>
          </div>

          <h2 className={cn(
            "font-bold mb-3 line-clamp-2 hover:text-primary transition-colors",
            compact ? "text-lg" : "text-xl"
          )} data-testid="text-article-title">
            {article.title}
          </h2>

          {!compact && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3" data-testid="text-article-summary">
              {article.summary}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
              <Eye className="h-4 w-4 mr-1" />
              <span data-testid="text-article-views">
                {(article.views || 0).toLocaleString()}
              </span>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={handleShare}
              data-testid="button-share-whatsapp"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Compartilhar</span>
            </Button>
          </div>
        </div>
      </Link>
    </article>
  );
}
