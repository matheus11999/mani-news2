import type { Express } from "express";
import { storage } from "./storage";
import { authenticateToken, requireAdmin, loginUser, type AuthRequest } from "./auth";
import { insertUserSchema, insertCategorySchema, insertArticleSchema, insertSiteConfigSchema } from "@shared/schema";
import { z } from "zod";
// Simple file upload handling without multer for now
// In production, you should use a proper file upload service

export function registerAdminRoutes(app: Express) {
  // Auth routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const result = await loginUser(username, password);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(401).json({ message: result.message });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create admin user (first user is admin)
      const users = await storage.getUser("any"); // This will check if any users exist
      const role = users ? "user" : "admin";

      const user = await storage.createUser({
        ...userData,
        role,
      });

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Protected routes - require authentication
  app.use("/api/admin", authenticateToken);

  // User management (admin only)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      // TODO: Implement getUsers method in storage
      res.json([]);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Categories management
  app.get("/api/admin/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/admin/categories", requireAdmin, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, categoryData);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(400).json({ message: "Failed to delete category. It may have associated articles." });
      }
      
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Articles management
  app.get("/api/admin/articles", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const published = req.query.published as string;
      
      // TODO: Add filter for published/unpublished articles
      const articles = await storage.getArticles(limit, offset);
      res.json(articles);
    } catch (error) {
      console.error("Error getting articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.post("/api/admin/articles", requireAdmin, async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const articleData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, articleData);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteArticle(id);
      
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Site configuration
  app.get("/api/admin/site-config", async (req, res) => {
    try {
      const config = await storage.getSiteConfig();
      res.json(config || {});
    } catch (error) {
      console.error("Error getting site config:", error);
      res.status(500).json({ message: "Failed to fetch site configuration" });
    }
  });

  app.put("/api/admin/site-config", requireAdmin, async (req, res) => {
    try {
      const configData = insertSiteConfigSchema.parse(req.body);
      const config = await storage.updateSiteConfig(configData);
      res.json(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error updating site config:", error);
      res.status(500).json({ message: "Failed to update site configuration" });
    }
  });

  // File upload (placeholder for now)
  app.post("/api/admin/upload", requireAdmin, async (req, res) => {
    try {
      // For now, return a placeholder response
      // In production, implement proper file upload with a service like AWS S3
      res.json({
        url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        filename: "placeholder.jpg",
        originalName: "placeholder.jpg",
        size: 1024,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // Dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      // TODO: Implement dashboard statistics
      const stats = {
        totalArticles: 0,
        totalCategories: 0,
        totalViews: 0,
        recentArticles: [],
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
}