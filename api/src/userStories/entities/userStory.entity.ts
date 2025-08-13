import { Feature } from 'src/features/entities/feature.entity';
import { Task } from 'src/task/entities/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class UserStory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Feature, (feature) => feature.userStories, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'featureId' })
  feature: Feature;

  @Column()
  featureId: number; 

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Task, (task) => task.userStory)
  tasks: Task[];

}