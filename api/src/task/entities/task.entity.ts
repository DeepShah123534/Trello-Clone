import { UserStory } from 'src/userStories/entities/userStory.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserStory, (userStory) => userStory.tasks, { eager: true }) // eager loads user automatically
  @JoinColumn({ name: 'featureId' })
  userStory: UserStory

  @Column()
  name: string;

  @Column({ default: 'To Do' })
  status: string;
}