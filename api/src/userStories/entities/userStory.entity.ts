import { Feature } from 'src/features/entities/feature.entity';
import { Task } from 'src/task/entities/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class UserStory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Feature, (feature) => feature.userStories, { eager: true }) // eager loads user automatically
  @JoinColumn({ name: 'featureId' })
  feature: Feature;

  @Column()
  featureId: number; // Add this so you can filter easily in queries

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Task, (task) => task.userStory)
  tasks: Task[];

  // @Column({ default: 'To Do' })
  // status: string;
}