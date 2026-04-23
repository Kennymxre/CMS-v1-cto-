import { notFound } from "next/navigation"
import { getIssue } from "@/lib/actions/cms"
import { IssueEditorClient } from "./IssueEditorClient"

interface IssueEditorPageProps {
  params: Promise<{ id: string }>
}

export default async function IssueEditorPage({ params }: IssueEditorPageProps) {
  const { id } = await params
  const issue = await getIssue(id)

  if (!issue) {
    notFound()
  }

  return <IssueEditorClient issue={issue} />
}