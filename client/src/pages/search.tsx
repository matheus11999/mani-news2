import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import NewsCard from "@/components/news/news-card";
import SEOHead from "@/components/seo/seo-head";
import { ArticleWithCategory } from "@shared/schema";

export default function Search() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialQuery = urlParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults = [], isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles/search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const response = await fetch(`/api/articles/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (!response.ok) throw new Error("Failed to search articles");
      return response.json();
    },
    enabled: !!debouncedQuery.trim(),
  });

  return (
    <>
      <SEOHead
        title={debouncedQuery ? `Busca: ${debouncedQuery} - Mani News` : "Buscar - Mani News"}
        description={debouncedQuery ? `Resultados da busca por "${debouncedQuery}"` : "Busque por notícias, artigos e temas de seu interesse"}
        keywords={debouncedQuery ? `busca, pesquisa, ${debouncedQuery}` : "busca, pesquisa, notícias"}
      />

      <div className="page-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-8 mb-6">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Buscar Notícias
              </h1>
              <p className="text-red-100 text-lg">
                Encontre notícias sobre qualquer assunto
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="container mx-auto px-4 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Digite sua busca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-300 focus:border-primary"
                data-testid="input-search-page"
              />
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </section>

        {/* Search Results */}
        <section className="container mx-auto px-4 pb-8">
          {!debouncedQuery.trim() ? (
            <div className="text-center py-12">
              <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Digite algo para começar sua busca
              </h2>
              <p className="text-gray-600">
                Use palavras-chave para encontrar notícias sobre seus temas favoritos
              </p>
            </div>
          ) : isLoading ? (
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
          ) : searchResults.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">
                  {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{debouncedQuery}"
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhum resultado encontrado
              </h2>
              <p className="text-gray-600">
                Tente usar palavras-chave diferentes ou verifique a ortografia
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
