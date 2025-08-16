import { db } from "../server/db";
import { storage } from "../server/storage";
import { categories, users, articles } from "@shared/schema";
import { eq } from "drizzle-orm";

async function initializeDatabase() {
  console.log("🚀 Initializing database...");

  try {
    // Check if site config exists
    console.log("📋 Checking site configuration...");
    let config = await storage.getSiteConfig();
    if (!config) {
      console.log("📝 Creating default site configuration...");
      config = await storage.updateSiteConfig({
        siteName: "Mani News",
        siteDescription: "Portal de notícias em tempo real",
        siteKeywords: "notícias, tempo real, brasil, política, economia",
        primaryColor: "#e50914",
        secondaryColor: "#dc2626",
        contactEmail: "contato@maninews.com",
      });
      console.log("✅ Site configuration created");
    }

    // Check if categories exist
    console.log("📂 Checking categories...");
    const existingCategories = await storage.getCategories();
    if (existingCategories.length === 0) {
      console.log("📝 Creating default categories...");
      
      const defaultCategories = [
        { name: "Política", slug: "politica", color: "#e50914" },
        { name: "Economia", slug: "economia", color: "#3b82f6" },
        { name: "Esportes", slug: "esportes", color: "#10b981" },
        { name: "Tecnologia", slug: "tecnologia", color: "#8b5cf6" },
        { name: "Ambiente", slug: "ambiente", color: "#059669" },
        { name: "Educação", slug: "educacao", color: "#f59e0b" },
        { name: "Saúde", slug: "saude", color: "#ef4444" },
        { name: "Cultura", slug: "cultura", color: "#f97316" },
      ];

      for (const category of defaultCategories) {
        await storage.createCategory(category);
        console.log(`✅ Category created: ${category.name}`);
      }
    }

    // Check if admin user exists
    console.log("👤 Checking admin user...");
    const adminUsers = await db.select()
      .from(users)
      .where(eq(users.role, "admin"))
      .limit(1);

    if (adminUsers.length === 0) {
      console.log("📝 No admin user found. You'll need to register at /admin/register");
    } else {
      console.log("✅ Admin user exists");
    }

    // Check if sample articles exist
    console.log("📰 Checking sample articles...");
    const existingArticles = await storage.getArticles(1);
    if (existingArticles.length === 0) {
      console.log("📝 Creating sample articles...");
      
      const categories = await storage.getCategories();
      if (categories.length > 0) {
        const sampleArticles = [
          {
            title: "Bem-vindos ao Mani News",
            slug: "bem-vindos-ao-mani-news",
            summary: "O Mani News está no ar! Conheça nossa plataforma de notícias moderna e responsiva.",
            content: "<p>Seja bem-vindo ao <strong>Mani News</strong>, sua nova fonte de informações confiáveis e atualizadas!</p><p>Nossa plataforma foi desenvolvida para oferecer a melhor experiência em leitura de notícias, com design moderno e recursos avançados.</p><h2>O que você encontrará aqui:</h2><ul><li>Notícias em tempo real</li><li>Categorias organizadas</li><li>Interface responsiva</li><li>Recursos de compartilhamento</li></ul><p>Explore nosso conteúdo e mantenha-se sempre informado!</p>",
            featuredImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
            imageCaption: "Bem-vindos ao Mani News - Sua fonte de informações",
            categoryId: categories[0].id,
            author: "Equipe Mani News",
            published: true,
            publishedAt: new Date(),
            tags: ["bem-vindos", "lancamento", "plataforma"],
            metaDescription: "Conheça o Mani News, sua nova plataforma de notícias moderna e responsiva",
            metaKeywords: "mani news, lançamento, notícias, plataforma",
          },
          {
            title: "Como navegar pelo Mani News",
            slug: "como-navegar-pelo-mani-news",
            summary: "Aprenda a usar todas as funcionalidades da nossa plataforma de notícias.",
            content: "<p>O <strong>Mani News</strong> foi projetado para ser intuitivo e fácil de usar. Aqui está um guia rápido:</p><h2>Navegação Principal</h2><p>Use o menu superior para acessar diferentes seções:</p><ul><li><strong>Início:</strong> Últimas notícias e destaques</li><li><strong>Categorias:</strong> Notícias organizadas por tema</li><li><strong>Trending:</strong> Artigos mais populares</li><li><strong>Busca:</strong> Encontre notícias específicas</li></ul><h2>Recursos Especiais</h2><p>Aproveite nossos recursos avançados:</p><ul><li><strong>Compartilhamento:</strong> WhatsApp, Facebook e link direto</li><li><strong>PWA:</strong> Instale como app no seu dispositivo</li><li><strong>Responsivo:</strong> Funciona perfeitamente em qualquer tela</li></ul>",
            featuredImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
            imageCaption: "Interface moderna e intuitiva do Mani News",
            categoryId: categories.find(c => c.name === "Tecnologia")?.id || categories[0].id,
            author: "Equipe Mani News",
            published: true,
            publishedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
            tags: ["tutorial", "navegacao", "funcionalidades"],
            metaDescription: "Aprenda a usar todas as funcionalidades do Mani News",
            metaKeywords: "tutorial, navegação, funcionalidades, mani news",
          }
        ];

        for (const article of sampleArticles) {
          await storage.createArticle(article);
          console.log(`✅ Sample article created: ${article.title}`);
        }
      }
    }

    console.log("🎉 Database initialization completed successfully!");
    
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log("Database initialization finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database initialization failed:", error);
      process.exit(1);
    });
}

export { initializeDatabase };