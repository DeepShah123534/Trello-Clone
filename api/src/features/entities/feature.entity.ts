import { Project } from 'src/projects/entities/project.entity';
import { UserStory } from 'src/userStories/entities/userStory.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.features, { eager: true }) // eager loads user automatically
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  projectId: number; // Add this so you can filter easily in queries

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  // @Column({ default: 'To Do' })
  // status: string;

  @OneToMany(() => UserStory, (userStory) => userStory.feature)
  userStories: UserStory[];
  feature: any;
} 