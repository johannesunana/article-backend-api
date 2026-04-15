import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export const createUser = async (body) => {
  return await prisma.user.create({ // data to insert, select to specify fields to return
    data: body,
    select: { 
      id: true,
      email: true,
      username: true,
      createdAt: true
     }
  });
};

export const findUserByEmail = async (body) => {
  return await prisma.user.findUnique({
    where: {
      email: body.email
    }
  });
};

export const findUserByUsername = async (body) => {
  return await prisma.user.findUnique({
    where: {
      username: body.username
    }
  });
};