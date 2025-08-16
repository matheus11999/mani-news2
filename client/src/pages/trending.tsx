import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Flame, Eye } from "lucide-react";
import NewsCard from "@/components/news/news-card";
import SEOHead from "@/components/seo/seo-head";
import { Badge } from "@/components/ui/badge";
import { ArticleWithCategory } from "@shared/schema";

export default function Trending() {
  const { data: mostViewedArticles = [], isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles/most-viewed"],
  });

  const { data: recentArticles = [] } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles"],
    queryFn: async () => {
      const response = await fetch("/api/articles?limit=6");
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    },
  });

  return (
    <>
      <SEOHead
        title="Trending - Mani News"
        description="Descubra as notícias mais populares e em alta no momento. Acompanhe os assuntos que mais geram interesse."
        keywords="trending, populares, mais vistas, em alta, notícias"
      />

      <div className="page-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-8 mb-6">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Em Alta
              </h1>
              <p className="text-red-100 text-lg">
                As notícias mais populares do momento
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Most Viewed Section */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Mais Visualizadas</h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded mb-3"></div>
                      <div className="h-6 bg-gray-300 rounded mb-3"></div>
                      <div className="h-4 bg-gray-300 rounded mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : mostViewedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mostViewedArticles.map((article, index) => (
                  <div key={article.id} className="relative">
                    {index < 3 && (
                      <Badge 
                        className="absolute -top-2 -left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold"
                      >
                        #{index + 1}
                      </Badge>
                    )}
                    <NewsCard article={article} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Nenhuma notícia popular no momento.
                </p>
              </div>
            )}
          </section>

          {/* Recent Articles Section */}
          <section className="pb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Recentes</h2>
            </div>

            {recentArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArticles.slice(0, 6).map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Nenhuma notícia recente disponível.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}