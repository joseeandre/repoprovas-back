import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("files")
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  discipline: string;

  @Column()
  category: string;

  @Column()
  teacher: string;

  @Column()
  userId: number;

  @Column()
  fileName: string;
}