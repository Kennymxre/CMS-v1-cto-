import { KPIBlockContent } from "@/lib/cms/schemas"
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"

export default function KPIBlock({ content }: { content: KPIBlockContent }) {
  const { label, value, trend, trendDirection } = content

  const getTrendIcon = () => {
    switch (trendDirection) {
      case "up":
        return <ArrowUpIcon className="w-4 h-4 text-emerald-500" />
      case "down":
        return <ArrowDownIcon className="w-4 h-4 text-rose-500" />
      default:
        return <MinusIcon className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getTrendColor = () => {
    switch (trendDirection) {
      case "up":
        return "text-emerald-500 bg-emerald-50"
      case "down":
        return "text-rose-500 bg-rose-50"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  return (
    <div className="bg-white p-8 rounded-[24px] border shadow-sm flex flex-col gap-2">
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <div className="flex items-end gap-3">
        <h3 className="text-4xl font-bold text-foreground">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getTrendColor()}`}>
            {getTrendIcon()}
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}
