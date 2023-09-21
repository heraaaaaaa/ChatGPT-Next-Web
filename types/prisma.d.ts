import { PrismaClient as PrismaClientType } from '@prisma/client';

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClientType;
    }
  }
}

export {};

