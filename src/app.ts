import "./setup";

import express from "express";
import cors from "cors";
import "reflect-metadata";

import connectDatabase from "./database";

import * as userController from "./controllers/userController";
import * as uploadFilesController from "./controllers/uploadFilesController";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/users", userController.getUsers);
app.post("/sign-in", userController.loginUser);
app.post("/sign-up", userController.createUser);
app.post("/logout", userController.logoutUser);
app.post("/upload", uploadFilesController.uploadTest);
app.get("/tests", uploadFilesController.getTests);
app.get("/disciplines", uploadFilesController.getDisciplines;
app.get("/teachers/:id", uploadFilesController.getTeachers);


export async function init () {
  await connectDatabase();
}

export default app;
