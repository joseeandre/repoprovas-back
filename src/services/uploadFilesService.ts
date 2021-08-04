import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../entities/User";
import Sessions from "../entities/Sessions";
import { v4 as uuid } from "uuid";
import { create } from "node:domain";
import { storage } from "../firebase";

interface TestObject {
  name: string;
  disciplineId: number;
  teacherId: number;
  categoryId: number;
  id: number;
  fileName: string;
  userId: number
}

export async function getTests(testsDb: TestObject[]) {
  let testsAux: Object[] = [];
  const promises = testsDb.map(
    async (item) =>
      await storage
        .ref(item.fileName)
        .getDownloadURL()
        .then((response) => {
          testsAux.push({
            file: response,
            name: item.name,
            disciplineId: item.disciplineId,
            teacherId: item.teacherId,
            categoryId: item.categoryId,
            id: item.id,
            fileName: item.fileName
          });
        })
  );
  await Promise.all(promises);

  return testsAux;
}
