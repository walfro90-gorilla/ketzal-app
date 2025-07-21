import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

export const db = global.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = db;
}
