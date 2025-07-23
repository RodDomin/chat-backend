import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Column,
} from "typeorm";

import { User } from "src/user/entities";
import { FRIEND_STATUS } from "../utils/friends.util";

/**
 * Friend is a pivot table that enables a relationship 
 * between two different users
 */
@Entity({
  name: 'friend'
})
export class Friend extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  public sender: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'recipient_id' })
  public recipient: User;

  @Column({ nullable: true })
  public accepted_date: Date;

  @Column({ default: FRIEND_STATUS.PENDING })
  public status: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updatedAt: Date;
}