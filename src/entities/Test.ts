import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("files")
export default class Test{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  disciplineId: number;

  @Column()
  categoryId: number;

  @Column()
  teacherId: number;

  @Column()
  userId: number;

  @Column()
  fileName: string;

  @Column()
  index: string;
}