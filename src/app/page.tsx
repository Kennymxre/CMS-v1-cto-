import Link from "next/link"
import Image from "next/image"
import { getIssues } from "@/lib/actions/cms"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IssueStatus } from "@prisma/client"

export default async function HomePage() {
  const issues = await getIssues(IssueStatus.PUBLISHED)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg">
              Daily Digest
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin/issues"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Админ-панель
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b py-16">
        <div className="container max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Daily Digest
          </h1>
          <p className="text-xl text-muted-foreground">
            Курируемый контент прямо в ваш почтовый ящик
          </p>
        </div>
      </section>

      {/* Issues List */}
      <main className="container max-w-3xl py-12">
        <h2 className="text-2xl font-semibold mb-8">Последние выпуски</h2>

        {issues.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Опубликованных выпусков пока нет.</p>
              <Link
                href="/admin/issues/new"
                className="mt-4 inline-block text-primary hover:underline"
              >
                Создайте свой первый выпуск
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                href={`/issues/${issue.slug}`}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-colors group-hover:border-primary">
                  {issue.coverImage && (
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src={issue.coverImage}
                        alt={issue.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Выпуск #{issue.number}</span>
                      <span>•</span>
                      {issue.publishedAt && (
                        <time dateTime={issue.publishedAt.toISOString()}>
                          {new Date(issue.publishedAt).toLocaleDateString("ru-RU", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {issue.title}
                    </h3>
                    {issue.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {issue.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-4">
                      {issue.author.image && (
                        <Image
                          src={issue.author.image}
                          alt={issue.author.name || ""}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {issue.author.name}
                      </span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {issue._count.sections} разделов
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
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