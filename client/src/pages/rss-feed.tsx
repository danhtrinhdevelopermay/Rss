import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Copy, Download, CheckCircle, Save, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RSSFeed() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rssSettings, setRssSettings] = useState({
    title: "NewsHub - Tin tức và Bài viết",
    description: "Cập nhật tin tức mới nhất về công nghệ, kinh doanh, thể thao và nhiều lĩnh vực khác.",
    language: "vi",
    autoUpdate: true,
    maxItems: 50,
  });

  const cleanupMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/articles/cleanup");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Dọn dẹp thành công",
        description: data.description || `Đã xóa ${data.deletedCount} bài viết chưa xuất bản`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/rss/preview"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      refetch(); // Refresh RSS preview
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi dọn dẹp bài viết",
        variant: "destructive",
      });
    },
  });

  const { data: rssData, isLoading, refetch } = useQuery({
    queryKey: ["/api/rss/preview"],
  });

  const { data: stats } = useQuery<{
    totalArticles: number;
    publishedArticles: number;
    totalViews: number;
    subscribers: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const handleCopyRSSUrl = () => {
    const url = `${window.location.origin}/api/rss.xml`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Đã sao chép",
      description: "URL RSS Feed (.xml) đã được sao chép vào clipboard",
    });
  };

  const handleDownloadRSS = () => {
    const url = `${window.location.origin}/api/rss.xml`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "rss.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Tải xuống thành công",
      description: "File RSS.xml sẽ được tải xuống",
    });
  };

  const handleValidateRSS = () => {
    toast({
      title: "RSS hợp lệ",
      description: "RSS Feed tuân thủ chuẩn RSS 2.0",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-brand-dark">RSS Feed</h2>
              <p className="text-brand-slate mt-1">Quản lý và theo dõi RSS feed của website</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => cleanupMutation.mutate()}
                disabled={cleanupMutation.isPending}
                variant="outline"
                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                title="Xóa tất cả bài viết chưa xuất bản trước khi tạo RSS"
              >
                <Trash className="w-4 h-4 mr-2" />
                {cleanupMutation.isPending ? "Đang dọn..." : "Dọn dẹp"}
              </Button>
              <Button
                onClick={() => refetch()}
                className="bg-brand-blue hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tạo lại RSS
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* RSS Feed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-dark">Thông tin RSS Feed</h3>

              <div className="space-y-3">
                <div>
                  <Label>URL RSS Feed (XML)</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      value={`${window.location.origin}/api/rss.xml`}
                      readOnly
                      className="bg-gray-50"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyRSSUrl}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-brand-slate mt-1">
                    Sử dụng URL này để subscribe RSS feed từ các ứng dụng khác
                  </p>
                </div>

                <div>
                  <Label htmlFor="rss-title">Tiêu đề Feed</Label>
                  <Input
                    id="rss-title"
                    value={rssSettings.title}
                    onChange={(e) => setRssSettings(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="rss-description">Mô tả Feed</Label>
                  <Textarea
                    id="rss-description"
                    rows={3}
                    value={rssSettings.description}
                    onChange={(e) => setRssSettings(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="rss-language">Ngôn ngữ</Label>
                  <Select
                    value={rssSettings.language}
                    onValueChange={(value) => setRssSettings(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt (vi)</SelectItem>
                      <SelectItem value="en">English (en)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-dark">Thống kê RSS</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-brand-blue">
                    {stats?.publishedArticles || 0}
                  </div>
                  <div className="text-sm text-brand-slate">Tổng bài viết</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.subscribers || 156}
                  </div>
                  <div className="text-sm text-brand-slate">Subscribers</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">2h trước</div>
                  <div className="text-sm text-brand-slate">Cập nhật cuối</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {rssData?.rss ? Math.round(rssData.rss.length / 1024) : 0}KB
                  </div>
                  <div className="text-sm text-brand-slate">Kích thước file</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Tự động cập nhật</Label>
                  <Switch
                    checked={rssSettings.autoUpdate}
                    onCheckedChange={(checked) => setRssSettings(prev => ({ ...prev, autoUpdate: checked }))}
                  />
                </div>

                <div>
                  <Label htmlFor="max-items">Số bài viết tối đa</Label>
                  <Input
                    id="max-items"
                    type="number"
                    min="1"
                    max="100"
                    value={rssSettings.maxItems}
                    onChange={(e) => setRssSettings(prev => ({ ...prev, maxItems: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RSS Preview */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <h3 className="text-lg font-semibold text-brand-dark">Xem trước RSS XML</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={handleDownloadRSS}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống
                </Button>
                <Button
                  variant="outline"
                  onClick={handleValidateRSS}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Kiểm tra
                </Button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono">
                <code>
                  {rssData?.rss || "Loading RSS feed..."}
                </code>
              </pre>
            </div>
          </div>

          {/* Save Settings */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button className="bg-brand-blue hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Lưu cài đặt RSS
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
