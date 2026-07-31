import { NextAuthOptions } from 'auth.js'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '../prisma/client'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      issuer: 'https://accounts.google.com',
      authorization: {
        url: 'https://accounts.google.com/o/oauth2/v2/auth',
        params: {
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
      token: 'https://oauth2.googleapis.com/token',
      userinfo: 'https://www.googleapis.com/oauth2/v3/userinfo',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks: ['state', 'pkce'],
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.picture,
        }
      },
    },
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}