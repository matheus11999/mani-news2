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
        <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 py-12 mb-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 animate-pulse">
                <Flame className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                🔥 Em Alta
              </h1>
              <p className="text-white/90 text-xl mb-6 max-w-2xl mx-auto">
                Descubra as notícias que estão bombando e os assuntos mais comentados do momento
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{mostViewedArticles.length}</div>
                    <div className="text-sm text-white/80">Notícias em alta</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Eye className="h-6 w-6 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</div>
                    <div className="text-sm text-white/80">Visualizações totais</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Star className="h-6 w-6 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{Object.keys(topCategories).length}</div>
                    <div className="text-sm text-white/80">Categorias ativas</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Featured Article - Destaque Principal */}
          {mostViewedArticles.length > 0 && (
            <section className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">⭐ Destaque do Dia</h2>
                <p className="text-gray-600">A notícia mais visualizada de hoje</p>
              </div>
              
              {/* Principal Article with full width */}
              <div className="mb-8">
                <div className="relative group">
                  <Badge className="absolute -top-3 -left-3 z-20 font-bold text-xl px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg">
                    🏆 DESTAQUE
                  </Badge>
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden group-hover:shadow-2xl transition-shadow duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      <div className="relative">
                        <img 
                          src={mostViewedArticles[0].imageUrl || "/placeholder.jpg"} 
                          alt={mostViewedArticles[0].title}
                          className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-red-500 text-white font-semibold px-3 py-1">
                            {mostViewedArticles[0].views?.toLocaleString()} views
                          </Badge>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        {mostViewedArticles[0].category && (
                          <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/20">
                            {mostViewedArticles[0].category.name}
                          </Badge>
                        )}
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                          {mostViewedArticles[0].title}
                        </h3>
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                          {mostViewedArticles[0].excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {new Date(mostViewedArticles[0].publishedAt).toLocaleDateString('pt-BR')}
                          </div>
                          <a 
                            href={`/artigo/${mostViewedArticles[0].slug}`} 
                            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                          >
                            Ler Matéria →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 2-5 in smaller grid */}
              {mostViewedArticles.length > 1 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Outras em Destaque</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mostViewedArticles.slice(1, 5).map((article, index) => (
                      <div key={article.id} className="relative group">
                        <Badge className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold">
                          #{index + 2}
                        </Badge>
                        <div className="transform group-hover:scale-105 transition-transform duration-300">
                          <NewsCard article={article} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* All Trending Articles */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Todas em Alta</h2>
                <p className="text-gray-600">Ordenadas por popularidade</p>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
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
                  <div key={article.id} className="relative group">
                    <Badge 
                      className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold"
                    >
                      #{index + 1}
                    </Badge>
                    <div className="transform group-hover:scale-105 transition-transform duration-300">
                      <NewsCard article={article} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma notícia em alta</h3>
                <p className="text-gray-500">
                  As notícias mais populares aparecerão aqui em breve.
                </p>
              </div>
            )}
          </section>

          {/* Recent Articles Section */}
          <section className="pb-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Recém-publicadas</h2>
                <p className="text-gray-600">As últimas notícias para você ficar por dentro</p>
              </div>
            </div>

            {recentArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArticles.slice(0, 9).map((article) => (
                  <div key={article.id} className="group">
                    <div className="transform group-hover:scale-105 transition-transform duration-300">
                      <NewsCard article={article} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma notícia recente</h3>
                <p className="text-gray-500">
                  As últimas notícias aparecerão aqui.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}