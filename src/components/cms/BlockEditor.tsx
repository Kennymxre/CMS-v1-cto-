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
}

export function BlockEditor({ initialData, sectionId, onSave, onCancel }: BlockEditorProps) {
  const [blockType, setBlockType] = useState<BlockType>(initialData?.type || BlockType.TEXT)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState<ContentState>(() => {
    if (initialData?.content) {
      return initialData.content as ContentState
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
      const finalContent = { type: blockType, ...content } as BlockContent
      await onSave({ type: blockType, content: finalContent })
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={content.width || 800}
                  onChange={(e) => updateContent("width", parseInt(e.target.value) || 800)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={content.height || 450}
                  onChange={(e) => updateContent("height", parseInt(e.target.value) || 450)}
                />
              </div>
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
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={content.description || ""}
                onChange={(e) => updateContent("description", e.target.value)}
                placeholder="Brief description"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Thumbnail URL (optional)</Label>
              <Input
                id="image"
                value={content.image || ""}
                onChange={(e) => updateContent("image", e.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
          </div>
        )

      case BlockType.QUOTE:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Quote Text</Label>
              <Textarea
                id="text"
                value={content.text || ""}
                onChange={(e) => updateContent("text", e.target.value)}
                placeholder="Enter the quote..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author (optional)</Label>
              <Input
                id="author"
                value={content.author || ""}
                onChange={(e) => updateContent("author", e.target.value)}
                placeholder="Quote author"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source (optional)</Label>
              <Input
                id="source"
                value={content.source || ""}
                onChange={(e) => updateContent("source", e.target.value)}
                placeholder="Book, article, etc."
              />
            </div>
          </div>
        )

      case BlockType.CODE:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={content.language || "plaintext"}
                onChange={(e) => updateContent("language", e.target.value)}
                placeholder="javascript, python, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Textarea
                id="code"
                value={content.code || ""}
                onChange={(e) => updateContent("code", e.target.value)}
                placeholder="// Your code here..."
                rows={10}
                className="font-mono"
              />
            </div>
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
    <Card>
      <CardHeader>
        <CardTitle>{initialData?.id ? "Edit Block" : "Add Block"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Block Type</Label>
            <select
              id="type"
              value={blockType}
              onChange={(e) => setBlockType(e.target.value as BlockType)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {blockTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Separator />

          {renderContentEditor()}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData?.id ? "Update Block" : "Add Block"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default BlockEditor