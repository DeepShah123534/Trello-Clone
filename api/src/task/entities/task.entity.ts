import { UserStory } from 'src/userStories/entities/userStory.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserStory, (userStory) => userStory.tasks, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userStoryId' })
  userStory: UserStory;

  @Column()
  name: string;

  @Column({ default: 'To Do' })
  status: string;
}