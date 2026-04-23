"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, GripVertical, FileText, Image, Link2, Quote, Code, Minus, BarChart3, TrendingUp, Newspaper, LineChart, Users, Calendar, ListTodo, Gavel } from "lucide-react"
import { BlockRenderer } from "@/components/cms/BlockRenderer"
import { BlockEditor } from "@/components/cms/BlockEditor"
import { SortableItem } from "@/components/cms/SortableItem"
import {
  updateIssue,
  createSection,
  updateSection,
  deleteSection,
  createBlock,
  updateBlock,
  deleteBlock,
  reorderSections,
  reorderBlocks,
} from "@/lib/actions/cms"
import type { DigestIssue, DigestSection, ContentBlock } from "@prisma/client"
import type { BlockContent } from "@/lib/cms/schemas"
import { IssueStatus, BlockType } from "@prisma/client"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

interface IssueEditorClientProps {
  issue: DigestIssue & {
    sections: (DigestSection & {
      blocks: ContentBlock[]
    })[]
  }
}

const blockTypeIcons: Record<BlockType, React.ReactNode> = {
  [BlockType.TEXT]: <FileText className="h-4 w-4" />,
  [BlockType.IMAGE]: <Image className="h-4 w-4" />,
  [BlockType.LINK]: <Link2 className="h-4 w-4" />,
  [BlockType.QUOTE]: <Quote className="h-4 w-4" />,
  [BlockType.CODE]: <Code className="h-4 w-4" />,
  [BlockType.DIVIDER]: <Minus className="h-4 w-4" />,
  [BlockType.KPI]: <TrendingUp className="h-4 w-4" />,
  [BlockType.CHART]: <BarChart3 className="h-4 w-4" />,
  [BlockType.NEWS_CARD]: <Newspaper className="h-4 w-4" />,
  [BlockType.MARKET_NEWS]: <LineChart className="h-4 w-4" />,
  [BlockType.EXPERT_GRID]: <Users className="h-4 w-4" />,
  [BlockType.TIMELINE]: <Calendar className="h-4 w-4" />,
  [BlockType.NOTES]: <ListTodo className="h-4 w-4" />,
  [BlockType.REGULATION]: <Gavel className="h-4 w-4" />,
}

const blockTypeLabels: Record<BlockType, string> = {
  [BlockType.TEXT]: "Текст",
  [BlockType.IMAGE]: "Изображение",
  [BlockType.LINK]: "Ссылка",
  [BlockType.QUOTE]: "Цитата",
  [BlockType.CODE]: "Код",
  [BlockType.DIVIDER]: "Разделитель",
  [BlockType.KPI]: "KPI",
  [BlockType.CHART]: "График",
  [BlockType.NEWS_CARD]: "Карточка новостей",
  [BlockType.MARKET_NEWS]: "Новости рынка",
  [BlockType.EXPERT_GRID]: "Сетка экспертов",
  [BlockType.TIMELINE]: "Хронология",
  [BlockType.NOTES]: "Заметки",
  [BlockType.REGULATION]: "Регулирование",
}

