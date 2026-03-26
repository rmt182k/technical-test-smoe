import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column('text', { nullable: true })
  contact_info: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
