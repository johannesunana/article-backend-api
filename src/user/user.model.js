import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export const createUser = async (body) => {
  await prisma.user.create({
    data: body
  });
};

export const findUserByEmail = async (body) => {
  await prisma.user.findUnique({
    where: {
      email: body.email
    }
  });
};

export const findUserByUsername = async (body) => {
  await prisma.user.findUnique({
    where: {
      username: body.username
    }
  });
}