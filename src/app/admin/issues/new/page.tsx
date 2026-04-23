import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createIssue } from "@/lib/actions/cms"
import { IssueStatus } from "@prisma/client"
import { redirect } from "next/navigation"

export default async function NewIssuePage() {
  async function handleCreateIssue(formData: FormData) {
    "use server"
    const issue = await createIssue(formData)
    redirect(`/admin/issues/${issue.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/issues">
          <Button variant="ghost" size="sm">
            ← Back to issues
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Issue</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreateIssue} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter issue title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of this issue"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Issue Number</Label>
                <Input
                  id="number"
                  name="number"
                  type="number"
                  placeholder="Auto-generated if empty"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="issue-slug"
                />
                <p className="text-[10px] text-muted-foreground italic">
                  Leave empty to auto-generate from title
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                defaultValue="DRAFT"
              >
                <option value={IssueStatus.DRAFT}>Draft</option>
                <option value={IssueStatus.PUBLISHED}>Published</option>
                <option value={IssueStatus.ARCHIVED}>Archived</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                name="coverImage"
                type="url"
                placeholder="https://example.com/cover.jpg"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/admin/issues">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">
                Create Issue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}