import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from "typeorm";

import { User } from "./user.entity";

@Entity({
  name: 'account_validation'
})
export class AccountValidation extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public token: string

  public isValid: boolean;

  @Column({
    name: 'valid_date'
  })
  public validDate: Date;

  @OneToOne(() => User, user => user.accountValidation, {
    cascade: true
  })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @OneToOne(() => User, user => user.accountValidation)
  @Column()
  public user_id: string

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updatedAt: Date;
}