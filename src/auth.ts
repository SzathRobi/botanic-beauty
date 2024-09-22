import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    signIn({ profile }) {
      return true
    },
  },
  trustHost: true,
  pages: {
    signIn: '/admin/bejelentkezes',
  },
})
