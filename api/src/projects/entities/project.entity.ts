import { Feature } from '../../features/entities/feature.entity';
import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE', eager: true }) // eager loads user automatically
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number; // Add this so you can filter easily in queries

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Feature, (feature) => feature.project)
  features: Feature[];

  // @Column({ default: 'To Do' })
  // status: string;

}