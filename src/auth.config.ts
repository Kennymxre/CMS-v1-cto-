import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnApi = nextUrl.pathname.startsWith("/api")

      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to sign-in page
      }

      if (isOnApi && nextUrl.pathname.startsWith("/api/admin")) {
        if (isLoggedIn) return true
        return false
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig