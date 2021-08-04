import { Request, Response } from "express";
import { loginSchema, signUpSchema } from "../schemas/userSchemas";
import * as userService from "../services/userService";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { runInNewContext } from "vm";
import { getRepository } from "typeorm";
import User from "../entities/User";
import Test from "../entities/Test";
import Discipline from "../entities/Discipline";
import Teacher from "../entities/Teacher";
import Sessions from "../entities/Sessions";
import { storage } from "../firebase";
import * as uploadFilesService from "../services/uploadFilesService";

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
    const disciplineId = await getRepository(Discipline).find({ name: discipline });
    const teacherId = await getRepository(Teacher).find({ name: teacher });
    const testId = (
      await getRepository(Test).insert({
        disciplineId: disciplineId[0].id,
        categoryId: disciplineId[0].categoryId,
        teacherId: teacherId[0].id,
        name,
        userId: clientId[0].clientId,
        fileName,
      })
    ).generatedMaps[0];
    res.send({ id: testId.id });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function getTests(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) return res.sendStatus(401);
    const token = req.headers.authorization.substring(7);
    const tests = await uploadFilesService.getTests();
    console.log(tests)
    res.send(tests);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function getDisciplines(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) return res.sendStatus(401);
    const token = req.headers.authorization.substring(7);
    const disciplines = await getRepository(Discipline).find();
    res.send(disciplines);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function getTeachers(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) return res.sendStatus(401);
    const name = req.params.id;
    const token = req.headers.authorization.substring(7);
    const disciplineId = await getRepository(Discipline).find({ name });
    const teachers = await getRepository(Teacher).find({disciplineId: disciplineId[0].id});
    res.send(teachers);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function getTeacher(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) return res.sendStatus(401);
    const name = req.params.id;
    const token = req.headers.authorization.substring(7);
    const teachers = await uploadFilesService.getTeacher();
    res.send(teachers);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
