// src/user/user.model.js

import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export const createUser = async (body) => {
  return await prisma.user.create({ // data to insert, select to specify fields to return
    data: body,
    omit: {
      password: true                // exclude password field from returned data
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

export const loginEmail = async (body) => {
  return await prisma.user.findUnique({
    where: {
      email: body.email
    }
  });
};

export const loginUsername = async (body) => {
  return await prisma.user.findUnique({
    where: {
      username: body.username
    }
  });
};