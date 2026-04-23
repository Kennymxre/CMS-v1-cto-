import Link from "next/link"
import { Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getIssues } from "@/lib/actions/cms"
import { IssueStatus } from "@prisma/client"

export default async function IssuesPage() {
  const issues = await getIssues()

  const statusColors: Record<IssueStatus, string> = {
    DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
    PUBLISHED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ARCHIVED: "bg-amber-50 text-amber-700 border-amber-200",
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex items-end justify-between border-b-4 border-slate-900 pb-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter">Issues</h1>
          <p className="text-slate-500 mt-2 font-medium text-lg italic">
            Management dashboard for your editorial content.
          </p>
        </div>
        <Link href="/admin/issues/new">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-8 h-14 rounded-full text-lg shadow-lg transition-transform active:scale-95">
            <Plus className="h-6 w-6 mr-2" strokeWidth={3} />
            New Issue
          </Button>
        </Link>
      </div>

      <Card className="rounded-[32px] border-2 border-slate-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
          <CardTitle className="text-xl font-black uppercase tracking-widest text-slate-400">All Content</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {issues.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-2xl text-slate-300 font-bold italic">No issues found in the archive.</p>
              <Link href="/admin/issues/new" className="mt-8 inline-block">
                <Button variant="outline" className="rounded-full px-8 h-12 border-2">Create your first issue</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent border-b-2">
                  <TableHead className="w-24 px-8 py-4 font-black uppercase tracking-tighter text-slate-900">No.</TableHead>
                  <TableHead className="py-4 font-black uppercase tracking-tighter text-slate-900">Title</TableHead>
                  <TableHead className="py-4 font-black uppercase tracking-tighter text-slate-900">Status</TableHead>
                  <TableHead className="py-4 font-black uppercase tracking-tighter text-slate-900">Slug</TableHead>
                  <TableHead className="py-4 font-black uppercase tracking-tighter text-slate-900">Created</TableHead>
                  <TableHead className="text-right px-8 py-4 font-black uppercase tracking-tighter text-slate-900">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.id} className="group hover:bg-yellow-50/30 transition-colors border-b last:border-0">
                    <TableCell className="px-8 py-6 font-mono font-bold text-slate-400">
                      {issue.number.toString().padStart(3, '0')}
                    </TableCell>
                    <TableCell className="py-6">
                      <Link
                        href={`/admin/issues/${issue.id}`}
                        className="text-xl font-black hover:text-yellow-600 transition-colors tracking-tight"
                      >
                        {issue.title}
                      </Link>
                    </TableCell>
                    <TableCell className="py-6">
                      <Badge variant="outline" className={`px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest ${statusColors[issue.status]}`}>
                        {issue.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6 font-mono text-xs text-slate-400">
                      /{issue.slug}
                    </TableCell>
                    <TableCell className="py-6 text-slate-500 font-bold">
                      {new Date(issue.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right px-8 py-6">
                      <Link href={`/admin/issues/${issue.id}`}>
                        <Button variant="outline" className="rounded-full w-12 h-12 p-0 border-2 group-hover:border-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-all">
                          <ChevronRight className="h-6 w-6" strokeWidth={3} />
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
