import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/news/news-card";
import NewsCarousel from "@/components/news/news-carousel";
import SEOHead from "@/components/seo/seo-head";
import { ArticleWithCategory } from "@shared/schema";

export default function Home() {
  const { data: articles = [], isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles"],
  });

  return (
    <>
      <SEOHead
        title="Mani News - Notícias em Tempo Real"
        description="Acompanhe as últimas notícias em tempo real com o Mani News. Cobertura completa de política, economia, esportes e mais."
        keywords="notícias, tempo real, política, economia, esportes, tecnologia, Brasil"
        ogImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630"
      />

      <div className="page-content">
        {/* Hero Carousel */}
        <section className="container mx-auto px-4 mb-8">
          <NewsCarousel articles={articles} />
        </section>

        {/* Latest News Section */}
        <section className="container mx-auto px-4 pb-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Últimas Notícias</h2>
            <p className="text-gray-600">Fique por dentro de tudo que acontece no mundo</p>
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
          ) : articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}  
              </div>
              
              {/* Load More Button */}
              {articles.length >= 6 && (
                <div className="text-center mt-8">
                  <Button 
                    className="px-8 py-3 bg-primary text-white font-medium hover:bg-secondary"
                    data-testid="button-load-more"
                  >
                    Carregar mais notícias
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Nenhuma notícia disponível no momento.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
