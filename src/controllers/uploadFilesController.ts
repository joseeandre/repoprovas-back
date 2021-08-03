import { Request, Response } from "express";
import { loginSchema, signUpSchema } from "../schemas/userSchemas";
import * as userService from "../services/userService";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { runInNewContext } from "vm";
import { getRepository } from "typeorm";
import User from "../entities/User";
import Test from "../entities/Test";
import Sessions from "../entities/Sessions";
import { storage } from "../firebase";

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
    let { discipline, category, teacher, name, fileName } = req.body;
    const clientId = await getRepository(Sessions).find({ token });
    const testId = await (await getRepository(Test).insert({ discipline, category, teacher, name, userId: clientId[0].clientId, fileName })).generatedMaps[0];
    res.send({ id: testId.id});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function getTests(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) return res.sendStatus(401);
    const token = req.headers.authorization.substring(7);
    const testsDb = await getRepository(Test).find();
    let testsAux: Object[] = [];
    testsDb.forEach(
      (item) => {
      const url = storage.ref(item.fileName).getDownloadURL().then((response) => {
          testsAux.push({
              file: response,
              name: item.name,
              discipline: item.discipline,
              teacher: item.teacher,
              category: item.category,
              id: item.id
          });
      })
    });
    res.send(testsAux);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
