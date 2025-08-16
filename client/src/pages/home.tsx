import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import NewsCard from "@/components/news/news-card";
import CategoryFilter from "@/components/news/category-filter";
import SEOHead from "@/components/seo/seo-head";
import { ArticleWithCategory, Category } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: articles = [], isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/articles?categoryId=${selectedCategory}`
        : "/api/articles";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    },
  });

  const { data: searchResults = [] } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/articles/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Failed to search articles");
      return response.json();
    },
    enabled: !!searchQuery.trim(),
  });

  const displayedArticles = searchQuery.trim() ? searchResults : articles;

  return (
    <>
      <SEOHead
        title="Mani News - Notícias em Tempo Real"
        description="Acompanhe as últimas notícias em tempo real com o Mani News. Cobertura completa de política, economia, esportes e mais."
        keywords="notícias, tempo real, política, economia, esportes, tecnologia, Brasil"
        ogImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630"
      />

      <div className="page-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-8 mb-6">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Últimas Notícias
              </h1>
              <p className="text-red-100 text-lg">
                Fique por dentro de tudo que acontece no mundo
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="container mx-auto px-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full md:max-w-md">
              <Input
                type="text"
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>

            {/* Category Filters */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </section>

        {/* News Articles Grid */}
        <section className="container mx-auto px-4 pb-8">
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
          ) : displayedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {searchQuery.trim() 
                  ? "Nenhuma notícia encontrada para sua busca."
                  : "Nenhuma notícia disponível no momento."
                }
              </p>
            </div>
          )}

          {/* Load More Button - placeholder for future pagination */}
          {!searchQuery.trim() && displayedArticles.length > 0 && (
            <div className="text-center mt-8">
              <Button 
                className="px-8 py-3 bg-primary text-white font-medium hover:bg-secondary"
                data-testid="button-load-more"
              >
                Carregar mais notícias
              </Button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
