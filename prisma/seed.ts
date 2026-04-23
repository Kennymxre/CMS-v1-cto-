import { PrismaClient, Role, IssueStatus, BlockType } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import "dotenv/config"

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: Role.ADMIN,
    },
  })

  const editor = await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      email: 'editor@example.com',
      name: 'Editor User',
      role: Role.EDITOR,
    },
  })

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: {},
    create: {
      email: 'viewer@example.com',
      name: 'Viewer User',
      role: Role.VIEWER,
    },
  })

  console.log('Users created')

  // 2. Create a "Premium Editorial" issue
  // Delete existing to avoid conflicts during development
  try {
    await prisma.digestIssue.delete({ where: { slug: 'premium-editorial-issue' } })
  } catch (e) {}

  const issue = await prisma.digestIssue.create({
    data: {
      number: 1,
      slug: 'premium-editorial-issue',
      title: 'The Future of Digital Media',
      description: 'An in-depth look at the shifting landscape of digital journalism and premium content.',
      status: IssueStatus.PUBLISHED,
      authorId: admin.id,
      sections: {
        create: [
          {
            title: 'Market Overview',
            order: 1,
            blocks: {
              create: [
                {
                  type: BlockType.KPI,
                  order: 1,
                  content: {
                    type: BlockType.KPI,
                    label: 'Total Revenue',
                    value: '$4.2M',
                    trend: '+12%',
                    trendDirection: 'up'
                  },
                },
                {
                  type: BlockType.CHART,
                  order: 2,
                  content: {
                    type: BlockType.CHART,
                    title: 'Revenue Growth',
                    chartType: 'area',
                    data: [
                      { name: 'Jan', value: 400 },
                      { name: 'Feb', value: 300 },
                      { name: 'Mar', value: 600 },
                      { name: 'Apr', value: 800 },
                      { name: 'May', value: 700 },
                      { name: 'Jun', value: 900 },
                    ]
                  },
                }
              ]
            }
          },
          {
            title: 'Top Stories',
            order: 2,
            blocks: {
              create: [
                {
                  type: BlockType.NEWS_CARD,
                  order: 1,
                  content: {
                    type: BlockType.NEWS_CARD,
                    title: 'The Rise of Niche Publications',
                    description: 'How small, focused teams are capturing high-value audiences through deep expertise and community building.',
                    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800',
                    category: 'Business',
                  }
                },
                {
                  type: BlockType.MARKET_NEWS,
                  order: 2,
                  content: {
                    type: BlockType.MARKET_NEWS,
                    items: [
                      { label: 'NASDAQ', value: '15,000', change: '+1.2%', trend: 'up' },
                      { label: 'S&P 500', value: '4,500', change: '-0.5%', trend: 'down' },
                      { label: 'Bitcoin', value: '$65,000', change: '+5.4%', trend: 'up' },
                    ]
                  }
                }
              ]
            }
          },
          {
            title: 'Expert Insights',
            order: 3,
            blocks: {
              create: [
                {
                  type: BlockType.EXPERT_GRID,
                  order: 1,
                  content: {
                    type: BlockType.EXPERT_GRID,
                    experts: [
                      { name: 'Jane Doe', role: 'CEO, MediaCorp', avatar: 'https://i.pravatar.cc/150?u=jane', insight: 'The subscription model is only just beginning. We will see more vertical integration soon.' },
                      { name: 'John Smith', role: 'Analyst, TechWatch', avatar: 'https://i.pravatar.cc/150?u=john', insight: 'AI will redefine editorial workflows by 2025, but human judgment remains the premium asset.' },
                      { name: 'Alice Wong', role: 'Founder, Substacker', avatar: 'https://i.pravatar.cc/150?u=alice', insight: 'Community is the new moat. Content is just the entry point.' },
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  console.log('Premium Editorial issue created')
  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
