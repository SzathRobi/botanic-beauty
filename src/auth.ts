import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedEmails = ["szathrobi98@gmail.com"];

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    signIn({ profile }) {
      if (!allowedEmails.includes(profile?.email as string)) {
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: "/admin/bejelentkezes",
  },
});
