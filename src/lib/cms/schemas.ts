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

// Union schema for all block content types
export const BlockContentSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal(BlockType.TEXT), ...TextBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.IMAGE), ...ImageBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.LINK), ...LinkBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.QUOTE), ...QuoteBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.CODE), ...CodeBlockContentSchema.shape }),
  z.object({ type: z.literal(BlockType.DIVIDER), ...DividerBlockContentSchema.shape }),
])

// Type exports
export type TextBlockContent = z.infer<typeof TextBlockContentSchema>
export type ImageBlockContent = z.infer<typeof ImageBlockContentSchema>
export type LinkBlockContent = z.infer<typeof LinkBlockContentSchema>
export type QuoteBlockContent = z.infer<typeof QuoteBlockContentSchema>
export type CodeBlockContent = z.infer<typeof CodeBlockContentSchema>
export type DividerBlockContent = z.infer<typeof DividerBlockContentSchema>

export type BlockContent = z.infer<typeof BlockContentSchema>

// Form schemas
export const DigestIssueFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.nativeEnum(IssueStatus),
  coverImage: z.string().url().optional().or(z.literal("")),
  number: z.number().int().positive().optional(),
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