export function IssueEditorClient({ issue }: IssueEditorClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  const [addingBlockToSection, setAddingBlockToSection] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  async function handleDragEndSections(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = issue.sections.findIndex((s) => s.id === active.id)
      const newIndex = issue.sections.findIndex((s) => s.id === over.id)

      const newSections = arrayMove(issue.sections, oldIndex, newIndex)
      const sectionIds = newSections.map((s) => s.id)

      try {
        await reorderSections(issue.id, sectionIds)
        toast.success("Порядок разделов изменен")
        router.refresh()
      } catch (error) {
        toast.error("Не удалось изменить порядок разделов")
      }
    }
  }

  async function handleDragEndBlocks(sectionId: string, event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const section = issue.sections.find((s) => s.id === sectionId)
      if (!section) return

      const oldIndex = section.blocks.findIndex((b) => b.id === active.id)
      const newIndex = section.blocks.findIndex((b) => b.id === over.id)

      const newBlocks = arrayMove(section.blocks, oldIndex, newIndex)
      const blockIds = newBlocks.map((b) => b.id)

      try {
        await reorderBlocks(sectionId, blockIds)
        toast.success("Порядок блоков изменен")
        router.refresh()
      } catch (error) {
        toast.error("Не удалось изменить порядок блоков")
      }
    }
  }

  async function handleUpdateIssue(formData: FormData) {
    setIsSubmitting(true)
    try {
      await updateIssue(issue.id, formData)
      toast.success("Выпуск обновлен")
      router.refresh()
    } catch (error) {
      toast.error("Не удалось обновить выпуск")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCreateSection(formData: FormData) {
    try {
      await createSection(issue.id, formData)
      toast.success("Раздел создан")
      router.refresh()
    } catch (error) {
      toast.error("Не удалось создать раздел")
    }
  }

  async function handleUpdateSection(sectionId: string, formData: FormData) {
    try {
      await updateSection(sectionId, formData)
      toast.success("Раздел обновлен")
      setEditingSection(null)
      router.refresh()
    } catch (error) {
      toast.error("Не удалось обновить раздел")
    }
  }

  async function handleDeleteSection(sectionId: string) {
    if (!confirm("Вы уверены, что хотите удалить этот раздел и все его блоки?")) {
      return
    }
    try {
      await deleteSection(sectionId)
      toast.success("Раздел удален")
      router.refresh()
    } catch (error) {
      toast.error("Не удалось удалить раздел")
    }
  }

  async function handleAddBlock(sectionId: string, data: { type: BlockType; content: BlockContent }) {
    try {
      await createBlock(sectionId, data)
      toast.success("Блок добавлен")
      setAddingBlockToSection(null)
      router.refresh()
    } catch (error) {
      toast.error("Не удалось добавить блок")
    }
  }

  async function handleUpdateBlock(blockId: string, data: { type: BlockType; content: BlockContent }) {
    try {
      await updateBlock(blockId, data)
      toast.success("Блок обновлен")
      setEditingBlock(null)
      router.refresh()
    } catch (error) {
      toast.error("Не удалось обновить блок")
    }
  }

  async function handleDeleteBlock(blockId: string) {
    if (!confirm("Вы уверены, что хотите удалить этот блок?")) {
      return
    }
    try {
      await deleteBlock(blockId)
      toast.success("Блок удален")
      router.refresh()
    } catch (error) {
      toast.error("Не удалось удалить блок")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/issues">
            <Button variant="ghost" size="sm">
              ← Назад
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Выпуск №{issue.number}</h1>
            <Badge
              variant={issue.status === IssueStatus.PUBLISHED ? "default" : "secondary"}
              className="mt-1"
            >
              {issue.status === 'DRAFT' ? 'черновик' : 
               issue.status === 'PUBLISHED' ? 'опубликован' : 
               issue.status === 'ARCHIVED' ? 'в архиве' : issue.status.toLowerCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Issue Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Детали выпуска</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleUpdateIssue} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Заголовок</Label>
              <Input
                id="title"
                name="title"
                defaultValue={issue.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={issue.description || ""}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={issue.status}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value={IssueStatus.DRAFT}>Черновик</option>
                  <option value={IssueStatus.PUBLISHED}>Опубликован</option>
                  <option value={IssueStatus.ARCHIVED}>В архиве</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Слаг</Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={issue.slug || ""}
                  placeholder="issue-slug"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">URL обложки</Label>
              <Input
                id="coverImage"
                name="coverImage"
                type="url"
                defaultValue={issue.coverImage || ""}
                placeholder="https://example.com/cover.jpg"
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Разделы</h2>
          <Dialog>
            <DialogTrigger render={<Button size="sm" />}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить раздел
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить новый раздел</DialogTitle>
              </DialogHeader>
              <form action={handleCreateSection} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок раздела</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Введите заголовок раздела"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => document.body.click()}>
                    Отмена
                  </Button>
                  <Button type="submit">Добавить раздел</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {issue.sections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Разделов пока нет. Добавьте свой первый раздел выше.</p>
            </CardContent>
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEndSections}
          >
            <SortableContext
              items={issue.sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {issue.sections.map((section) => (
                  <SortableItem key={section.id} id={section.id}>
                    {({ attributes, listeners, setNodeRef, style, isDragging }) => (
                      <Card
                        ref={setNodeRef}
                        style={style}
                        className={isDragging ? "z-50 ring-2 ring-primary" : ""}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <div
                                {...attributes}
                                {...listeners}
                                className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              {editingSection === section.id ? (
                                <form
                                  action={(formData) => handleUpdateSection(section.id, formData)}
                                  className="flex gap-2 flex-1"
                                >
                                  <Input
                                    name="title"
                                    defaultValue={section.title}
                                    className="flex-1"
                                  />
                                  <Button type="submit" size="sm">Сохранить</Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingSection(null)}
                                  >
                                    Отмена
                                  </Button>
                                </form>
                              ) : (
                                <>
                                  <CardTitle className="text-lg">{section.title}</CardTitle>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingSection(section.id)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteSection(section.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Blocks */}
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(event) => handleDragEndBlocks(section.id, event)}
                          >
                            <SortableContext
                              items={section.blocks.map((b) => b.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              {section.blocks.length > 0 && (
                                <div className="space-y-3 pl-4 border-l-2 border-muted">
                                  {section.blocks.map((block) => (
                                    <SortableItem key={block.id} id={block.id}>
                                      {({ attributes, listeners, setNodeRef, style, isDragging }) => (
                                        <div
                                          ref={setNodeRef}
                                          style={style}
                                          className={`relative group ${isDragging ? "z-50 ring-2 ring-primary rounded-lg" : ""}`}
                                        >
                                          {editingBlock?.id === block.id ? (
                                            <BlockEditor
                                              initialData={{
                                                id: block.id,
                                                type: block.type,
                                                content: block.content as BlockContent,
                                              }}
                                              sectionId={section.id}
                                              onSave={(data) => handleUpdateBlock(block.id, data)}
                                              onCancel={() => setEditingBlock(null)}
                                            />
                                          ) : (
                                            <div className="relative p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                              <div className="flex items-center gap-2 mb-2">
                                                <div
                                                  {...attributes}
                                                  {...listeners}
                                                  className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
                                                >
                                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                  {blockTypeIcons[block.type]}
                                                  <span className="ml-1">{blockTypeLabels[block.type]}</span>
                                                </Badge>
                                                <div className="flex-1" />
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditingBlock(block)}
                                                  >
                                                    <Pencil className="h-3 w-3" />
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteBlock(block.id)}
                                                  >
                                                    <Trash2 className="h-3 w-3 text-destructive" />
                                                  </Button>
                                                </div>
                                              </div>
                                              <BlockRenderer content={block.content as BlockContent} isPreview />
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </SortableItem>
                                  ))}
                                </div>
                              )}
                            </SortableContext>
                          </DndContext>

                          {/* Add Block */}
                          {addingBlockToSection === section.id ? (
                            <BlockEditor
                              sectionId={section.id}
                              onSave={(data) => handleAddBlock(section.id, data)}
                              onCancel={() => setAddingBlockToSection(null)}
                            />
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => setAddingBlockToSection(section.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Добавить блок
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}

export default IssueEditorClient
