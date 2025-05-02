import 'next-auth';
import { User as PrismaUser, SME } from '@prisma/client';

declare module 'next-auth' {
  interface User extends Omit<PrismaUser, 'password'> {
    sme?: SME;
  }

  interface Session {
    user: User;
  }
}