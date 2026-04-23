import { RegulationBlockContent } from "@/lib/cms/schemas"
import { AlertCircleIcon, ShieldCheckIcon, ScaleIcon } from "lucide-react"

export default function RegulationBlock({ content }: { content: RegulationBlockContent }) {
  const { title, status, impact, summary } = content

  const getImpactColor = () => {
    switch (impact) {
      case "critical":
        return "bg-rose-100 text-rose-700 border-rose-200"
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
      <div className="flex items-center justify-between bg-slate-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <ScaleIcon className="w-5 h-5 text-slate-400" />
          <h4 className="font-bold text-slate-900 tracking-tight">{title}</h4>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getImpactColor()}`}>
          {impact} impact
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
              {status}
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Summary</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
