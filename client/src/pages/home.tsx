import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import ArticleCard from "@/components/article-card";
import { Newspaper, Eye, Rss, Plus, Search } from "lucide-react";
import type { Article } from "@shared/schema";

export default function Home() {
  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalArticles: number;
    publishedArticles: number;
    totalViews: number;
    subscribers: number;
  }>({
    queryKey: ["/api/stats"],
  });

  if (articlesLoading || statsLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-2xl p-8 text-white animate-pulse">
          <div className="h-8 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-white/20 rounded w-2/3 mb-6"></div>
          <div className="flex gap-4">
            <div className="h-12 bg-white/20 rounded w-32"></div>
            <div className="h-12 bg-white/20 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Hệ thống Quản lý Tin tức & RSS</h1>
          <p className="text-xl opacity-90 mb-6">
            Tạo, quản lý và phân phối tin tức thông qua RSS feed một cách dễ dàng và chuyên nghiệp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/create">
              <Button className="bg-white text-brand-blue hover:bg-gray-100">
                <Plus className="w-4 h-4 mr-2" />
                Tạo bài viết mới
              </Button>
            </Link>
            <Link href="/rss">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-brand-blue">
                <Rss className="w-4 h-4 mr-2" />
                Xem RSS Feed
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Newspaper className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-brand-slate">Tổng bài viết</p>
                <p className="text-2xl font-bold text-brand-dark">{stats?.totalArticles || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-brand-blue" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-brand-slate">Tổng lượt xem</p>
                <p className="text-2xl font-bold text-brand-dark">{stats?.totalViews || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Rss className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-brand-slate">RSS Subscribers</p>
                <p className="text-2xl font-bold text-brand-dark">{stats?.subscribers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Article Listing */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-xl font-semibold text-brand-dark">Bài viết gần đây</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  className="pl-10 pr-4 py-2"
                />
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  <SelectItem value="technology">Công nghệ</SelectItem>
                  <SelectItem value="business">Kinh doanh</SelectItem>
                  <SelectItem value="sports">Thể thao</SelectItem>
                  <SelectItem value="health">Sức khỏe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {articles.length === 0 ? (
            <div className="text-center py-8">
              <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài viết nào</h3>
              <p className="text-gray-500 mb-4">Hãy tạo bài viết đầu tiên của bạn</p>
              <Link href="/create">
                <Button>Tạo bài viết mới</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.slice(0, 10).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {articles.length > 10 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-brand-slate">
                Hiển thị 1-10 trong {articles.length} bài viết
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Trước
                </Button>
                <Button variant="default" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
