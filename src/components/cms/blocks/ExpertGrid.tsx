import { ExpertGridBlockContent } from "@/lib/cms/schemas"
import Image from "next/image"

export default function ExpertGridBlock({ content }: { content: ExpertGridBlockContent }) {
  const { experts } = content

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {experts.map((expert, index) => (
        <div key={index} className="bg-white p-8 rounded-[24px] border shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-4">
            {expert.avatar && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400">
                <Image
                  src={expert.avatar}
                  alt={expert.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col">
              <h4 className="font-bold text-lg leading-tight">{expert.name}</h4>
              <p className="text-sm text-muted-foreground">{expert.role}</p>
            </div>
          </div>
          <div className="relative">
            <span className="absolute -top-4 -left-2 text-6xl text-yellow-100 font-serif leading-none -z-0">“</span>
            <p className="text-foreground leading-relaxed relative z-10 italic">
              {expert.insight}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
