import { 
  type User, 
  type InsertUser, 
  type Article, 
  type InsertArticle, 
  type Category, 
  type InsertCategory, 
  type ArticleWithCategory,
  type SiteConfig,
  type InsertSiteConfig,
  users,
  categories,
  articles,
  siteConfig
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, ilike, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  // Articles
  getArticles(limit?: number, offset?: number): Promise<ArticleWithCategory[]>;
  getArticleById(id: string): Promise<ArticleWithCategory | undefined>;
  getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined>;
  getArticlesByCategory(categoryId: string, limit?: number): Promise<ArticleWithCategory[]>;
  searchArticles(query: string, limit?: number): Promise<ArticleWithCategory[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  updateArticleViews(id: string): Promise<void>;
  getMostViewedArticles(limit?: number): Promise<ArticleWithCategory[]>;
  
  // Site Config
  getSiteConfig(): Promise<SiteConfig | undefined>;
  updateSiteConfig(config: Partial<InsertSiteConfig>): Promise<SiteConfig>;
  
  // Auth helpers
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
}

export class PostgresStorage implements IStorage {
  constructor() {
    // Initialize default data if needed
    this.initializeDefaults();
  }

  private async initializeDefaults() {
    try {
      // Check if site config exists, if not create default
      const config = await this.getSiteConfig();
      if (!config) {
        await this.updateSiteConfig({});
      }
    } catch (error) {
      console.error('Error initializing defaults:', error);
    }
  }

  // Auth helpers
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const hashedPassword = await this.hashPassword(user.password);
      const result = await db.insert(users).values({
        ...user,
        password: hashedPassword,
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const updateData = { ...user };
      if (updateData.password) {
        updateData.password = await this.hashPassword(updateData.password);
      }
      updateData.updatedAt = new Date();
      
      const result = await db.update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      return await db.select().from(categories).orderBy(categories.name);
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    try {
      const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting category by id:', error);
      return undefined;
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
      const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting category by slug:', error);
      return undefined;
    }
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    try {
      const result = await db.insert(categories).values(category).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    try {
      const result = await db.update(categories)
        .set(category)
        .where(eq(categories.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating category:', error);
      return undefined;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      // Check if there are articles using this category
      const articlesWithCategory = await db.select({ id: articles.id })
        .from(articles)
        .where(eq(articles.categoryId, id))
        .limit(1);
      
      if (articlesWithCategory.length > 0) {
        throw new Error('Cannot delete category that has articles');
      }
      
      await db.delete(categories).where(eq(categories.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  // Articles
  async getArticles(limit = 20, offset = 0): Promise<ArticleWithCategory[]> {
    try {
      const result = await db.select()
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(eq(articles.published, true))
        .orderBy(desc(articles.publishedAt))
        .limit(limit)
        .offset(offset);

      return result.map(row => ({
        ...row.articles,
        category: row.categories!
      }));
    } catch (error) {
      console.error('Error getting articles:', error);
      return [];
    }
  }

  async getArticleById(id: string): Promise<ArticleWithCategory | undefined> {
    try {
      const result = await db.select()
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(eq(articles.id, id))
        .limit(1);

      if (result.length === 0) return undefined;
      
      return {
        ...result[0].articles,
        category: result[0].categories!
      };
    } catch (error) {
      console.error('Error getting article by id:', error);
      return undefined;
    }
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined> {
    try {
      const result = await db.select()
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(eq(articles.slug, slug))
        .limit(1);

      if (result.length === 0) return undefined;
      
      return {
        ...result[0].articles,
        category: result[0].categories!
      };
    } catch (error) {
      console.error('Error getting article by slug:', error);
      return undefined;
    }
  }

  async getArticlesByCategory(categoryId: string, limit = 10): Promise<ArticleWithCategory[]> {
    try {
      const result = await db.select()
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(and(eq(articles.categoryId, categoryId), eq(articles.published, true)))
        .orderBy(desc(articles.publishedAt))
        .limit(limit);

      return result.map(row => ({
        ...row.articles,
        category: row.categories!
      }));
    } catch (error) {
      console.error('Error getting articles by category:', error);
      return [];
    }
  }

  async searchArticles(query: string, limit = 10): Promise<ArticleWithCategory[]> {
    try {
      const result = await db.select()
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(and(
          eq(articles.published, true),
          sql`(${articles.title} ILIKE ${'%' + query + '%'} OR ${articles.summary} ILIKE ${'%' + query + '%'} OR ${articles.content} ILIKE ${'%' + query + '%'})`
        ))
        .orderBy(desc(articles.publishedAt))
        .limit(limit);

      return result.map(row => ({
        ...row.articles,
        category: row.categories!
      }));
    } catch (error) {
      console.error('Error searching articles:', error);
      return [];
    }
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    try {
      const result = await db.insert(articles).values(article).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  async updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined> {
    try {
      const updateData = { ...article };
      updateData.updatedAt = new Date();
      
      const result = await db.update(articles)
        .set(updateData)
        .where(eq(articles.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating article:', error);
      return undefined;
    }
  }

  async deleteArticle(id: string): Promise<boolean> {
    try {
      await db.delete(articles).where(eq(articles.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  }

  async updateArticleViews(id: string): Promise<void> {
    try {
      await db.update(articles)
        .set({ views: sql`${articles.views} + 1` })
        .where(eq(articles.id, id));
    } catch (error) {
      console.error('Error updating article views:', error);
    }
  }

  async getMostViewedArticles(limit = 5): Promise<ArticleWithCategory[]> {
    try {
      const result = await db.select()
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(eq(articles.published, true))
        .orderBy(desc(articles.views))
        .limit(limit);

      return result.map(row => ({
        ...row.articles,
        category: row.categories!
      }));
    } catch (error) {
      console.error('Error getting most viewed articles:', error);
      return [];
    }
  }

  // Site Config
  async getSiteConfig(): Promise<SiteConfig | undefined> {
    try {
      const result = await db.select().from(siteConfig).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting site config:', error);
      return undefined;
    }
  }

  async updateSiteConfig(config: Partial<InsertSiteConfig>): Promise<SiteConfig> {
    try {
      // Try to update first
      const existing = await this.getSiteConfig();
      
      if (existing) {
        const updateData = { ...config };
        updateData.updatedAt = new Date();
        
        const result = await db.update(siteConfig)
          .set(updateData)
          .returning();
        return result[0];
      } else {
        // Create new if doesn't exist
        const result = await db.insert(siteConfig)
          .values(config)
          .returning();
        return result[0];
      }
    } catch (error) {
      console.error('Error updating site config:', error);
      throw error;
    }
  }
}

export const storage = new PostgresStorage();
