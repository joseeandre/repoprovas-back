import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../entities/User";
import Sessions from "../entities/Sessions";
import { v4 as uuid } from "uuid";
import { create } from "node:domain";
import { storage } from "../firebase";
import Test from "../entities/Test";
import Discipline from "../entities/Discipline";
import Teacher from "../entities/Teacher";
import Category from "../entities/Category";

export async function getTests() {
  const testsDb = await getRepository(Test).find();
  let testsAux: Object[] = [];
  const promises = testsDb.map(async (item) => {
    const teacher = await getRepository(Teacher).find({ id: item.teacherId });
    const discipline = await getRepository(Discipline).find({
      id: item.disciplineId,
    });
    const category = await getRepository(Category).find({
      id: item.categoryId,
    });

    await storage
      .ref(item.fileName)
      .getDownloadURL()
      .then((response) => {
        testsAux.push({
          file: response,
          name: item.name,
          discipline: discipline[0].name,
          teacherId: teacher[0].name,
          categoryId: category[0].name,
          id: item.id,
          fileName: item.fileName,
          index: item.index,
        });
      });
  });
  await Promise.all(promises);

  return testsAux;
}

export async function getTeacher() {
  const teachers = await getRepository(Teacher).find();
  let teachersAux: Object[] = [];
  const promises = teachers.map(async (item) => {
    const teacherFiles = await getRepository(Test).find({ teacherId: item.id });
    if (teacherFiles.length > 0) {
      teachersAux.push({
        teacher: item.name,
        disciplines: teacherFiles.length,
      });
    }
  });
  await Promise.all(promises);

  return teachersAux;
}

export async function getCategories() {
  const tests = await getRepository(Test).find();
  const categories = await this.createQueryBuilder(Test).select('categoryId').distinct(true).getRawMany();
  // let categoriesAux: Object[] = [];
  // const promises = teachers.map(async (item) => {
  //   const teacherFiles = await getRepository(Test).find({ teacherId: item.id });
  //   teachersAux.push({
  //     teacher: item.name,
  //     disciplines: teacherFiles.length,
  //   });
  // });
  // await Promise.all(promises);
  console.log(categories)
  return categories;
}
