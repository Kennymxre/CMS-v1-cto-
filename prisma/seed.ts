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

  await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      email: 'editor@example.com',
      name: 'Editor User',
      role: Role.EDITOR,
    },
  })

  console.log('Users created')

  // 2. Create a "Master Digest" issue
  try {
    await prisma.digestIssue.delete({ where: { slug: 'master-digest-2024' } })
  } catch (e) {}

  const issue = await prisma.digestIssue.create({
    data: {
      number: 1,
      slug: 'master-digest-2024',
      title: 'The Q2 2024 Strategic Briefing',
      description: 'A comprehensive analysis of market trends, regulatory shifts, and competitive intelligence for the modern enterprise.',
      status: IssueStatus.PUBLISHED,
      authorId: admin.id,
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426',
      sections: {
        create: [
          {
            title: 'Hero Highlights',
            order: 0,
            blocks: {
              create: [
                {
                  type: BlockType.TEXT,
                  order: 1,
                  content: {
                    type: BlockType.TEXT,
                    body: "Welcome to the Q2 2024 Strategic Briefing. This quarter, we're seeing an unprecedented convergence of generative AI maturity and global regulatory shifts. This report breaks down the essential data points and insights your team needs to navigate the upcoming months."
                  }
                },
                {
                  type: BlockType.KPI,
                  order: 2,
                  content: {
                    type: BlockType.KPI,
                    label: 'S&P 500 AI Segment',
                    value: '+24.3%',
                    trend: 'Above Average',
                    trendDirection: 'up'
                  }
                }
              ]
            }
          },
          {
            title: 'Market Performance',
            order: 1,
            blocks: {
              create: [
                {
                  type: BlockType.MARKET_NEWS,
                  order: 1,
                  content: {
                    type: BlockType.MARKET_NEWS,
                    items: [
                      { label: 'NASDAQ 100', value: '18,210.45', change: '+1.8%', trend: 'up' },
                      { label: 'DOW JONES', value: '38,904.04', change: '-0.2%', trend: 'down' },
                      { label: 'GOLD', value: '$2,320.10', change: '+0.5%', trend: 'up' },
                      { label: 'CRUDE OIL', value: '$84.32', change: '-1.4%', trend: 'down' }
                    ]
                  }
                },
                {
                  type: BlockType.CHART,
                  order: 2,
                  content: {
                    type: BlockType.CHART,
                    title: 'Quarterly Sector Growth',
                    chartType: 'area',
                    data: [
                      { name: 'Jan', tech: 400, energy: 240, health: 320 },
                      { name: 'Feb', tech: 300, energy: 139, health: 280 },
                      { name: 'Mar', tech: 500, energy: 980, health: 390 },
                      { name: 'Apr', tech: 680, energy: 390, health: 480 },
                    ]
                  }
                }
              ]
            }
          },
          {
            title: 'Regulatory Landscape',
            order: 2,
            blocks: {
              create: [
                {
                  type: BlockType.REGULATION,
                  order: 1,
                  content: {
                    type: BlockType.REGULATION,
                    title: 'EU AI Act: Final Implementation',
                    status: 'Ratified',
                    impact: 'high',
                    summary: 'The European Parliament has officially ratified the AI Act. Organizations must now classify their AI systems by risk level, with "High Risk" systems requiring strict transparency and data governance measures starting Q4 2024.'
                  }
                },
                {
                  type: BlockType.NOTES,
                  order: 2,
                  content: {
                    type: BlockType.NOTES,
                    title: 'Action Items for Compliance',
                    items: [
                      'Conduct an internal audit of all LLM integrations.',
                      'Assign a dedicated Data Privacy Officer for EU operations.',
                      'Establish a bias-monitoring framework for customer-facing models.',
                      'Review vendor contracts for data indemnity clauses.'
                    ]
                  }
                }
              ]
            }
          },
          {
            title: 'Competitive Analysis',
            order: 3,
            blocks: {
              create: [
                {
                  type: BlockType.TIMELINE,
                  order: 1,
                  content: {
                    type: BlockType.TIMELINE,
                    items: [
                      { date: 'March 12', title: 'Competitor A Launches "Nexus"', description: 'A direct competitor to our flagship product with integrated agentic workflows.' },
                      { date: 'April 05', title: 'Major M&A in Fintech', description: 'Stripe acquires Bridge to bolster stablecoin infrastructure.' },
                      { date: 'May 18', title: 'OpenAI Reveals GPT-5 Alpha', description: 'Early benchmarks suggest a 40% improvement in complex reasoning tasks.' }
                    ]
                  }
                },
                {
                  type: BlockType.QUOTE,
                  order: 2,
                  content: {
                    type: BlockType.QUOTE,
                    text: "Innovation is not just about moving fast; it's about moving in the right direction when the ground is shifting beneath you.",
                    author: "Satya Nadella",
                    source: "Microsoft Vision Summit"
                  }
                }
              ]
            }
          },
          {
            title: 'The Expert Panel',
            order: 4,
            blocks: {
              create: [
                {
                  type: BlockType.EXPERT_GRID,
                  order: 1,
                  content: {
                    type: BlockType.EXPERT_GRID,
                    experts: [
                      { name: 'Dr. Aris Thorne', role: 'Chief Scientist, NeuralPath', avatar: 'https://i.pravatar.cc/150?u=aris', insight: 'The move from RAG to long-context windows will simplify developer stacks but increase compute costs.' },
                      { name: 'Sarah Jenkins', role: 'Venture Partner, Sequoia', avatar: 'https://i.pravatar.cc/150?u=sarah', insight: 'We are looking for companies that own the data loop, not just the model wrapper.' },
                      { name: 'Marcus Chen', role: 'CTO, CyberSec Global', avatar: 'https://i.pravatar.cc/150?u=marcus', insight: 'Security is the biggest bottleneck for enterprise AI adoption today. Solve that, and you win.' }
                    ]
                  }
                },
                {
                  type: BlockType.DIVIDER,
                  order: 2,
                  content: {
                    type: BlockType.DIVIDER,
                    style: 'stars'
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  console.log('Master Digest issue created')
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
