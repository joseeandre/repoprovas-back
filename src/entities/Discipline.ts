import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("disciplines")
export default class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryId: number;

  @Column()
  name: string;
}
