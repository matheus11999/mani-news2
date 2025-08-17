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
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-16 mb-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 animate-pulse">
                <SearchIcon className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                🔍 Buscar Notícias
              </h1>
              <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
                Encontre exatamente o que você procura em nosso acervo de notícias
              </p>
              
              {/* Search Box in Hero */}
              <div className="max-w-3xl mx-auto">
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="Digite o que você está procurando..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-14 pr-6 py-6 text-lg border-0 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl focus:bg-white focus:ring-4 focus:ring-white/30 transition-all duration-300 group-hover:shadow-3xl"
                    data-testid="input-search-page"
                  />
                  <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 h-6 w-6 group-focus-within:text-primary transition-colors" />
                  {searchQuery && (
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                      <div className="flex items-center space-x-2">
                        {isLoading && (
                          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        )}
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Results */}
        <section className="container mx-auto px-4 pb-8">
          {!debouncedQuery.trim() ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Pronto para descobrir?
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Digite palavras-chave na busca acima para encontrar notícias sobre seus temas favoritos. 
                  Nossa busca é inteligente e busca em títulos, resumos e conteúdo completo.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {['política', 'economia', 'esportes', 'tecnologia', 'saúde'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
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
              <div className="mb-8">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <SearchIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        ✨ {searchResults.length} resultado{searchResults.length !== 1 ? 's encontrados' : ' encontrado'}
                      </h2>
                      <p className="text-gray-600">
                        Resultados para: <span className="font-semibold text-primary">"{debouncedQuery}"</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((article, index) => (
                  <div key={article.id} className="group">
                    <div className="transform group-hover:scale-105 transition-transform duration-300">
                      <NewsCard article={article} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-gray-400 to-gray-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  😔 Nenhum resultado encontrado
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Não encontramos notícias relacionadas a "<span className="font-semibold">{debouncedQuery}</span>".
                  <br />Tente usar palavras-chave diferentes ou verifique a ortografia.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  ← Nova Busca
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
