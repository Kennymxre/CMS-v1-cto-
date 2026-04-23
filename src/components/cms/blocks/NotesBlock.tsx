import { NotesBlockContent } from "@/lib/cms/schemas"
import { StickyNoteIcon } from "lucide-react"

export default function NotesBlock({ content }: { content: NotesBlockContent }) {
  const { title, items } = content

  return (
    <div className="my-8 p-6 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <StickyNoteIcon className="w-5 h-5 text-amber-600" />
        <h4 className="font-bold text-amber-900 uppercase tracking-tight">{title || "Основные выводы"}</h4>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3 text-amber-800">
            <span className="text-amber-400 font-bold">•</span>
            <span className="text-sm leading-relaxed italic">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
