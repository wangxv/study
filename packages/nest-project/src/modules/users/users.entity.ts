import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PhotoEntity } from '../photo/photo.entity';
@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 20 })
  password: string;

  @Column()
  status: boolean;

  @OneToMany(() => PhotoEntity, (photo: any) => photo.user)
  photos: [];
}
