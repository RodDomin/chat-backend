import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

import { AccountValidation } from './account-validation.entity';
import { File } from 'src/files/files.entity';

@Entity({
  name: 'users'
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({
    width: 100
  })
  public status: string;

  @OneToOne(() => AccountValidation, av => av.user)
  @JoinColumn({ name: 'account_validation_id' })
  public accountValidation: AccountValidation;

  @OneToOne(() => File)
  @JoinColumn({ name: 'profile_pic_id' })
  public profile: File;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updatedAt: Date;
}
