import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  label?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  onClear,
  label = "Ảnh bài viết",
  placeholder = "Chọn ảnh hoặc nhập URL ảnh"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file ảnh hợp lệ",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onChange(data.imageUrl);
        toast({
          title: "Thành công",
          description: "Ảnh đã được tải lên thành công",
        });
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Lỗi upload",
        description: error.message || "Có lỗi xảy ra khi tải ảnh lên",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
      toast({
        title: "Thành công",
        description: "URL ảnh đã được thêm",
      });
    }
  };

  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
    setUrlInput("");
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image">{label}</Label>
      
      {value ? (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img 
                src={value} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg"
                onError={() => {
                  toast({
                    title: "Lỗi",
                    description: "Không thể tải ảnh từ URL này",
                    variant: "destructive",
                  });
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleClear}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2 break-all">{value}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* File Upload Button */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Tải ảnh lên
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowUrlInput(!showUrlInput)}
              disabled={isUploading}
            >
              <Image className="w-4 h-4 mr-2" />
              URL
            </Button>
          </div>

          {/* URL Input */}
          {showUrlInput && (
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Nhập URL ảnh..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
              />
              <Button type="button" onClick={handleUrlSubmit} size="sm">
                Thêm
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setShowUrlInput(false)}
              >
                Hủy
              </Button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <p className="text-sm text-gray-500 text-center">
            Chọn ảnh từ máy tính (tối đa 5MB) hoặc nhập URL ảnh
          </p>
        </div>
      )}
    </div>
  );
}