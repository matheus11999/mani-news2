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
        <section className={`py-12 mb-8 ${
          selectedCategory 
            ? `bg-gradient-to-br from-gray-100 to-gray-200` 
            : 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700'
        }`}>
          <div className="container mx-auto px-4">
            <div className="text-center">
              {selectedCategory ? (
                <>
                  <div className="mb-4">
                    <Link href="/categories">
                      <Button variant="outline" className="mb-4 bg-white/90 hover:bg-white">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar às categorias
                      </Button>
                    </Link>
                  </div>
                  <div 
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                    style={{ backgroundColor: selectedCategory.color }}
                  >
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                    {selectedCategory.name}
                  </h1>
                  <p className="text-gray-600 text-xl">
                    Últimas notícias sobre {selectedCategory.name.toLowerCase()}
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                    <Grid3X3 className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    📁 Categorias
                  </h1>
                  <p className="text-white/90 text-xl mb-6 max-w-2xl mx-auto">
                    Explore as notícias organizadas por assunto e encontre exatamente o que você procura
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <Grid3X3 className="h-6 w-6 text-white mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{categories.length}</div>
                        <div className="text-sm text-white/80">Categorias disponíveis</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                      <CardContent className="p-4 text-center">
                        <FileText className="h-6 w-6 text-white mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">∞</div>
                        <div className="text-sm text-white/80">Notícias organizadas</div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {!selectedCategory ? (
            // Categories Grid
            <section className="pb-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore por Categoria</h2>
                <p className="text-gray-600">Clique em uma categoria para ver as notícias relacionadas</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    data-testid={`category-${category.slug}`}
                  >
                    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                      <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                        <div>
                          <div 
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300"
                            style={{ backgroundColor: category.color }}
                          >
                            <FileText className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                        </div>
                        
                        <div>
                          <Badge 
                            style={{ backgroundColor: category.color }}
                            className="text-white font-medium mb-3"
                          >
                            Ver Notícias
                          </Badge>
                          <p className="text-sm text-gray-500">
                            Explore as últimas notícias
                          </p>
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
              <section className="mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Outras Categorias</h3>
                  <div className="flex flex-wrap gap-3">
                    {categories
                      .filter(cat => cat.id !== selectedCategory.id)
                      .slice(0, 6)
                      .map((category) => (
                      <Link key={category.id} href={`/categories/${category.slug}`}>
                        <Badge 
                          style={{ backgroundColor: category.color }}
                          className="text-white font-medium hover:opacity-80 transition-opacity cursor-pointer"
                        >
                          {category.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              {/* Articles Section */}
              <section className="pb-8">
                <div className="flex items-center gap-3 mb-8">
                  <div 
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: selectedCategory.color }}
                  >
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Notícias de {selectedCategory.name}
                    </h2>
                    <p className="text-gray-600">
                      {articles.length} {articles.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}
                    </p>
                  </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                      <div key={article.id} className="group">
                        <div className="transform group-hover:scale-105 transition-transform duration-300">
                          <NewsCard article={article} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div 
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 opacity-50"
                      style={{ backgroundColor: selectedCategory.color }}
                    >
                      <FileText className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Nenhuma notícia encontrada
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Ainda não há notícias publicadas nesta categoria.
                    </p>
                    <Link href="/">
                      <Button>
                        Ver todas as notícias
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
