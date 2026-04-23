import { MarketNewsBlockContent } from "@/lib/cms/schemas"
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"

export default function MarketNewsBlock({ content }: { content: MarketNewsBlockContent }) {
  const { items } = content

  return (
    <div className="bg-slate-900 p-8 rounded-[24px] text-white shadow-xl">
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-800 pb-4">
        Пульс рынка
      </h3>
      <div className="flex flex-col gap-4">
        {items.map((item, index) => {
          const trend = item.trend || (item.change.startsWith("+") ? "up" : item.change.startsWith("-") ? "down" : "neutral")

          return (
            <div key={index} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{item.label}</span>
                <span className="text-xl font-bold">{item.value}</span>
              </div>
              <div className={`flex items-center gap-1 font-bold ${
                trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-slate-400"
              }`}>
                {trend === "up" && <ArrowUpIcon className="w-4 h-4" />}
                {trend === "down" && <ArrowDownIcon className="w-4 h-4" />}
                {trend === "neutral" && <MinusIcon className="w-4 h-4" />}
                {item.change}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
