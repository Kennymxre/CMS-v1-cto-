import { notFound } from "next/navigation"
import Image from "next/image"
import { getIssueBySlug } from "@/lib/actions/cms"
import { BlockRenderer } from "@/components/cms/BlockRenderer"
import type { BlockContent } from "@/lib/cms/schemas"

interface IssuePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: IssuePageProps) {
  const { slug } = await params
  const issue = await getIssueBySlug(slug)

  if (!issue) {
    return { title: "Issue Not Found" }
  }

  return {
    title: `${issue.title} | Premium Editorial`,
    description: issue.description || `Digest Issue #${issue.number}`,
  }
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { slug } = await params
  const issue = await getIssueBySlug(slug)

  if (!issue) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-yellow-200">
      {/* Sticky Pill Navigation */}
      <nav className="sticky top-6 z-50 flex justify-center px-4 pointer-events-none">
        <div className="flex items-center gap-1 p-1.5 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full shadow-2xl pointer-events-auto overflow-x-auto no-scrollbar max-w-full">
          <a href="#hero" className="px-4 py-2 text-sm font-bold rounded-full hover:bg-slate-100 transition-colors whitespace-nowrap">
            Top
          </a>
          {issue.sections.map((section) => (
            <a
              key={section.id}
              href={`#section-${section.id}`}
              className="px-4 py-2 text-sm font-medium text-slate-600 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all whitespace-nowrap"
            >
              {section.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-32 overflow-hidden scroll-mt-24">
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-black uppercase tracking-[0.2em] rounded-sm">
                  Premium Edition
                </span>
                <span className="text-slate-400 font-mono text-sm">Issue No. {issue.number}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-slate-950">
                {issue.title}
              </h1>
              {issue.description && (
                <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mt-8">
                  {issue.description}
                </p>
              )}
            </div>

            {issue.coverImage && (
              <div className="relative w-full aspect-[21/9] mt-16 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src={issue.coverImage}
                  alt={issue.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}
            
            {/* Featured Quote Overlay or Accent */}
            <div className="mt-12 flex flex-col items-center gap-4">
               <div className="w-12 h-1.5 bg-yellow-400 rounded-full" />
               <p className="text-sm uppercase tracking-[0.3em] font-bold text-slate-400">Scroll to explore</p>
            </div>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-yellow-100/50 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-100/30 blur-[100px] rounded-full -z-10" />
      </section>

      {/* Content Sections */}
      <main className="pb-32">
        {issue.sections.map((section, sectionIndex) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            className="py-24 md:py-32 border-t border-slate-200/60 first:border-t-0 scroll-mt-24"
          >
            <div className="container">
              <div className="flex flex-col gap-16">
                {/* Section Header */}
                <div className="flex flex-col gap-4">
                   <span className="text-yellow-500 font-mono font-bold text-lg">0{sectionIndex + 1}</span>
                   <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900">
                    {section.title}
                  </h2>
                </div>

                {/* Section Blocks */}
                <div className="grid grid-cols-1 gap-12 max-w-5xl">
                  {section.blocks.map((block) => (
                    <div key={block.id} className="w-full">
                      <BlockRenderer
                        content={block.content as BlockContent}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {issue.sections.length === 0 && (
          <div className="container text-center py-32">
            <p className="text-2xl text-slate-400 font-medium">This issue is currently empty.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tighter">Daily Digest<span className="text-yellow-400">.</span></h3>
              <p className="text-slate-400 max-w-xs text-lg">
                Premium insights for the modern professional, delivered with editorial excellence.
              </p>
            </div>
            <div className="flex gap-16">
               <div className="space-y-4">
                 <h4 className="font-bold uppercase tracking-widest text-xs text-slate-500">Navigation</h4>
                 <ul className="space-y-2 font-medium">
                   <li><a href="/" className="hover:text-yellow-400 transition-colors">Home</a></li>
                   <li><a href="/issues" className="hover:text-yellow-400 transition-colors">Archive</a></li>
                   <li><a href="/about" className="hover:text-yellow-400 transition-colors">About</a></li>
                 </ul>
               </div>
               <div className="space-y-4">
                 <h4 className="font-bold uppercase tracking-widest text-xs text-slate-500">Admin</h4>
                 <ul className="space-y-2 font-medium">
                   <li><a href="/admin" className="hover:text-yellow-400 transition-colors">Dashboard</a></li>
                   <li><a href="/admin/issues" className="hover:text-yellow-400 transition-colors">Management</a></li>
                 </ul>
               </div>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-slate-900 flex justify-between items-center text-slate-500 text-sm font-medium">
            <p>© {new Date().getFullYear()} Daily Digest Media Group.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
