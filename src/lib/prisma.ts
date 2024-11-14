import { PrismaClient } from "@prisma/client";
import { withPulse } from "@prisma/extension-pulse";

export const prisma =
  (global as any).prisma ||
  new PrismaClient().$extends(withPulse({ apiKey: process.env.PULSE_API_KEY }));

if (process.env.NODE_ENV !== "production") (global as any).prisma = prisma;

export * from "@prisma/client";
