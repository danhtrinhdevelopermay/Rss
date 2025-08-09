import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Save, Eye, X } from "lucide-react";
import type { InsertArticle } from "@shared/schema";
import { ImageUpload } from "@/components/image-upload";

export default function CreateArticle() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<InsertArticle>({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    category: "",
    status: "draft",
    tags: [],
    imageUrl: "",
    publishDate: undefined,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      const response = await apiRequest("POST", "/api/articles", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create article");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Bài viết đã được tạo thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setLocation("/");
    },
    onError: (error: any) => {
      console.error("Create article error:", error);
      toast({
        title: "Lỗi",
        description: error?.message || "Có lỗi xảy ra khi tạo bài viết",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.excerpt || !formData.author || !formData.category) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    // Parse tags from comma-separated string
    const tagsArray = formData.tags && Array.isArray(formData.tags) 
      ? formData.tags 
      : typeof formData.tags === 'string' 
        ? formData.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
        : [];

    const dataToSubmit = {
      ...formData,
      tags: tagsArray,
      publishDate: formData.publishDate || undefined,
    };

    console.log("Submitting data:", dataToSubmit);
    createMutation.mutate(dataToSubmit);
  };

  const handleInputChange = (field: keyof InsertArticle, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-brand-dark">Tạo bài viết mới</h2>
          <p className="text-brand-slate mt-1">Điền thông tin bài viết và nội dung để xuất bản</p>
        </div>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <Label htmlFor="title">Tiêu đề bài viết *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Danh mục *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Công nghệ">Công nghệ</SelectItem>
                    <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                    <SelectItem value="Thể thao">Thể thao</SelectItem>
                    <SelectItem value="Sức khỏe">Sức khỏe</SelectItem>
                    <SelectItem value="Giáo dục">Giáo dục</SelectItem>
                    <SelectItem value="Giải trí">Giải trí</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="author">Tác giả *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Tên tác giả"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="excerpt">Tóm tắt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                  rows={3}
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <ImageUpload
                  value={formData.imageUrl || ""}
                  onChange={(url) => handleInputChange("imageUrl", url)}
                  label="Ảnh đại diện bài viết"
                />
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="content">Nội dung bài viết *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Viết nội dung bài viết tại đây..."
                  rows={12}
                  required
                />
                <p className="mt-2 text-sm text-brand-slate">Hỗ trợ Markdown và HTML cơ bản</p>
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="Nhập tags, cách nhau bằng dấu phẩy (vd: công nghệ, AI, machine learning)"
                />
              </div>

              <div>
                <Label htmlFor="publishDate">Ngày xuất bản</Label>
                <Input
                  id="publishDate"
                  type="datetime-local"
                  value={formData.publishDate ? new Date(formData.publishDate).toISOString().slice(0, 16) : ""}
                  onChange={(e) => handleInputChange("publishDate", e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>

              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="published">Xuất bản</SelectItem>
                    <SelectItem value="scheduled">Lên lịch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                className="bg-brand-blue hover:bg-blue-700"
                disabled={createMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {createMutation.isPending ? "Đang lưu..." : "Lưu bài viết"}
              </Button>
              <Button type="button" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Xem trước
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setLocation("/")}
              >
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
