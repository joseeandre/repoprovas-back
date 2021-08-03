import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../entities/User";
import Sessions from "../entities/Sessions";
import { v4 as uuid } from "uuid";
import { create } from "node:domain";
import { storage } from "../firebase";

interface TestObject {
  name: string;
  discipline: string;
  teacher: string;
  category: string;
  id: number;
  fileName: string;
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
            discipline: item.discipline,
            teacher: item.teacher,
            category: item.category,
            id: item.id,
            fileName: item.fileName
          });
        })
  );
  await Promise.all(promises);

  return testsAux;
}
