import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import FormData from "form-data";
import fetch from "node-fetch";

function generateRSSFeed(articles: any[]) {
  const now = new Date().toUTCString();
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";
  
  const rssItems = articles.map((article, index) => {
    // Tạo description với ảnh như VnExpress
    let description = article.excerpt;
    if (article.imageUrl) {
      // Tạo ảnh với kích thước đa dạng như VnExpress
      const imageVariations = [
        'width="600" height="400"',
        'width="500" height="300"', 
        'width="700" height="350"',
        'width="550" height="450"',
        'width="650" height="300"'
      ];
      const randomSize = imageVariations[index % imageVariations.length];
      
      description = `<img src="${article.imageUrl}" ${randomSize} style="max-width: 100%; height: auto; margin-bottom: 10px; object-fit: cover;" /><br/>${article.excerpt}`;
    }
    
    return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${baseUrl}/articles/${article.id}</link>
      <guid>${baseUrl}/articles/${article.id}</guid>
      <pubDate>${new Date(article.publishDate).toUTCString()}</pubDate>
      <author>${article.author}</author>
      <category>${article.category}</category>
      ${article.imageUrl ? `<enclosure url="${article.imageUrl}" type="image/jpeg" />` : ''}
    </item>
  `;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>NewsHub - Tin tức và Bài viết</title>
    <description>Cập nhật tin tức mới nhất về công nghệ, kinh doanh, thể thao và nhiều lĩnh vực khác.</description>
    <link>${baseUrl}</link>
    <language>vi</language>
    <copyright>Copyright NewsHub ${new Date().getFullYear()}</copyright>
    <managingEditor>admin@newshub.com (NewsHub Editorial)</managingEditor>
    <webMaster>admin@newshub.com (NewsHub Technical)</webMaster>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>NewsHub</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link href="${baseUrl}/api/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload image to ImgBB
async function uploadToImgBB(buffer: Buffer, filename: string): Promise<string> {
  const apiKey = "4eba6dee0c818bea2a9414aeac5be877";
  
  const form = new FormData();
  form.append('image', buffer, filename);
  form.append('key', apiKey);

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: form
  });

  const data = await response.json() as any;
  
  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || 'Failed to upload image');
  }

  return data.data.url;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload image endpoint
  app.post("/api/upload-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const imageUrl = await uploadToImgBB(req.file.buffer, req.file.originalname);
      
      res.json({ 
        success: true, 
        imageUrl,
        message: "Image uploaded successfully"
      });
    } catch (error: any) {
      console.error("Image upload error:", error);
      res.status(500).json({ 
        error: "Failed to upload image",
        message: error.message 
      });
    }
  });

  // Get all articles
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  // Get single article
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment views
      await storage.incrementViews(req.params.id);
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  // Create article
  app.post("/api/articles", async (req, res) => {
    try {
      console.log("Request body:", req.body);
      const validatedData = insertArticleSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Article creation error:", error);
      res.status(500).json({ message: "Error creating article" });
    }
  });

  // Update article
  app.put("/api/articles/:id", async (req, res) => {
    try {
      const updates = req.body;
      const article = await storage.updateArticle(req.params.id, updates);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error updating article" });
    }
  });

  // Delete article
  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const success = await storage.deleteArticle(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting article" });
    }
  });

  // Get published articles
  app.get("/api/articles/published", async (req, res) => {
    try {
      const articles = await storage.getPublishedArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching published articles" });
    }
  });

  // Get RSS feed as XML file
  app.get("/api/rss", async (req, res) => {
    try {
      const articles = await storage.getPublishedArticles();
      const rss = generateRSSFeed(articles.slice(0, 50)); // Limit to 50 most recent
      res.set('Content-Type', 'application/rss+xml; charset=utf-8');
      res.set('Content-Disposition', 'inline; filename="rss.xml"');
      res.send(rss);
    } catch (error) {
      res.status(500).json({ message: "Error generating RSS feed" });
    }
  });

  // Get RSS feed as downloadable file
  app.get("/api/rss.xml", async (req, res) => {
    try {
      const articles = await storage.getPublishedArticles();
      const rss = generateRSSFeed(articles.slice(0, 50)); // Limit to 50 most recent
      res.set('Content-Type', 'application/rss+xml; charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="rss.xml"');
      res.send(rss);
    } catch (error) {
      res.status(500).json({ message: "Error generating RSS feed" });
    }
  });

  // Get RSS feed as JSON for preview
  app.get("/api/rss/preview", async (req, res) => {
    try {
      const articles = await storage.getPublishedArticles();
      const rss = generateRSSFeed(articles.slice(0, 50));
      res.json({ rss, articleCount: articles.length });
    } catch (error) {
      res.status(500).json({ message: "Error generating RSS preview" });
    }
  });

  // Cleanup unpublished articles
  app.post("/api/articles/cleanup", async (req, res) => {
    try {
      const deletedCount = await storage.cleanupUnpublishedArticles();
      res.json({ 
        message: "Cleanup completed", 
        deletedCount,
        description: `Đã xóa ${deletedCount} bài viết chưa xuất bản khỏi hệ thống`
      });
    } catch (error) {
      res.status(500).json({ message: "Error during cleanup" });
    }
  });

  // Get statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      const publishedArticles = articles.filter(a => a.status === "published");
      const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
      
      res.json({
        totalArticles: articles.length,
        publishedArticles: publishedArticles.length,
        totalViews,
        subscribers: 156 // Static value for MVP
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
