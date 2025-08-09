import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Underline, Link, Image, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function RichTextEditor({ value, onChange, placeholder, rows = 12 }: RichTextEditorProps) {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  const insertText = (before: string, after: string = "") => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      if (textareaRef) {
        const newPosition = start + before.length + selectedText.length;
        textareaRef.setSelectionRange(newPosition, newPosition);
        textareaRef.focus();
      }
    }, 0);
  };

  const handleBold = () => insertText("**", "**");
  const handleItalic = () => insertText("*", "*");
  const handleUnderline = () => insertText("<u>", "</u>");
  const handleLink = () => insertText("[", "](url)");
  const handleImage = () => insertText("![", "](image-url)");
  const handleBulletList = () => insertText("\n- ");
  const handleNumberedList = () => insertText("\n1. ");

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="border border-gray-300 rounded-t-lg bg-gray-50 px-4 py-2 flex items-center space-x-2 text-sm">
        <Button type="button" variant="ghost" size="sm" onClick={handleBold} title="Bold">
          <Bold className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleItalic} title="Italic">
          <Italic className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleUnderline} title="Underline">
          <Underline className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300"></div>
        <Button type="button" variant="ghost" size="sm" onClick={handleLink} title="Link">
          <Link className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleImage} title="Image">
          <Image className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300"></div>
        <Button type="button" variant="ghost" size="sm" onClick={handleBulletList} title="Bulleted List">
          <List className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleNumberedList} title="Numbered List">
          <ListOrdered className="w-4 h-4" />
        </Button>
      </div>

      {/* Text Area */}
      <Textarea
        ref={setTextareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="rounded-t-none border-t-0"
      />
      
      <p className="text-sm text-brand-slate">Hỗ trợ Markdown và HTML cơ bản</p>
    </div>
  );
}
