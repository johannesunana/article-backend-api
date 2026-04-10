// import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaClient } from "@prisma/client";
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

export const loginUser = async (body) => {
  await prisma.user.findUnique({
    where: {email: body.email}
  });
};


// const newUser = await prisma.user.create({
//   data: body
// });

// const users = await prisma.user.findMany();