import { TimelineBlockContent } from "@/lib/cms/schemas"

export default function TimelineBlock({ content }: { content: TimelineBlockContent }) {
  const { items } = content

  return (
    <div className="py-8">
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {items.map((item, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            {/* Dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-400 group-hover:bg-indigo-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-150">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            {/* Content */}
            <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-slate-900">{item.title}</div>
                <time className="font-serif italic text-indigo-500 text-sm">{item.date}</time>
              </div>
              <div className="text-slate-500 text-sm">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
