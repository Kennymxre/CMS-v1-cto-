import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getIssues } from "@/lib/actions/cms"
import { IssueStatus } from "@prisma/client"

export default async function IssuesPage() {
  const issues = await getIssues()

  const statusColors: Record<IssueStatus, string> = {
    DRAFT: "secondary",
    PUBLISHED: "default",
    ARCHIVED: "outline",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Digest Issues</h1>
          <p className="text-muted-foreground mt-1">
            Manage your digest newsletter issues
          </p>
        </div>
        <Link href="/admin/issues/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Issue
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Issues</CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No issues yet</p>
              <Link href="/admin/issues/new" className="mt-4 inline-block">
                <Button variant="outline">Create your first issue</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">#{issue.number}</TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/issues/${issue.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {issue.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[issue.status] as "default" | "secondary" | "outline"}>
                        {issue.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{issue._count.sections}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/issues/${issue.id}`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}