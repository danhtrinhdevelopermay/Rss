import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, User, Edit } from "lucide-react";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
  showActions?: boolean;
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "technology":
    case "công nghệ":
      return "bg-blue-100 text-blue-800";
    case "business":
    case "kinh doanh":
      return "bg-green-100 text-green-800";
    case "sports":
    case "thể thao":
      return "bg-red-100 text-red-800";
    case "health":
    case "sức khỏe":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "published":
      return "Đã xuất bản";
    case "draft":
      return "Bản nháp";
    case "scheduled":
      return "Lên lịch";
    default:
      return status;
  }
};

export default function ArticleCard({ article, showActions = false }: ArticleCardProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="hover:bg-gray-50 transition-colors duration-200">
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {article.imageUrl && (
          <div className="lg:w-1/4 flex-shrink-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-48 lg:h-32 object-cover rounded-lg"
            />
          </div>
        )}
        <div className={article.imageUrl ? "lg:w-3/4" : "w-full"}>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getCategoryColor(article.category)}>
              {article.category}
            </Badge>
            {showActions && (
              <Badge className={getStatusColor(article.status)}>
                {getStatusLabel(article.status)}
              </Badge>
            )}
            <span className="text-brand-slate text-sm">
              {formatDate(article.publishDate || article.createdAt || new Date())}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-brand-dark mb-2 hover:text-brand-blue cursor-pointer transition-colors duration-200">
            {article.title}
          </h3>
          <p className="text-brand-slate mb-4 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm text-brand-slate">{article.author}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-brand-slate">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {article.views || 0}
              </span>
              {showActions && (
                <Button variant="ghost" size="sm" className="text-brand-blue hover:text-blue-700">
                  <Edit className="w-4 h-4 mr-1" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
