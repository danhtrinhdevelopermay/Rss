import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bold, Italic, Underline, Link, Image, List, ListOrdered } from "lucide-react";
import type { InsertArticle } from "@shared/schema";

interface ArticleFormProps {
  initialData?: Partial<InsertArticle>;
  onSubmit: (data: InsertArticle) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ArticleForm({ initialData, onSubmit, onCancel, isSubmitting = false }: ArticleFormProps) {
  const [formData, setFormData] = useState<InsertArticle>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    author: initialData?.author || "",
    category: initialData?.category || "",
    status: initialData?.status || "draft",
    tags: initialData?.tags || [],
    imageUrl: initialData?.imageUrl || "",
    publishDate: initialData?.publishDate || new Date(),
  });

  const handleInputChange = (field: keyof InsertArticle, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse tags from comma-separated string
    const tagsArray = formData.tags && Array.isArray(formData.tags) 
      ? formData.tags 
      : typeof formData.tags === 'string' 
        ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
        : [];

    onSubmit({
      ...formData,
      tags: tagsArray,
    });
  };

  return (
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
          <Label htmlFor="imageUrl">URL ảnh đại diện</Label>
          <Input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange("imageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="content">Nội dung bài viết *</Label>
          {/* Rich Text Editor Toolbar */}
          <div className="border border-gray-300 rounded-t-lg bg-gray-50 px-4 py-2 flex items-center space-x-2 text-sm">
            <Button type="button" variant="ghost" size="sm" title="Bold">
              <Bold className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" title="Italic">
              <Italic className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" title="Underline">
              <Underline className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button type="button" variant="ghost" size="sm" title="Link">
              <Link className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" title="Image">
              <Image className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button type="button" variant="ghost" size="sm" title="Bulleted List">
              <List className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" title="Numbered List">
              <ListOrdered className="w-4 h-4" />
            </Button>
          </div>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="Viết nội dung bài viết tại đây..."
            rows={12}
            className="rounded-t-none border-t-0"
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
            onChange={(e) => handleInputChange("publishDate", new Date(e.target.value))}
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu bài viết"}
        </Button>
        <Button type="button" variant="outline">
          Xem trước
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Hủy
        </Button>
      </div>
    </form>
  );
}
