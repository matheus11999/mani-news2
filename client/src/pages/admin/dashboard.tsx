import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Folder, Eye, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalArticles: number;
  totalCategories: number;
  totalViews: number;
  recentArticles: any[];
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const statCards = [
    {
      title: "Total de Artigos",
      value: stats?.totalArticles || 0,
      icon: FileText,
      description: "Artigos publicados",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Categorias",
      value: stats?.totalCategories || 0,
      icon: Folder,
      description: "Categorias ativas",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total de Visualizações",
      value: stats?.totalViews || 0,
      icon: Eye,
      description: "Visualizações totais",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Tendência",
      value: "+12%",
      icon: TrendingUp,
      description: "Crescimento mensal",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu site de notícias</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Artigos Recentes</CardTitle>
              <CardDescription>
                Últimos artigos criados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : stats?.recentArticles?.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentArticles.map((article: any) => (
                    <div key={article.id} className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {article.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum artigo encontrado</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesso rápido às principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => window.location.href = "/admin/articles/new"}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="font-medium">Novo Artigo</p>
                  <p className="text-sm text-gray-600">Criar artigo</p>
                </button>
                
                <button 
                  onClick={() => window.location.href = "/admin/categories"}
                  className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Folder className="h-6 w-6 text-green-600 mb-2" />
                  <p className="font-medium">Categorias</p>
                  <p className="text-sm text-gray-600">Gerenciar categorias</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}