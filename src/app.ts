import "./setup";

import express from "express";
import cors from "cors";
import "reflect-metadata";

import connectDatabase from "./database";

import * as userController from "./controllers/userController";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/users", userController.getUsers);
app.post("/sign-in", userController.loginUser);
app.post("/sign-up", userController.createUser);

export async function init () {
  await connectDatabase();
}

export default app;
