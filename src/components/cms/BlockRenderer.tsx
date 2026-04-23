"use client"

import Image from "next/image"
import { BlockType } from "@prisma/client"
import type { BlockContent } from "@/lib/cms/schemas"

interface BlockRendererProps {
  content: BlockContent
  isPreview?: boolean
}

function TextBlock({ content }: { content: { body: string } }) {
  return (
    <div className="prose prose-neutral max-w-none">
      <p className="whitespace-pre-wrap leading-relaxed">{content.body}</p>
    </div>
  )
}

function ImageBlock({ content }: { content: { url: string; alt: string; caption?: string; width?: number; height?: number } }) {
  return (
    <figure className="my-6">
      <div className="relative overflow-hidden rounded-lg bg-muted">
        <Image
          src={content.url}
          alt={content.alt}
          width={content.width || 800}
          height={content.height || 450}
          className="w-full h-auto"
        />
      </div>
      {content.caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground text-center">
          {content.caption}
        </figcaption>
      )}
    </figure>
  )
}

function LinkBlock({ content }: { content: { url: string; title: string; description?: string; image?: string } }) {
  return (
    <a
      href={content.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex gap-4">
        {content.image && (
          <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
            <Image
              src={content.image}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-primary group-hover:text-blue-600 transition-colors truncate">
            {content.title}
          </h4>
          {content.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {content.description}
            </p>
          )}
          <span className="text-xs text-muted-foreground mt-2 block truncate">
            {content.url}
          </span>
        </div>
      </div>
    </a>
  )
}

function QuoteBlock({ content }: { content: { text: string; author?: string; source?: string } }) {
  return (
    <blockquote className="my-6 pl-6 border-l-4 border-primary">
      <p className="text-lg italic text-foreground leading-relaxed">
        &ldquo;{content.text}&rdquo;
      </p>
      {(content.author || content.source) && (
        <footer className="mt-3 text-sm text-muted-foreground">
          {content.author && <cite className="font-medium not-italic">{content.author}</cite>}
          {content.source && (
            <>
              {content.author && <span>, </span>}
              <span>{content.source}</span>
            </>
          )}
        </footer>
      )}
    </blockquote>
  )
}

function CodeBlock({ content }: { content: { language: string; code: string } }) {
  return (
    <div className="my-6 rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-1.5 text-xs text-muted-foreground font-mono border-b">
        {content.language}
      </div>
      <pre className="bg-muted/50 p-4 overflow-x-auto">
        <code className="text-sm font-mono">{content.code}</code>
      </pre>
    </div>
  )
}

function DividerBlock({ content }: { content: { style: string } }) {
  const style = content.style || "simple"

  const styles = {
    simple: (
      <hr className="border-border my-8" />
    ),
    dots: (
      <div className="flex justify-center gap-3 my-8">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-muted-foreground" />
        ))}
      </div>
    ),
    stars: (
      <div className="flex justify-center gap-3 my-8">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="text-muted-foreground">&#9733;</span>
        ))}
      </div>
    ),
    dash: (
      <div className="flex justify-center my-8">
        <span className="text-muted-foreground">- - - - -</span>
      </div>
    ),
  }

  return styles[style as keyof typeof styles] || styles.simple
}

export function BlockRenderer({ content, isPreview = false }: BlockRendererProps) {
  switch (content.type) {
    case BlockType.TEXT:
      return <TextBlock content={content as { body: string }} />
    case BlockType.IMAGE:
      return <ImageBlock content={content as { url: string; alt: string; caption?: string; width?: number; height?: number }} />
    case BlockType.LINK:
      return <LinkBlock content={content as { url: string; title: string; description?: string; image?: string }} />
    case BlockType.QUOTE:
      return <QuoteBlock content={content as { text: string; author?: string; source?: string }} />
    case BlockType.CODE:
      return <CodeBlock content={content as { language: string; code: string }} />
    case BlockType.DIVIDER:
      return <DividerBlock content={content as { style: string }} />
    default:
      return (
        <div className="p-4 bg-destructive/10 text-destructive rounded">
          Unknown block type
        </div>
      )
  }
}

export default BlockRenderer