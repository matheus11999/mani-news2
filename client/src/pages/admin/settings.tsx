import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Globe, Palette, Search, Share2 } from "lucide-react";

interface SiteConfig {
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  googleAnalyticsId?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

const DEFAULT_COLORS = [
  "#e50914", "#dc2626", "#ea580c", "#d97706", "#ca8a04",
  "#65a30d", "#16a34a", "#059669", "#0d9488", "#0891b2",
  "#0284c7", "#2563eb", "#4f46e5", "#7c3aed", "#9333ea",
  "#c026d3", "#db2777", "#e11d48", "#64748b", "#6b7280"
];

export default function AdminSettings() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<SiteConfig>({
    siteName: "",
    siteDescription: "",
    siteKeywords: "",
    primaryColor: "#e50914",
    secondaryColor: "#dc2626",
    contactEmail: "",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    googleAnalyticsId: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const { data: siteConfig, isLoading } = useQuery<SiteConfig>({
    queryKey: ["/api/admin/site-config"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/site-config", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch site config");
      return response.json();
    },
  });

  const updateConfig = useMutation({
    mutationFn: async (data: SiteConfig) => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update site config");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-config"] });
      setSuccess("Configurações atualizadas com sucesso!");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (error: Error) => {
      setError(error.message);
      setSuccess("");
    },
  });

  useEffect(() => {
    if (siteConfig) {
      setFormData({
        siteName: siteConfig.siteName || "",
        siteDescription: siteConfig.siteDescription || "",
        siteKeywords: siteConfig.siteKeywords || "",
        primaryColor: siteConfig.primaryColor || "#e50914",
        secondaryColor: siteConfig.secondaryColor || "#dc2626",
        contactEmail: siteConfig.contactEmail || "",
        facebookUrl: siteConfig.facebookUrl || "",
        twitterUrl: siteConfig.twitterUrl || "",
        instagramUrl: siteConfig.instagramUrl || "",
        googleAnalyticsId: siteConfig.googleAnalyticsId || "",
        metaDescription: siteConfig.metaDescription || "",
        metaKeywords: siteConfig.metaKeywords || "",
      });
    }
  }, [siteConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    updateConfig.mutate(formData);
  };

  const handleInputChange = (field: keyof SiteConfig) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Carregando configurações...</p>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Gerencie as configurações gerais do seu site</p>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={updateConfig.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {updateConfig.isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Social
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Nome do Site *</Label>
                      <Input
                        id="siteName"
                        value={formData.siteName}
                        onChange={handleInputChange("siteName")}
                        placeholder="Mani News"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email de Contato *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleInputChange("contactEmail")}
                        placeholder="contato@maninews.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Descrição do Site</Label>
                    <Textarea
                      id="siteDescription"
                      value={formData.siteDescription}
                      onChange={handleInputChange("siteDescription")}
                      placeholder="Portal de notícias em tempo real"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteKeywords">Palavras-chave do Site</Label>
                    <Input
                      id="siteKeywords"
                      value={formData.siteKeywords}
                      onChange={handleInputChange("siteKeywords")}
                      placeholder="notícias, tempo real, brasil, política, economia"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cores e Tema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Cor Primária</Label>
                        <Input
                          type="color"
                          value={formData.primaryColor}
                          onChange={handleInputChange("primaryColor")}
                          className="w-full h-12"
                        />
                        <div className="grid grid-cols-10 gap-2 mt-3">
                          {DEFAULT_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`w-6 h-6 rounded-full border-2 ${
                                formData.primaryColor === color ? 'border-gray-400' : 'border-gray-200'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setFormData(prev => ({ ...prev, primaryColor: color }))}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Cor Secundária</Label>
                        <Input
                          type="color"
                          value={formData.secondaryColor}
                          onChange={handleInputChange("secondaryColor")}
                          className="w-full h-12"
                        />
                        <div className="grid grid-cols-10 gap-2 mt-3">
                          {DEFAULT_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`w-6 h-6 rounded-full border-2 ${
                                formData.secondaryColor === color ? 'border-gray-400' : 'border-gray-200'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setFormData(prev => ({ ...prev, secondaryColor: color }))}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3">Preview das Cores</h4>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: formData.primaryColor }}
                      >
                        P
                      </div>
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: formData.secondaryColor }}
                      >
                        S
                      </div>
                      <span className="text-sm text-gray-600">
                        Essas cores serão aplicadas em todo o site
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO e Meta Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Descrição</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange("metaDescription")}
                      placeholder="Descrição que aparece nos resultados de busca"
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500">
                      {formData.metaDescription.length}/160 caracteres
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                      id="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleInputChange("metaKeywords")}
                      placeholder="palavras, chave, separadas, por, vírgula"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                    <Input
                      id="googleAnalyticsId"
                      value={formData.googleAnalyticsId}
                      onChange={handleInputChange("googleAnalyticsId")}
                      placeholder="G-XXXXXXXXXX ou UA-XXXXXXXXX-X"
                    />
                    <p className="text-xs text-gray-500">
                      ID de rastreamento do Google Analytics para estatísticas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebookUrl">Facebook URL</Label>
                    <Input
                      id="facebookUrl"
                      value={formData.facebookUrl}
                      onChange={handleInputChange("facebookUrl")}
                      placeholder="https://facebook.com/maninews"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                    <Input
                      id="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={handleInputChange("twitterUrl")}
                      placeholder="https://twitter.com/maninews"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagramUrl">Instagram URL</Label>
                    <Input
                      id="instagramUrl"
                      value={formData.instagramUrl}
                      onChange={handleInputChange("instagramUrl")}
                      placeholder="https://instagram.com/maninews"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </AdminLayout>
  );
}