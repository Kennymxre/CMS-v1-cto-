"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { CreateIssueSchema, UpdateIssueSchema, CreateSectionSchema, UpdateSectionSchema, CreateBlockSchema, UpdateBlockSchema } from "@/lib/cms/schemas"
import { IssueStatus, BlockType } from "@prisma/client"
import { BlockContentSchema } from "@/lib/cms/schemas"

// Utility to generate slug
function generateSlug(title: string): string {
  const rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х".split(/ +/)
  const eng = "shh sh ch cz yu ya yo zh `` y e a b v g d e z i j k l m n o p r s t u f x".split(/ +/)
  
  let slug = title.toLowerCase()
  for (let i = 0; i < rus.length; i++) {
    slug = slug.split(rus[i]).join(eng[i])
  }

  return slug
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

// Issue Actions
export async function getIssues(status?: IssueStatus) {
  return prisma.digestIssue.findMany({
    where: status ? { status } : undefined,
    orderBy: { number: "desc" },
    include: {
      author: {
        select: { name: true, image: true },
      },
      _count: {
        select: { sections: true },
      },
    },
  })
}

export async function getIssue(id: string) {
  return prisma.digestIssue.findUnique({
    where: { id },
    include: {
      author: true,
      sections: {
        orderBy: { order: "asc" },
        include: {
          blocks: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  })
}

export async function getIssueByNumber(number: number) {
  return prisma.digestIssue.findUnique({
    where: { number },
    include: {
      author: true,
      sections: {
        orderBy: { order: "asc" },
        include: {
          blocks: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  })
}

export async function getIssueBySlug(slug: string) {
  return prisma.digestIssue.findUnique({
    where: { slug },
    include: {
      author: true,
      sections: {
        orderBy: { order: "asc" },
        include: {
          blocks: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  })
}

export async function createIssue(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Неавторизован")
  }

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string | null,
    status: (formData.get("status") as IssueStatus) || IssueStatus.DRAFT,
    coverImage: formData.get("coverImage") as string | null,
    number: formData.get("number") ? parseInt(formData.get("number") as string) : undefined,
    slug: formData.get("slug") as string | undefined,
  }

  const parsed = CreateIssueSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.message)
  }

  // Auto-generate number if not provided
  let issueNumber: number
  if (parsed.data.number) {
    issueNumber = parsed.data.number
  } else {
    const latestIssue = await prisma.digestIssue.findFirst({
      orderBy: { number: "desc" },
    })
    issueNumber = (latestIssue?.number || 0) + 1
  }

  // Auto-generate slug if not provided
  const issueSlug = parsed.data.slug || `${generateSlug(parsed.data.title)}-${issueNumber}`

  const issue = await prisma.digestIssue.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: parsed.data.status,
      coverImage: parsed.data.coverImage || null,
      number: issueNumber,
      slug: issueSlug,
      authorId: session.user.id,
    },
  })

  revalidatePath("/admin/issues")
  revalidatePath("/")
  return issue
}

export async function updateIssue(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Неавторизован")
  }

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string | null,
    status: formData.get("status") as IssueStatus,
    coverImage: formData.get("coverImage") as string | null,
    slug: formData.get("slug") as string | undefined,
  }

  const parsed = UpdateIssueSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.message)
  }

  const updateData: any = {
    title: parsed.data.title!,
    description: parsed.data.description || null,
    status: parsed.data.status!,
    coverImage: parsed.data.coverImage || null,
    slug: parsed.data.slug,
  }

  // Set publishedAt when publishing
  if (updateData.status === IssueStatus.PUBLISHED) {
    const existing = await prisma.digestIssue.findUnique({ where: { id } })
    if (existing && !existing.publishedAt) {
      updateData.publishedAt = new Date()
    }
  }

  const issue = await prisma.digestIssue.update({
    where: { id },
    data: updateData,
  })

  revalidatePath("/admin/issues")
  revalidatePath(`/admin/issues/${id}`)
  revalidatePath(`/issues/${issue.number}`)
  revalidatePath(`/issues/${issue.slug}`)
  revalidatePath("/")
  return issue
}

export async function deleteIssue(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Неавторизован")
  }

  await prisma.digestIssue.delete({ where: { id } })

  revalidatePath("/admin/issues")
  revalidatePath("/")
}

// Section Actions
export async function createSection(issueId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Неавторизован")
  }

  const title = formData.get("title") as string
  const parsed = CreateSectionSchema.safeParse({ title })
  if (!parsed.success) {
    throw new Error(parsed.error.message)
  }

  // Get the next order number
  const maxOrder = await prisma.digestSection.aggregate({
    where: { issueId },
    _max: { order: true },
  })

  const section = await prisma.digestSection.create({
    data: {
      title: parsed.data.title,
      issueId,
      order: (maxOrder._max.order || 0) + 1,
    },
    include: {
      blocks: true,
    },
  })

  revalidatePath(`/admin/issues/${issueId}`)
  return section
}

