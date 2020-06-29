import { Column, PrimaryGeneratedColumn, Entity, BaseEntity } from "typeorm";

@Entity({
  name: 'files'
})
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;

  @Column({ name: 'original_name' })
  originalName: string;

  url: string;
  url_compressed: string;

  @Column()
  type: string;
}
