import { z } from "zod"
import { BlockType, IssueStatus } from "@prisma/client"

// Block Content Schemas
export const TextBlockContentSchema = z.object({
  body: z.string(),
})

export const ImageBlockContentSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export const LinkBlockContentSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().url().optional(),
})

export const QuoteBlockContentSchema = z.object({
  text: z.string(),
  author: z.string().optional(),
  source: z.string().optional(),
})

export const CodeBlockContentSchema = z.object({
  language: z.string().default("plaintext"),
  code: z.string(),
})

export const DividerBlockContentSchema = z.object({
  style: z.enum(["simple", "dots", "stars", "dash"]).default("simple"),
})

export const KPIBlockContentSchema = z.object({
  label: z.string(),
  value: z.string(),
  trend: z.string().optional(),
  trendDirection: z.enum(["up", "down", "neutral"]).default("neutral"),
})

export const ChartBlockContentSchema = z.object({
  title: z.string(),
  chartType: z.enum(["area", "bar", "line"]).default("area"),
  data: z.array(z.record(z.any())),
})

export const NewsCardBlockContentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string().url(),
  category: z.string().optional(),
  url: z.string().url().optional(),
})

export const MarketNewsBlockContentSchema = z.object({
  items: z.array(z.object({
    label: z.string(),
    value: z.string(),
    change: z.string(),
    trend: z.enum(["up", "down", "neutral"]).optional(),
  })),
})

export const ExpertGridBlockContentSchema = z.object({
  experts: z.array(z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string().url().optional(),
    insight: z.string(),
  })),
})

export const TimelineBlockContentSchema = z.object({
  items: z.array(z.object({
    date: z.string(),
    title: z.string(),
    description: z.string(),
  })),
})

export const NotesBlockContentSchema = z.object({
  title: z.string().optional(),
  items: z.array(z.string()),
})

export const RegulationBlockContentSchema = z.object({
  title: z.string(),
  status: z.string(),
  impact: z.enum(["low", "medium", "high", "critical"]).default("low"),
  summary: z.string(),
})

// Union schema for all block content types
export const BlockContentSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal(BlockType.TEXT), ...TextBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.IMAGE), ...ImageBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.LINK), ...LinkBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.QUOTE), ...QuoteBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.CODE), ...CodeBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.DIVIDER), ...DividerBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.KPI), ...KPIBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.CHART), ...ChartBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.NEWS_CARD), ...NewsCardBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.MARKET_NEWS), ...MarketNewsBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.EXPERT_GRID), ...ExpertGridBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.TIMELINE), ...TimelineBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.NOTES), ...NotesBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.REGULATION), ...RegulationBlockContentSchema.shape }),
])

// Type exports
export type TextBlockContent = z.infer<typeof TextBlockContentSchema>
export type ImageBlockContent = z.infer<typeof ImageBlockContentSchema>
export type LinkBlockContent = z.infer<typeof LinkBlockContentSchema>
export type QuoteBlockContent = z.infer<typeof QuoteBlockContentSchema>
export type CodeBlockContent = z.infer<typeof CodeBlockContentSchema>
export type DividerBlockContent = z.infer<typeof DividerBlockContentSchema>
export type KPIBlockContent = z.infer<typeof KPIBlockContentSchema>
export type ChartBlockContent = z.infer<typeof ChartBlockContentSchema>
export type NewsCardBlockContent = z.infer<typeof NewsCardBlockContentSchema>
export type MarketNewsBlockContent = z.infer<typeof MarketNewsBlockContentSchema>
export type ExpertGridBlockContent = z.infer<typeof ExpertGridBlockContentSchema>
export type TimelineBlockContent = z.infer<typeof TimelineBlockContentSchema>
export type NotesBlockContent = z.infer<typeof NotesBlockContentSchema>
export type RegulationBlockContent = z.infer<typeof RegulationBlockContentSchema>

export type BlockContent = z.infer<typeof BlockContentSchema>

// Form schemas
export const DigestIssueFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.nativeEnum(IssueStatus),
  coverImage: z.string().url().optional().or(z.literal("")),
  number: z.number().int().positive().optional(),
  slug: z.string().min(1, "Slug is required").optional(),
})

export const DigestSectionFormSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  order: z.number().int().optional(),
})

export const ContentBlockFormSchema = z.object({
  type: z.nativeEnum(BlockType),
  content: BlockContentSchema,
  order: z.number().int().optional(),
})

// Validation schemas
export const CreateIssueSchema = DigestIssueFormSchema
export const UpdateIssueSchema = DigestIssueFormSchema.partial()

export const CreateSectionSchema = DigestSectionFormSchema
export const UpdateSectionSchema = DigestSectionFormSchema.partial()

export const CreateBlockSchema = ContentBlockFormSchema
export const UpdateBlockSchema = ContentBlockFormSchema.partial()
