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
      name: 'Администратор',
      role: Role.ADMIN,
    },
  })

  await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      email: 'editor@example.com',
      name: 'Редактор',
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
      title: 'Стратегический брифинг за II квартал 2024 года',
      description: 'Всесторонний анализ рыночных тенденций, изменений в законодательстве и конкурентной разведки для современного предприятия.',
      status: IssueStatus.PUBLISHED,
      authorId: admin.id,
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426',
      sections: {
        create: [
          {
            title: 'Главные новости',
            order: 0,
            blocks: {
              create: [
                {
                  type: BlockType.TEXT,
                  order: 1,
                  content: {
                    type: BlockType.TEXT,
                    body: "Добро пожаловать в стратегический брифинг за II квартал 2024 года. В этом квартале мы наблюдаем беспрецедентное слияние зрелости генеративного ИИ и глобальных регуляторных изменений. В этом отчете представлены основные данные и идеи, необходимые вашей команде для навигации в предстоящие месяцы."
                  }
                },
                {
                  type: BlockType.KPI,
                  order: 2,
                  content: {
                    type: BlockType.KPI,
                    label: 'Сегмент ИИ в S&P 500',
                    value: '+24.3%',
                    trend: 'Выше среднего',
                    trendDirection: 'up'
                  }
                }
              ]
            }
          },
          {
            title: 'Показатели рынка',
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
                      { label: 'ЗОЛОТО', value: '$2,320.10', change: '+0.5%', trend: 'up' },
                      { label: 'НЕФТЬ BRENT', value: '$84.32', change: '-1.4%', trend: 'down' }
                    ]
                  }
                },
                {
                  type: BlockType.CHART,
                  order: 2,
                  content: {
                    type: BlockType.CHART,
                    title: 'Квартальный рост секторов',
                    chartType: 'area',
                    data: [
                      { name: 'Янв', tech: 400, energy: 240, health: 320 },
                      { name: 'Фев', tech: 300, energy: 139, health: 280 },
                      { name: 'Мар', tech: 500, energy: 980, health: 390 },
                      { name: 'Апр', tech: 680, energy: 390, health: 480 },
                    ]
                  }
                }
              ]
            }
          },
          {
            title: 'Нормативно-правовая база',
            order: 2,
            blocks: {
              create: [
                {
                  type: BlockType.REGULATION,
                  order: 1,
                  content: {
                    type: BlockType.REGULATION,
                    title: 'Закон ЕС об ИИ: Окончательная реализация',
                    status: 'Ратифицирован',
                    impact: 'high',
                    summary: 'Европейский парламент официально ратифицировал Закон об ИИ. Организации теперь должны классифицировать свои системы ИИ по уровню риска, при этом системы «высокого риска» потребуют строгих мер прозрачности и управления данными, начиная с 4 квартала 2024 года.'
                  }
                },
                {
                  type: BlockType.NOTES,
                  order: 2,
                  content: {
                    type: BlockType.NOTES,
                    title: 'Действия по обеспечению соответствия',
                    items: [
                      'Провести внутренний аудит всех интеграций LLM.',
                      'Назначить ответственного за конфиденциальность данных для операций в ЕС.',
                      'Разработать систему мониторинга предвзятости для моделей, ориентированных на клиентов.',
                      'Пересмотреть контракты с поставщиками на предмет положений о возмещении ущерба данным.'
                    ]
                  }
                }
              ]
            }
          },
          {
            title: 'Конкурентный анализ',
            order: 3,
            blocks: {
              create: [
                {
                  type: BlockType.TIMELINE,
                  order: 1,
                  content: {
                    type: BlockType.TIMELINE,
                    items: [
                      { date: '12 марта', title: 'Конкурент А запускает «Nexus»', description: 'Прямой конкурент нашему флагманскому продукту с интегрированными агентными рабочими процессами.' },
                      { date: '05 апреля', title: 'Крупная сделка M&A в сфере финтеха', description: 'Stripe покупает Bridge для укрепления инфраструктуры стейблкоинов.' },
                      { date: '18 мая', title: 'OpenAI представляет GPT-5 Alpha', description: 'Первые тесты показывают улучшение на 40% в решении сложных логических задач.' }
                    ]
                  }
                },
                {
                  type: BlockType.QUOTE,
                  order: 2,
                  content: {
                    type: BlockType.QUOTE,
                    text: "Инновации — это не только высокая скорость; это движение в правильном направлении, когда почва уходит у вас из-под ног.",
                    author: "Сатья Наделла",
                    source: "Саммит видения Microsoft"
                  }
                }
              ]
            }
          },
          {
            title: 'Панель экспертов',
            order: 4,
            blocks: {
              create: [
                {
                  type: BlockType.EXPERT_GRID,
                  order: 1,
                  content: {
                    type: BlockType.EXPERT_GRID,
                    experts: [
                      { name: 'Д-р Арис Торн', role: 'Главный ученый, NeuralPath', avatar: 'https://i.pravatar.cc/150?u=aris', insight: 'Переход от RAG к окнам с длинным контекстом упростит стек разработки, но увеличит затраты на вычисления.' },
                      { name: 'Сара Дженкинс', role: 'Венчурный партнер, Sequoia', avatar: 'https://i.pravatar.cc/150?u=sarah', insight: 'Мы ищем компании, которые владеют циклом данных, а не просто оболочкой модели.' },
                      { name: 'Маркус Чен', role: 'Технический директор, CyberSec Global', avatar: 'https://i.pravatar.cc/150?u=marcus', insight: 'Безопасность — это самое узкое место для внедрения ИИ на предприятиях сегодня. Решите эту проблему, и вы победите.' }
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
