"use client"

import { useState } from "react"
import { BlockType } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { BlockContent } from "@/lib/cms/schemas"

interface BlockEditorProps {
  initialData?: {
    id?: string
    type: BlockType
    content: BlockContent
  }
  sectionId: string
  onSave: (data: { type: BlockType; content: BlockContent }) => Promise<void>
  onCancel: () => void
}

const blockTypeOptions = [
  { value: BlockType.TEXT, label: "Text" },
  { value: BlockType.IMAGE, label: "Image" },
  { value: BlockType.LINK, label: "Link" },
  { value: BlockType.QUOTE, label: "Quote" },
  { value: BlockType.CODE, label: "Code" },
  { value: BlockType.DIVIDER, label: "Divider" },
  { value: BlockType.KPI, label: "KPI" },
  { value: BlockType.CHART, label: "Chart" },
  { value: BlockType.NEWS_CARD, label: "News Card" },
  { value: BlockType.MARKET_NEWS, label: "Market News" },
  { value: BlockType.EXPERT_GRID, label: "Expert Grid" },
]

interface ContentState {
  body?: string
  url?: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  title?: string
  description?: string
  image?: string
  text?: string
  author?: string
  source?: string
  language?: string
  code?: string
  style?: string
  // New fields
  label?: string
  value?: string
  trend?: string
  trendDirection?: string
  chartType?: string
  category?: string
  jsonContent?: string // For complex types
}

export function BlockEditor({ initialData, sectionId, onSave, onCancel }: BlockEditorProps) {
  const [blockType, setBlockType] = useState<BlockType>(initialData?.type || BlockType.TEXT)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState<ContentState>(() => {
    if (initialData?.content) {
      const data = { ...initialData.content } as any
      if ([BlockType.CHART, BlockType.MARKET_NEWS, BlockType.EXPERT_GRID].includes(blockType)) {
          return { ...data, jsonContent: JSON.stringify(data, null, 2) }
      }
      return data as ContentState
    }
    return {}
  })

  function updateContent(field: string, value: unknown) {
    setContent((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      let finalContent: any = { type: blockType, ...content }
      delete finalContent.jsonContent

      if ([BlockType.CHART, BlockType.MARKET_NEWS, BlockType.EXPERT_GRID].includes(blockType) && content.jsonContent) {
          try {
              const parsed = JSON.parse(content.jsonContent)
              finalContent = { ...parsed, type: blockType }
          } catch (e) {
              alert("Invalid JSON content")
              return
          }
      }

      await onSave({ type: blockType, content: finalContent as BlockContent })
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderContentEditor() {
    switch (blockType) {
      case BlockType.TEXT:
        return (
          <div className="space-y-2">
            <Label htmlFor="body">Content</Label>
            <Textarea
              id="body"
              value={content.body || ""}
              onChange={(e) => updateContent("body", e.target.value)}
              placeholder="Enter text content..."
              rows={6}
              className="resize-y"
            />
          </div>
        )

      case BlockType.IMAGE:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Image URL</Label>
              <Input
                id="url"
                value={content.url || ""}
                onChange={(e) => updateContent("url", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={content.alt || ""}
                onChange={(e) => updateContent("alt", e.target.value)}
                placeholder="Describe the image"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption (optional)</Label>
              <Input
                id="caption"
                value={content.caption || ""}
                onChange={(e) => updateContent("caption", e.target.value)}
                placeholder="Image caption"
              />
            </div>
          </div>
        )

      case BlockType.LINK:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={content.url || ""}
                onChange={(e) => updateContent("url", e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Link title"
              />
            </div>
          </div>
        )

      case BlockType.KPI:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={content.label || ""}
                onChange={(e) => updateContent("label", e.target.value)}
                placeholder="e.g. Total Revenue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={content.value || ""}
                onChange={(e) => updateContent("value", e.target.value)}
                placeholder="e.g. $4.2M"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="trend">Trend (optional)</Label>
                <Input
                  id="trend"
                  value={content.trend || ""}
                  onChange={(e) => updateContent("trend", e.target.value)}
                  placeholder="e.g. +12%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trendDirection">Trend Direction</Label>
                <select
                  id="trendDirection"
                  value={content.trendDirection || "neutral"}
                  onChange={(e) => updateContent("trendDirection", e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="up">Up</option>
                  <option value="down">Down</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
            </div>
          </div>
        )

      case BlockType.NEWS_CARD:
        return (
          <div className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="News title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={content.description || ""}
                onChange={(e) => updateContent("description", e.target.value)}
                placeholder="News description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={content.image || ""}
                onChange={(e) => updateContent("image", e.target.value)}
                placeholder="https://example.com/news.jpg"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={content.category || ""}
                onChange={(e) => updateContent("category", e.target.value)}
                placeholder="e.g. Business"
              />
            </div>
          </div>
        )

      case BlockType.CHART:
      case BlockType.MARKET_NEWS:
      case BlockType.EXPERT_GRID:
        return (
          <div className="space-y-2">
            <Label htmlFor="jsonContent">JSON Content</Label>
            <Textarea
              id="jsonContent"
              value={content.jsonContent || ""}
              onChange={(e) => updateContent("jsonContent", e.target.value)}
              placeholder='{ "items": [...] }'
              rows={12}
              className="font-mono text-xs"
            />
            <p className="text-[10px] text-muted-foreground italic">
              Note: Complex blocks are currently edited via JSON for precision.
            </p>
          </div>
        )

      case BlockType.DIVIDER:
        return (
          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <select
              id="style"
              value={content.style || "simple"}
              onChange={(e) => updateContent("style", e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="simple">Simple Line</option>
              <option value="dots">Dots</option>
              <option value="stars">Stars</option>
              <option value="dash">Dashes</option>
            </select>
          </div>
        )

      default:
        return <p className="text-muted-foreground">Select a block type to edit content</p>
    }
  }

  return (
    <Card className="border-2 border-slate-200 rounded-[20px] shadow-lg overflow-hidden">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="text-lg font-black uppercase tracking-widest">{initialData?.id ? "Update Component" : "Add Component"}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type" className="font-bold">Component Type</Label>
            <select
              id="type"
              value={blockType}
              onChange={(e) => setBlockType(e.target.value as BlockType)}
              className="flex h-12 w-full items-center justify-between rounded-full border-2 border-slate-200 bg-white px-6 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {blockTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Separator className="h-0.5 bg-slate-100" />

          {renderContentEditor()}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel} className="rounded-full font-bold">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 font-bold">
              {isSubmitting ? "Processing..." : initialData?.id ? "Apply Changes" : "Create Component"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default BlockEditor
