// src/user/user.model.js

import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const publicUserSelect = {
  id: true,
  email: true,
  username: true,
  createdAt: true,
  updatedAt: true,
};

const authUserSelect = {
  ...publicUserSelect,
  password: true,
};

export const createUser = async (body) => {
  return await prisma.user.create({ // data to insert, select to specify fields to return
    data: body,
    select: publicUserSelect,
  });
};

export const findUserByEmail = async (body) => {
  if (!body.email) {
    return null;
    }
  return await prisma.user.findUnique({
    where: {
      email: body.email
    },
    select: publicUserSelect,
  });
};

export const findUserByUsername = async (body) => {
  if (!body.username) {
      return null;
    }
  return await prisma.user.findUnique({
    where: {
      username: body.username
    }
  });
};

export const getEmail = async (body) => {
  if (!body.email) {
    return null;
    }
  return await prisma.user.findUnique({
    where: {
      email: body.email
    },
    select: authUserSelect,
  });
};

export const getUsername = async (body) => {
  if (!body.username) {
      return null;
    }
  return await prisma.user.findUnique({
    where: {
      username: body.username
    },
    select: authUserSelect,
  });
};