import type { User } from '../generated/prisma/client';
import { prisma } from '../db';

export type CreateUserInput = {
  email: string;
  passwordHash: string;
  name?: string | null;
};

export function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export function createUser(input: CreateUserInput): Promise<User> {
  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash: input.passwordHash,
      name: input.name ?? null,
    },
  });
}
