import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("sessions")
export default class Sessions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: number;

  @Column()
  token: string;
}
