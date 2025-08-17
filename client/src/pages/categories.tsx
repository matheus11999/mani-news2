import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/news/news-card";
import SEOHead from "@/components/seo/seo-head";
import { ArticleWithCategory, Category } from "@shared/schema";
import { Grid3X3, FileText, ArrowLeft, BookOpen } from "lucide-react";

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
        <section className={`py-16 mb-12 ${
          selectedCategory 
            ? `bg-white border-b` 
            : 'bg-gradient-to-r from-slate-900 to-slate-800'
        }`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {selectedCategory ? (
                <>
                  <div className="mb-6">
                    <Link href="/categories">
                      <Button variant="outline" className="mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Todas as Categorias
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: selectedCategory.color }}
                    >
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {selectedCategory.name}
                      </h1>
                      <p className="text-gray-600 text-lg">
                        Notícias sobre {selectedCategory.name.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Categorias
                  </h1>
                  <p className="text-gray-300 text-xl">
                    Explore notícias organizadas por temas e assuntos
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {!selectedCategory ? (
            // Categories Grid
            <section className="pb-16">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Todas as Categorias</h2>
                <p className="text-gray-600 text-lg">Escolha um tema para explorar as notícias</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    data-testid={`category-${category.slug}`}
                  >
                    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 h-full border border-gray-200 hover:border-gray-300">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                            style={{ backgroundColor: category.color }}
                          >
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Explorar notícias
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            Ver todas as notícias
                          </span>
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                            style={{ backgroundColor: category.color + '20' }}
                          >
                            <ArrowLeft className="h-4 w-4 rotate-180" style={{ color: category.color }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            // Category Articles
            <>
              {/* Category Navigation */}
              <section className="mb-12">
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Explorar Outras Categorias</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories
                      .filter(cat => cat.id !== selectedCategory.id)
                      .slice(0, 6)
                      .map((category) => (
                      <Link key={category.id} href={`/categories/${category.slug}`}>
                        <div className="group cursor-pointer">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200"
                            style={{ backgroundColor: category.color }}
                          >
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                            {category.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              {/* Articles Section */}
              <section className="pb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Notícias de {selectedCategory.name}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {articles.length} {articles.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}
                  </p>
                </div>

                {isLoading ? (
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
                ) : articles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Nenhuma notícia nesta categoria
                    </h3>
                    <p className="text-gray-600 text-lg mb-8">
                      Ainda não há notícias publicadas em {selectedCategory.name.toLowerCase()}.
                    </p>
                    <Link href="/">
                      <Button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90">
                        Ver Todas as Notícias
                      </Button>
                    </Link>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
