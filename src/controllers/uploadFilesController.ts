import { Request, Response } from "express";
import { loginSchema, signUpSchema } from "../schemas/userSchemas";
import * as userService from "../services/userService";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { runInNewContext } from "vm";
import { getRepository } from "typeorm";
import User from "../entities/User";
import { auth, storage, db } from "../firebase";
import Test from "../entities/Test";
import Sessions from "../entities/Sessions";

interface TestCreate {
  name: string;
  discipline: string;
  category: string;
  teacher: string;
  userId: number;
}

export async function uploadTest(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) return res.sendStatus(401);
    const token = req.headers.authorization.substring(7);
    const { file, discipline, category, teacher, name } = req.body;
    const clientId = await getRepository(Sessions).find({ token });
    const testId = await (await getRepository(Test).insert({ discipline, category, teacher, name, userId: clientId[0].clientId })).generatedMaps[0];

    const fileRef = storage.ref().child(testId.id);
    await fileRef.put(file);
    const user = await userService.getUsers();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
