import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import NewsCard from "@/components/news/news-card";
import SEOHead from "@/components/seo/seo-head";
import { ArticleWithCategory, Category } from "@shared/schema";

export default function Categories() {
  const { slug } = useParams<{ slug?: string }>();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: selectedCategory } = useQuery<Category>({
    queryKey: ["/api/categories", slug],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${slug}`);
      if (!response.ok) throw new Error("Category not found");
      return response.json();
    },
    enabled: !!slug,
  });

  const { data: articles = [], isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles", selectedCategory?.id],
    queryFn: async () => {
      if (!selectedCategory?.id) return [];
      const response = await fetch(`/api/articles?categoryId=${selectedCategory.id}`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    },
    enabled: !!selectedCategory?.id,
  });

  const title = selectedCategory 
    ? `${selectedCategory.name} - Mani News`
    : "Categorias - Mani News";
  
  const description = selectedCategory
    ? `Confira as últimas notícias sobre ${selectedCategory.name.toLowerCase()}`
    : "Explore notícias por categoria: política, economia, esportes, tecnologia e mais";

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        keywords={selectedCategory ? `${selectedCategory.name.toLowerCase()}, notícias` : "categorias, notícias, política, economia, esportes"}
      />

      <div className="page-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-8 mb-6">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {selectedCategory ? selectedCategory.name : "Categorias"}
              </h1>
              <p className="text-red-100 text-lg">
                {selectedCategory 
                  ? `Últimas notícias sobre ${selectedCategory.name.toLowerCase()}`
                  : "Explore notícias por categoria"
                }
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {!selectedCategory ? (
            // Categories Grid
            <section className="pb-8">
              <h2 className="text-2xl font-bold mb-6">Todas as categorias</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center"
                    data-testid={`category-${category.slug}`}
                  >
                    <Badge 
                      style={{ backgroundColor: category.color }}
                      className="text-white font-medium mb-2"
                    >
                      {category.name}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Ver notícias
                    </p>
                  </a>
                ))}
              </div>
            </section>
          ) : (
            // Category Articles
            <section className="pb-8">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    Nenhuma notícia encontrada nesta categoria.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
