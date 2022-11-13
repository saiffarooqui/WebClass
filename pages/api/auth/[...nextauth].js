import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import connectDatabase from '../../../lib/db';
import User from '../../../models/User';
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
