import { notFound } from "next/navigation"
import Image from "next/image"
import { getIssueByNumber } from "@/lib/actions/cms"
import { BlockRenderer } from "@/components/cms/BlockRenderer"
import type { BlockContent } from "@/lib/cms/schemas"

interface IssuePageProps {
  params: Promise<{ number: string }>
}

export async function generateMetadata({ params }: IssuePageProps) {
  const { number } = await params
  const issue = await getIssueByNumber(parseInt(number))

  if (!issue) {
    return { title: "Issue Not Found" }
  }

  return {
    title: `Issue #${issue.number}: ${issue.title}`,
    description: issue.description || `Digest Issue #${issue.number}`,
  }
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { number } = await params
  const issue = await getIssueByNumber(parseInt(number))

  if (!issue) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="font-semibold text-lg">
              Daily Digest
            </a>
            <a
              href="/admin/issues"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Admin
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-3xl py-12">
        <article className="space-y-8">
          {/* Cover Image */}
          {issue.coverImage && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={issue.coverImage}
                alt={issue.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Header */}
          <header className="space-y-4 text-center">
            <div className="text-sm text-muted-foreground">
              Issue #{issue.number}
              {issue.publishedAt && (
                <span className="mx-2">•</span>
              )}
              {issue.publishedAt && (
                <time dateTime={issue.publishedAt.toISOString()}>
                  {new Date(issue.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{issue.title}</h1>
            {issue.description && (
              <p className="text-xl text-muted-foreground">{issue.description}</p>
            )}
            {issue.author && (
              <div className="flex items-center justify-center gap-2 pt-4">
                {issue.author.image && (
                  <Image
                    src={issue.author.image}
                    alt={issue.author.name || ""}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-muted-foreground">
                  {issue.author.name}
                </span>
              </div>
            )}
          </header>

          {/* Sections */}
          {issue.sections.map((section, sectionIndex) => (
            <section key={section.id} className="space-y-6">
              <h2 className="text-2xl font-semibold pt-8 border-t">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.blocks.map((block) => (
                  <BlockRenderer
                    key={block.id}
                    content={block.content as BlockContent}
                  />
                ))}
              </div>
            </section>
          ))}

          {issue.sections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">This issue has no content yet.</p>
            </div>
          )}
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Daily Digest</p>
        </div>
      </footer>
    </div>
  )
}