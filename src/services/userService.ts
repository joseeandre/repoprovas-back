import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../entities/User";
import Sessions from "../entities/Sessions";
import { v4 as uuid } from 'uuid';
import { create } from "node:domain";

interface SessionCreate {
  clientId: number;
  token: string;
}

export async function getUsers() {
  const users = await getRepository(User).find({
    select: ["id", "email"],
  });

  return users;
}

export async function loginUser(userId: number, name: string, email: string) {
  await getRepository(User).update({ id: userId }, { islogged: true });
  const token = uuid();
  const task: SessionCreate = {clientId: userId, token: token}
  await getRepository(Sessions).insert(task);
  const users = {
    name: name,
    email: email,
    id: userId,
    token: token,
  };

  return users;
}

