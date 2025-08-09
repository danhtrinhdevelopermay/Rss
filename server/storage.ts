import { type User, type InsertUser, type Article, type InsertArticle } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Article methods
  getArticles(): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, updates: Partial<Article>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  getPublishedArticles(): Promise<Article[]>;
  incrementViews(id: string): Promise<void>;
  cleanupUnpublishedArticles(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private articles: Map<string, Article>;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    
    // Add sample articles for testing
    this.seedSampleData();
  }

  private seedSampleData() {
    const sampleArticles = [
      {
        id: "1",
        title: "Công nghệ AI mới nhất trong năm 2024",
        content: "Trí tuệ nhân tạo đang phát triển với tốc độ chóng mặt. Các công nghệ AI mới như ChatGPT, Gemini và Claude đã thay đổi cách chúng ta làm việc và học tập. Bài viết này sẽ khám phá những xu hướng AI hàng đầu trong năm 2024 và tác động của chúng đến cuộc sống hàng ngày.",
        excerpt: "Khám phá những xu hướng AI hàng đầu và tác động của chúng đến cuộc sống trong năm 2024",
        author: "Nguyễn Văn A",
        category: "Công nghệ",
        status: "published" as const,
        tags: ["AI", "Machine Learning", "Technology"],
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        views: 145,
        publishDate: new Date("2024-01-15"),
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2", 
        title: "Xu hướng kinh doanh digital 2024",
        content: "Kinh doanh số đang trở thành xu hướng chủ đạo. Các doanh nghiệp cần chuyển đổi số để cạnh tranh hiệu quả. Từ e-commerce đến marketing digital, mọi khía cạnh của kinh doanh đều cần được số hóa để thích ứng với thời đại mới.",
        excerpt: "Tìm hiểu về chuyển đổi số và các xu hướng kinh doanh digital quan trọng năm 2024",
        author: "Trần Thị B",
        category: "Kinh doanh", 
        status: "published" as const,
        tags: ["Digital Business", "E-commerce", "Digital Marketing"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        views: 89,
        publishDate: new Date("2024-01-10"),
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
      },
      {
        id: "3",
        title: "Thể thao Việt Nam tại SEA Games 2024",
        content: "Đoàn thể thao Việt Nam đã có những thành tích ấn tượng tại SEA Games 2024. Với tinh thần thi đấu cao và sự chuẩn bị kỹ lưỡng, các vận động viên Việt Nam đã mang về nhiều huy chương quý giá cho nước nhà.",
        excerpt: "Điểm lại những thành tích nổi bật của thể thao Việt Nam tại SEA Games 2024",
        author: "Lê Văn C",
        category: "Thể thao",
        status: "published" as const,
        tags: ["SEA Games", "Vietnam Sports", "Athletics"],
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
        views: 234,
        publishDate: new Date("2024-01-08"),
        createdAt: new Date("2024-01-08"),
        updatedAt: new Date("2024-01-08"),
      }
    ];

    sampleArticles.forEach(article => {
      this.articles.set(article.id, article);
    });
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

  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const now = new Date();
    const article: Article = {
      ...insertArticle,
      id,
      views: 0,
      createdAt: now,
      updatedAt: now,
      publishDate: insertArticle.publishDate || now,
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle: Article = {
      ...article,
      ...updates,
      updatedAt: new Date(),
    };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  async getPublishedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.status === "published")
      .sort((a, b) => new Date(b.publishDate!).getTime() - new Date(a.publishDate!).getTime());
  }

  async incrementViews(id: string): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.articles.set(id, article);
    }
  }

  async cleanupUnpublishedArticles(): Promise<number> {
    const articlesToDelete = Array.from(this.articles.values())
      .filter(article => article.status !== "published");
    
    articlesToDelete.forEach(article => {
      this.articles.delete(article.id);
    });

    return articlesToDelete.length;
  }
}

export const storage = new MemStorage();