export async function updateSection(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Неавторизован")
  }

  const data = {
    title: formData.get("title") as string,
    order: formData.get("order") ? parseInt(formData.get("order") as string) : undefined,
  }

  const parsed = UpdateSectionSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.message)
  }

  const section = await prisma.digestSection.update({
    where: { id },
    data: parsed.data,
  })

  const issue = await prisma.digestIssue.findUnique({
    where: { id: section.issueId },
    select: { number: true, slug: true },
  })

  revalidatePath(`/admin/issues/${section.issueId}`)
  if (issue) {
    revalidatePath(`/issues/${issue.number}`)
    revalidatePath(`/issues/${issue.slug}`)
  }
  return section
}

export async function deleteSection(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Неавторизован")
  }

  const section = await prisma.digestSection.findUnique({
    where: { id },
    include: { issue: { select: { id: true, number: true, slug: true } } },
  })

  if (!section) throw new Error("Раздел не найден")

  await prisma.digestSection.delete({ where: { id } })

  revalidatePath(`/admin/issues/${section.issueId}`)
  revalidatePath(`/issues/${section.issue.number}`)
  revalidatePath(`/issues/${section.issue.slug}`)
}

export async function reorderSections(issueId: string, sectionIds: string[]) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Неавторизован")
  }

  await Promise.all(
    sectionIds.map((id, index) =>
      prisma.digestSection.update({
        where: { id },
        data: { order: index },
      })
    )
  )

  const issue = await prisma.digestIssue.findUnique({
    where: { id: issueId },
    select: { number: true, slug: true },
  })

  revalidatePath(`/admin/issues/${issueId}`)
  if (issue) {
    revalidatePath(`/issues/${issue.number}`)
    revalidatePath(`/issues/${issue.slug}`)
  }
}

// Block Actions
export async function createBlock(sectionId: string, data: { type: BlockType; content: unknown }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Неавторизован")
  }

  const parsed = CreateBlockSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.message)
  }

  // Validate content against type
  const contentWithType = { type: data.type, ...(data.content as object) }
  const contentParsed = BlockContentSchema.safeParse(contentWithType)
  if (!contentParsed.success) {
    throw new Error(contentParsed.error.message)
  }

  // Get the next order number
  const maxOrder = await prisma.contentBlock.aggregate({
    where: { sectionId },
    _max: { order: true },
  })

  const block = await prisma.contentBlock.create({
    data: {
      type: parsed.data.type,
      content: contentParsed.data,
      sectionId,
      order: (maxOrder._max.order || 0) + 1,
    },
  })

  const section = await prisma.digestSection.findUnique({
    where: { id: sectionId },
    include: { issue: { select: { number: true, slug: true, id: true } } },
  })

  if (section) {
    revalidatePath(`/admin/issues/${section.issueId}`)
    if (section.issue.number) {
      revalidatePath(`/issues/${section.issue.number}`)
    }
    if (section.issue.slug) {
      revalidatePath(`/issues/${section.issue.slug}`)
    }
  }

  return block
}

export async function updateBlock(id: string, data: { type: BlockType; content: unknown }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Неавторизован")
  }

  const parsed = UpdateBlockSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.message)
  }

  // Validate content against type
  const contentWithType = { type: data.type, ...(data.content as object) }
  const contentParsed = BlockContentSchema.safeParse(contentWithType)
  if (!contentParsed.success) {
    throw new Error(contentParsed.error.message)
  }

  const block = await prisma.contentBlock.update({
    where: { id },
    data: {
      type: parsed.data.type,
      content: contentParsed.data,
    },
  })

  const section = await prisma.digestSection.findUnique({
    where: { id: block.sectionId },
    include: { issue: { select: { number: true, slug: true, id: true } } },
  })

  if (section) {
    revalidatePath(`/admin/issues/${section.issueId}`)
    if (section.issue.number) {
      revalidatePath(`/issues/${section.issue.number}`)
    }
    if (section.issue.slug) {
      revalidatePath(`/issues/${section.issue.slug}`)
    }
  }

  return block
}

export async function deleteBlock(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Неавторизован")
  }

  const block = await prisma.contentBlock.findUnique({
    where: { id },
    include: { section: { include: { issue: { select: { number: true, slug: true, id: true } } } } },
  })

  if (!block) throw new Error("Блок не найден")

  await prisma.contentBlock.delete({ where: { id } })

  revalidatePath(`/admin/issues/${block.section.issueId}`)
  if (block.section.issue.number) {
    revalidatePath(`/issues/${block.section.issue.number}`)
  }
  if (block.section.issue.slug) {
    revalidatePath(`/issues/${block.section.issue.slug}`)
  }
}

export async function reorderBlocks(sectionId: string, blockIds: string[]) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Неавторизован")
  }

  await Promise.all(
    blockIds.map((id, index) =>
      prisma.contentBlock.update({
        where: { id },
        data: { order: index },
      })
    )
  )

  const section = await prisma.digestSection.findUnique({
    where: { id: sectionId },
    include: { issue: { select: { number: true, slug: true, id: true } } },
  })

  if (section) {
    revalidatePath(`/admin/issues/${section.issueId}`)
    if (section.issue.number) {
      revalidatePath(`/issues/${section.issue.number}`)
    }
    if (section.issue.slug) {
      revalidatePath(`/issues/${section.issue.slug}`)
    }
  }
}
