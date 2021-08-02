import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("clients")
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  islogged: boolean;
}
