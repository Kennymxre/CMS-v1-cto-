import { NewsCardBlockContent } from "@/lib/cms/schemas"
import Image from "next/image"

export default function NewsCardBlock({ content }: { content: NewsCardBlockContent }) {
  const { title, description, image, category, url } = content

  const CardWrapper = url ? "a" : "div"
  const wrapperProps = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {}

  return (
    <CardWrapper
      {...wrapperProps}
      className={`group block bg-white rounded-[28px] border overflow-hidden shadow-sm hover:shadow-md transition-all ${url ? "cursor-pointer" : ""}`}
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {category && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {category}
          </div>
        )}
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold text-foreground group-hover:text-yellow-600 transition-colors mb-3 leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </CardWrapper>
  )
}
