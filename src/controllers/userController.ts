import { Request, Response } from "express";
import { loginSchema, signUpSchema } from "../schemas/userSchemas";
import * as userService from "../services/userService";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { runInNewContext } from "vm";
import { getRepository } from "typeorm";
import User from "../entities/User";
import Sessions from "../entities/Sessions";

interface UserCreate {
  name: string;
  email: string;
  password: string;
  islogged: boolean;
}

export async function getUsers(req: Request, res: Response) {
  try {
    const user = await userService.getUsers();
    res.send(user);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { error } = loginSchema.validate(req.body);
    if (!error) {
      const { email, password } = req.body;
      const client = await getRepository(User).find({ email: req.body.email });
      if (
        client.length > 0 &&
        bcrypt.compareSync(password, client[0].password)
      ) {
        const users = await userService.loginUser(
          client[0].id,
          client[0].name,
          client[0].email
        );
        res.send(users);
      } else {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { error } = signUpSchema.validate(req.body);
    if (!error) {
      const { name, email, password } = req.body;
      const checkClient = await getRepository(User).find({ email });
      if (checkClient.length > 0) return res.sendStatus(409);

      const hash = bcrypt.hashSync(password, 10);
      const task: UserCreate = { name, email, password: hash, islogged: false };
      await getRepository(User).insert(task);
      res.sendStatus(201);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    if (!req.headers.authorization) return res.sendStatus(401);
    const token = req.headers.authorization.substring(7);
    const clientId = await getRepository(Sessions).find({ token });

    await getRepository(Sessions).delete({ clientId: clientId[0].clientId });
    await getRepository(User).update({ id: clientId[0].clientId }, { islogged: false });

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
