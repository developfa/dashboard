import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 환경 변수에서 설정된 이메일과 비밀번호 확인
        const validEmail = process.env.USER_EMAIL
        const validPassword = process.env.USER_PASSWORD

        if (!validEmail || !validPassword) {
          throw new Error("인증 설정이 올바르지 않습니다")
        }

        if (
          credentials?.email === validEmail &&
          credentials?.password === validPassword
        ) {
          // 인증 성공
          return {
            id: "1",
            email: validEmail,
            name: process.env.USER_NAME || "사용자",
          }
        }

        // 인증 실패
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
