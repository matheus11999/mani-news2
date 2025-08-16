import { type User, type InsertUser, type Article, type InsertArticle, type Category, type InsertCategory, type ArticleWithCategory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  getArticles(limit?: number, offset?: number): Promise<ArticleWithCategory[]>;
  getArticleById(id: string): Promise<ArticleWithCategory | undefined>;
  getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined>;
  getArticlesByCategory(categoryId: string, limit?: number): Promise<ArticleWithCategory[]>;
  searchArticles(query: string, limit?: number): Promise<ArticleWithCategory[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticleViews(id: string): Promise<void>;
  getMostViewedArticles(limit?: number): Promise<ArticleWithCategory[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private articles: Map<string, Article>;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.articles = new Map();
    
    // Initialize with sample categories
    this.initializeCategories();
    this.initializeArticles();
  }

  private initializeCategories() {
    const categories: Category[] = [
      { id: "1", name: "Política", slug: "politica", color: "#e50914" },
      { id: "2", name: "Economia", slug: "economia", color: "#3b82f6" },
      { id: "3", name: "Esportes", slug: "esportes", color: "#10b981" },
      { id: "4", name: "Tecnologia", slug: "tecnologia", color: "#8b5cf6" },
      { id: "5", name: "Ambiente", slug: "ambiente", color: "#059669" },
      { id: "6", name: "Educação", slug: "educacao", color: "#f59e0b" },
    ];
    
    categories.forEach(category => this.categories.set(category.id, category));
  }

  private initializeArticles() {
    const articles: Article[] = [
      {
        id: "1",
        title: "Congresso Nacional aprova nova legislação sobre tecnologia digital",
        subtitle: "A nova lei estabelece diretrizes importantes para o uso responsável da tecnologia digital no país",
        slug: "congresso-aprova-legislacao-tecnologia-digital",
        summary: "A nova lei estabelece diretrizes importantes para o uso responsável da tecnologia digital no país, impactando empresas e usuários...",
        content: "<p>A nova legislação sobre tecnologia digital foi aprovada por ampla maioria no Congresso Nacional, marcando um momento histórico para a regulamentação do setor tecnológico no país.</p><h2>Principais pontos da nova legislação</h2><p>Entre os principais aspectos da nova lei, destacam-se: fortalecimento da proteção de dados pessoais, regulamentação das plataformas digitais, criação de mecanismos de segurança cibernética e estabelecimento de direitos digitais fundamentais.</p>",
        featuredImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        imageCaption: "Sessão extraordinária do Congresso Nacional para votação da nova legislação digital",
        categoryId: "1",
        author: "Maria Silva",
        views: 1234,
        published: true,
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ["congresso", "tecnologia", "legislacao", "digital"],
        metaDescription: "Congresso Nacional aprova nova legislação sobre tecnologia digital estabelecendo diretrizes para uso responsável",
        metaKeywords: "congresso, tecnologia, legislação, digital, política",
      },
      {
        id: "2",
        title: "Mercado financeiro registra alta histórica no primeiro trimestre",
        subtitle: "Os principais índices da bolsa de valores atingiram recordes históricos",
        slug: "mercado-financeiro-alta-historica-primeiro-trimestre",
        summary: "Os principais índices da bolsa de valores atingiram recordes históricos, refletindo o otimismo dos investidores...",
        content: "<p>O mercado financeiro brasileiro encerrou o primeiro trimestre com resultados excepcionais, registrando a maior alta histórica em seus principais índices.</p>",
        featuredImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        imageCaption: "Análise do mercado financeiro mostra crescimento histórico",
        categoryId: "2",
        author: "João Santos",
        views: 892,
        published: true,
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ["economia", "mercado", "bolsa", "investimentos"],
        metaDescription: "Mercado financeiro brasileiro registra alta histórica no primeiro trimestre de 2024",
        metaKeywords: "economia, mercado financeiro, bolsa, investimentos",
      },
      {
        id: "3",
        title: "Campeonato nacional define semifinalistas em partidas emocionantes",
        subtitle: "As quartas de final foram marcadas por jogos disputados e resultados surpreendentes",
        slug: "campeonato-nacional-semifinalistas-partidas-emocionantes",
        summary: "As quartas de final do campeonato nacional foram marcadas por jogos disputados e resultados surpreendentes...",
        content: "<p>O campeonato nacional de futebol viveu uma das rodadas mais emocionantes de sua história nas quartas de final.</p>",
        featuredImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        imageCaption: "Jogadores celebram classificação às semifinais",
        categoryId: "3",
        author: "Carlos Ferreira",
        views: 2156,
        published: true,
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ["futebol", "campeonato", "esportes", "semifinal"],
        metaDescription: "Campeonato nacional define semifinalistas em quartas de final emocionantes",
        metaKeywords: "futebol, campeonato, esportes, semifinal",
      },
    ];
    
    articles.forEach(article => this.articles.set(article.id, article));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async getArticles(limit = 20, offset = 0): Promise<ArticleWithCategory[]> {
    const articles = Array.from(this.articles.values())
      .filter(article => article.published)
      .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
      .slice(offset, offset + limit);
    
    return articles.map(article => ({
      ...article,
      category: this.categories.get(article.categoryId)!
    }));
  }

  async getArticleById(id: string): Promise<ArticleWithCategory | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    return {
      ...article,
      category: this.categories.get(article.categoryId)!
    };
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined> {
    const article = Array.from(this.articles.values()).find(a => a.slug === slug);
    if (!article) return undefined;
    
    return {
      ...article,
      category: this.categories.get(article.categoryId)!
    };
  }

  async getArticlesByCategory(categoryId: string, limit = 10): Promise<ArticleWithCategory[]> {
    const articles = Array.from(this.articles.values())
      .filter(article => article.published && article.categoryId === categoryId)
      .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
      .slice(0, limit);
    
    return articles.map(article => ({
      ...article,
      category: this.categories.get(article.categoryId)!
    }));
  }

  async searchArticles(query: string, limit = 10): Promise<ArticleWithCategory[]> {
    const searchTerm = query.toLowerCase();
    const articles = Array.from(this.articles.values())
      .filter(article => 
        article.published && 
        (article.title.toLowerCase().includes(searchTerm) ||
         article.summary.toLowerCase().includes(searchTerm) ||
         article.content.toLowerCase().includes(searchTerm) ||
         article.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      )
      .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
      .slice(0, limit);
    
    return articles.map(article => ({
      ...article,
      category: this.categories.get(article.categoryId)!
    }));
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const newArticle: Article = { 
      ...article, 
      id,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.articles.set(id, newArticle);
    return newArticle;
  }

  async updateArticleViews(id: string): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.articles.set(id, article);
    }
  }

  async getMostViewedArticles(limit = 5): Promise<ArticleWithCategory[]> {
    const articles = Array.from(this.articles.values())
      .filter(article => article.published)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
    
    return articles.map(article => ({
      ...article,
      category: this.categories.get(article.categoryId)!
    }));
  }
}

export const storage = new MemStorage();
