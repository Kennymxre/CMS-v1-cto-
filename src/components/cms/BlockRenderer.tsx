"use client"

import Image from "next/image"
import { BlockType } from "@prisma/client"
import type {
  BlockContent,
  KPIBlockContent,
  ChartBlockContent,
  NewsCardBlockContent,
  MarketNewsBlockContent,
  ExpertGridBlockContent,
  TimelineBlockContent,
  NotesBlockContent,
  RegulationBlockContent,
} from "@/lib/cms/schemas"

import KPIBlock from "./blocks/KPIBlock"
import ChartBlock from "./blocks/ChartBlock"
import NewsCardBlock from "./blocks/NewsCardBlock"
import MarketNewsBlock from "./blocks/MarketNewsBlock"
import ExpertGridBlock from "./blocks/ExpertGrid"
import TimelineBlock from "./blocks/TimelineBlock"
import NotesBlock from "./blocks/NotesBlock"
import RegulationBlock from "./blocks/RegulationBlock"

interface BlockRendererProps {
  content: BlockContent
  isPreview?: boolean
}

function TextBlock({ content }: { content: { body: string } }) {
  return (
    <div className="prose prose-neutral max-w-none">
      <p className="whitespace-pre-wrap leading-relaxed text-lg">{content.body}</p>
    </div>
  )
}

function ImageBlock({ content }: { content: { url: string; alt: string; caption?: string; width?: number; height?: number } }) {
  return (
    <figure className="my-12">
      <div className="relative overflow-hidden rounded-[24px] bg-muted shadow-lg">
        <Image
          src={content.url}
          alt={content.alt}
          width={content.width || 1200}
          height={content.height || 675}
          className="w-full h-auto"
        />
      </div>
      {content.caption && (
        <figcaption className="mt-4 text-sm text-muted-foreground text-center italic">
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
      className="group block p-6 border rounded-[20px] hover:bg-muted/50 transition-all hover:shadow-md"
    >
      <div className="flex gap-6">
        {content.image && (
          <div className="relative w-32 h-32 flex-shrink-0 rounded-[12px] overflow-hidden bg-muted">
            <Image
              src={content.image}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="text-xl font-bold text-primary group-hover:text-yellow-600 transition-colors truncate">
            {content.title}
          </h4>
          {content.description && (
            <p className="text-muted-foreground mt-2 line-clamp-2">
              {content.description}
            </p>
          )}
          <span className="text-xs text-muted-foreground mt-3 block truncate font-mono">
            {content.url}
          </span>
        </div>
      </div>
    </a>
  )
}

function QuoteBlock({ content }: { content: { text: string; author?: string; source?: string } }) {
  return (
    <blockquote className="my-12 relative py-8 px-12 bg-yellow-50 rounded-[32px] border-l-8 border-yellow-400">
      <span className="absolute top-4 left-4 text-6xl text-yellow-200 font-serif leading-none select-none">“</span>
      <p className="text-2xl font-medium text-foreground leading-relaxed relative z-10 italic">
        {content.text}
      </p>
      {(content.author || content.source) && (
        <footer className="mt-6 text-base text-muted-foreground relative z-10 flex items-center gap-2">
          <div className="w-8 h-px bg-yellow-400" />
          {content.author && <cite className="font-bold not-italic text-foreground">{content.author}</cite>}
          {content.source && (
            <>
              {content.author && <span>, </span>}
              <span className="text-sm uppercase tracking-wider">{content.source}</span>
            </>
          )}
        </footer>
      )}
    </blockquote>
  )
}

function CodeBlock({ content }: { content: { language: string; code: string } }) {
  return (
    <div className="my-12 rounded-[20px] overflow-hidden border shadow-sm">
      <div className="bg-muted/50 px-6 py-3 text-xs text-muted-foreground font-mono border-b flex justify-between items-center">
        <span>{content.language}</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/30" />
        </div>
      </div>
      <pre className="bg-slate-950 p-6 overflow-x-auto">
        <code className="text-sm font-mono text-slate-300">{content.code}</code>
      </pre>
    </div>
  )
}

function DividerBlock({ content }: { content: { style: string } }) {
  const style = content.style || "simple"

  const styles = {
    simple: (
      <hr className="border-border my-16" />
    ),
    dots: (
      <div className="flex justify-center gap-4 my-16">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="w-3 h-3 rounded-full bg-yellow-400" />
        ))}
      </div>
    ),
    stars: (
      <div className="flex justify-center gap-4 my-16">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="text-2xl text-yellow-400">&#9733;</span>
        ))}
      </div>
    ),
    dash: (
      <div className="flex justify-center my-16">
        <span className="text-muted-foreground tracking-[1em] font-bold">- - - -</span>
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
    case BlockType.KPI:
      return <KPIBlock content={content as KPIBlockContent} />
    case BlockType.CHART:
      return <ChartBlock content={content as ChartBlockContent} />
    case BlockType.NEWS_CARD:
      return <NewsCardBlock content={content as NewsCardBlockContent} />
    case BlockType.MARKET_NEWS:
      return <MarketNewsBlock content={content as MarketNewsBlockContent} />
    case BlockType.EXPERT_GRID:
      return <ExpertGridBlock content={content as ExpertGridBlockContent} />
    case BlockType.TIMELINE:
      return <TimelineBlock content={content as TimelineBlockContent} />
    case BlockType.NOTES:
      return <NotesBlock content={content as NotesBlockContent} />
    case BlockType.REGULATION:
      return <RegulationBlock content={content as RegulationBlockContent} />
    default:
      return (
        <div className="p-8 bg-destructive/5 text-destructive rounded-[20px] border border-destructive/20 font-medium">
          Неизвестный тип блока: {content.type}
        </div>
      )
  }
}

export default BlockRenderer
