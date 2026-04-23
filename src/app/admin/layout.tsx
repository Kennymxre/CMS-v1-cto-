import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-yellow-200">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/admin" className="font-black text-2xl tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg" />
              <span>CMS<span className="text-slate-400">ADMIN</span></span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/admin/issues"
                className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
              >
                Выпуски
              </Link>
              <Link
                href="/admin/users"
                className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
              >
                Пользователи
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-sm font-bold">
                {session.user?.name || session.user?.email}
              </span>
              <span className="text-[10px] font-black uppercase tracking-tighter bg-yellow-400 px-1.5 py-0.5 rounded-sm">
                {((session.user as any)?.role === 'ADMIN' ? 'АДМИНИСТРАТОР' : 
                  (session.user as any)?.role === 'EDITOR' ? 'РЕДАКТОР' : 
                  (session.user as any)?.role === 'READER' ? 'ЧИТАТЕЛЬ' : 
                  (session.user as any)?.role || 'ГОСТЬ')}
              </span>
            </div>
            <form
              action={async () => {
                "use server"
                const { signOut } = await import("@/auth")
                await signOut()
              }}
            >
              <button
                type="submit"
                className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors border border-rose-200 px-4 py-2 rounded-full hover:bg-rose-50"
              >
                Выйти
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="container py-12">
        {children}
      </main>
    </div>
  )
}
