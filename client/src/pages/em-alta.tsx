import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Flame, Eye, Star, Clock } from "lucide-react";
import NewsCard from "@/components/news/news-card";
import SEOHead from "@/components/seo/seo-head";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArticleWithCategory } from "@shared/schema";

export default function EmAlta() {
  const { data: mostViewedArticles = [], isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles/most-viewed"],
  });

  const { data: recentArticles = [] } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles"],
    queryFn: async () => {
      const response = await fetch("/api/articles?limit=9");
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    },
  });

  // Get stats
  const totalViews = mostViewedArticles.reduce((sum, article) => sum + (article.views || 0), 0);
  const topCategories = mostViewedArticles.reduce((acc, article) => {
    if (article.category) {
      acc[article.category.name] = (acc[article.category.name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <SEOHead
        title="Em Alta - Mani News"
        description="Descubra as notícias mais populares e em alta no momento. Acompanhe os assuntos que mais geram interesse e as tendências do dia."
        keywords="em alta, trending, populares, mais lidas, tendências, notícias populares"
      />

      <div className="page-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 mb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Notícias Populares
              </h1>
              <p className="text-gray-300 text-xl leading-relaxed">
                As notícias mais lidas e comentadas pelos nossos leitores
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Featured Article Section */}
          {mostViewedArticles.length > 0 && (
            <section className="mb-16">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Mais Lida da Semana</h2>
                <p className="text-gray-600 text-lg">A notícia que mais chamou atenção dos nossos leitores</p>
              </div>
              
              {/* Principal Article */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-80 lg:h-96">
                    <img 
                      src={mostViewedArticles[0].featuredImage || "/placeholder.jpg"} 
                      alt={mostViewedArticles[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge 
                        style={{ backgroundColor: mostViewedArticles[0].category.color }}
                        className="text-white font-semibold px-3 py-1"
                      >
                        {mostViewedArticles[0].category.name}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      {mostViewedArticles[0].title}
                    </h3>
                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                      {mostViewedArticles[0].summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Eye className="h-4 w-4 mr-2" />
                        <span>{mostViewedArticles[0].views?.toLocaleString()} visualizações</span>
                      </div>
                      <a 
                        href={`/article/${mostViewedArticles[0].slug}`} 
                        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Ler Notícia
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Popular Articles */}
              {mostViewedArticles.length > 1 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Outras Notícias Populares</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mostViewedArticles.slice(1, 7).map((article, index) => (
                      <div key={article.id} className="relative">
                        <div className="absolute -top-3 -left-3 z-10 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 2}
                        </div>
                        <NewsCard article={article} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          )}

          {/* Empty State */}
          {!isLoading && mostViewedArticles.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhuma notícia popular ainda</h3>
              <p className="text-gray-600 text-lg">
                As notícias mais lidas aparecerão aqui em breve.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}