import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true, nullable: true })
  code: string;

  @Column('text')
  description: string;

  @Column({ length: 50 })
  material_type: string;

  @Column({ length: 20 })
  default_uom: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
