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
  { value: BlockType.TEXT, label: "Текст" },
  { value: BlockType.IMAGE, label: "Изображение" },
  { value: BlockType.LINK, label: "Ссылка" },
  { value: BlockType.QUOTE, label: "Цитата" },
  { value: BlockType.CODE, label: "Код" },
  { value: BlockType.DIVIDER, label: "Разделитель" },
  { value: BlockType.KPI, label: "KPI" },
  { value: BlockType.CHART, label: "График" },
  { value: BlockType.NEWS_CARD, label: "Карточка новостей" },
  { value: BlockType.MARKET_NEWS, label: "Новости рынка" },
  { value: BlockType.EXPERT_GRID, label: "Сетка экспертов" },
  { value: BlockType.TIMELINE, label: "Хронология" },
  { value: BlockType.NOTES, label: "Заметки" },
  { value: BlockType.REGULATION, label: "Регулирование" },
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
      if ([BlockType.CHART, BlockType.MARKET_NEWS, BlockType.EXPERT_GRID, BlockType.TIMELINE, BlockType.NOTES, BlockType.REGULATION].includes(blockType)) {
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

      if ([BlockType.CHART, BlockType.MARKET_NEWS, BlockType.EXPERT_GRID, BlockType.TIMELINE, BlockType.NOTES, BlockType.REGULATION].includes(blockType) && content.jsonContent) {
          try {
              const parsed = JSON.parse(content.jsonContent)
              finalContent = { ...parsed, type: blockType }
          } catch (e) {
              alert("Некорректный JSON контент")
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
            <Label htmlFor="body">Контент</Label>
            <Textarea
              id="body"
              value={content.body || ""}
              onChange={(e) => updateContent("body", e.target.value)}
              placeholder="Введите текстовый контент..."
              rows={6}
              className="resize-y"
            />
          </div>
        )

      case BlockType.IMAGE:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL изображения</Label>
              <Input
                id="url"
                value={content.url || ""}
                onChange={(e) => updateContent("url", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt">Альтернативный текст</Label>
              <Input
                id="alt"
                value={content.alt || ""}
                onChange={(e) => updateContent("alt", e.target.value)}
                placeholder="Опишите изображение"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Подпись (необязательно)</Label>
              <Input
                id="caption"
                value={content.caption || ""}
                onChange={(e) => updateContent("caption", e.target.value)}
                placeholder="Подпись к изображению"
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
              <Label htmlFor="title">Заголовок</Label>
              <Input
                id="title"
                value={content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Заголовок ссылки"
              />
            </div>
          </div>
        )

      case BlockType.KPI:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Метка</Label>
              <Input
                id="label"
                value={content.label || ""}
                onChange={(e) => updateContent("label", e.target.value)}
                placeholder="напр. Общая выручка"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Значение</Label>
              <Input
                id="value"
                value={content.value || ""}
                onChange={(e) => updateContent("value", e.target.value)}
                placeholder="напр. $4.2M"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="trend">Тренд (необязательно)</Label>
                <Input
                  id="trend"
                  value={content.trend || ""}
                  onChange={(e) => updateContent("trend", e.target.value)}
                  placeholder="напр. +12%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trendDirection">Направление тренда</Label>
                <select
                  id="trendDirection"
                  value={content.trendDirection || "neutral"}
                  onChange={(e) => updateContent("trendDirection", e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="up">Вверх</option>
                  <option value="down">Вниз</option>
                  <option value="neutral">Нейтрально</option>
                </select>
              </div>
            </div>
          </div>
        )

      case BlockType.NEWS_CARD:
        return (
          <div className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="title">Заголовок</Label>
              <Input
                id="title"
                value={content.title || ""}
                onChange={(e) => updateContent("title", e.target.value)}
                placeholder="Заголовок новости"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={content.description || ""}
                onChange={(e) => updateContent("description", e.target.value)}
                placeholder="Описание новости"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">URL изображения</Label>
              <Input
                id="image"
                value={content.image || ""}
                onChange={(e) => updateContent("image", e.target.value)}
                placeholder="https://example.com/news.jpg"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Input
                id="category"
                value={content.category || ""}
                onChange={(e) => updateContent("category", e.target.value)}
                placeholder="напр. Бизнес"
              />
            </div>
          </div>
        )

      case BlockType.CHART:
      case BlockType.MARKET_NEWS:
      case BlockType.EXPERT_GRID:
      case BlockType.TIMELINE:
      case BlockType.NOTES:
      case BlockType.REGULATION:
        return (
          <div className="space-y-2">
            <Label htmlFor="jsonContent">JSON контент</Label>
            <Textarea
              id="jsonContent"
              value={content.jsonContent || ""}
              onChange={(e) => updateContent("jsonContent", e.target.value)}
              placeholder='{ "items": [...] }'
              rows={12}
              className="font-mono text-xs"
            />
            <p className="text-[10px] text-muted-foreground italic">
              Примечание: Сложные блоки в данный момент редактируются через JSON для точности.
            </p>
          </div>
        )

      case BlockType.DIVIDER:
        return (
          <div className="space-y-2">
            <Label htmlFor="style">Стиль</Label>
            <select
              id="style"
              value={content.style || "simple"}
              onChange={(e) => updateContent("style", e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="simple">Простая линия</option>
              <option value="dots">Точки</option>
              <option value="stars">Звезды</option>
              <option value="dash">Пунктир</option>
            </select>
          </div>
        )

      default:
        return <p className="text-muted-foreground">Выберите тип блока для редактирования контента</p>
    }
  }

  return (
    <Card className="border-2 border-slate-200 rounded-[20px] shadow-lg overflow-hidden">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="text-lg font-black uppercase tracking-widest">{initialData?.id ? "Обновить компонент" : "Добавить компонент"}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type" className="font-bold">Тип компонента</Label>
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
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 font-bold">
              {isSubmitting ? "Обработка..." : initialData?.id ? "Применить изменения" : "Создать компонент"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

  )
}

export default BlockEditor
