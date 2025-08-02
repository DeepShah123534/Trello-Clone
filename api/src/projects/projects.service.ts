import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "./entities/project.entity";


@Injectable()
export class ProjectsService {
    constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async getUserProjects(id: number) {
    return await this.projectsRepository.find({ 
      where: { user: { id } }, 
      order : {
          features: {
            id: 'ASC',
            userStories: {
              id: 'ASC',
              tasks: {
                id: 'ASC',
              }
            }
          }
        },
      relations: [
      'features', 
      'features.userStories', 
      'features.userStories.tasks',
    ] 
  });
  }

  async getProjectById(id: number) {
    return await this.projectsRepository.findOne({ 
    where : { id },
    order : {
        features: {
          id: 'ASC',
          userStories: {
            id: 'ASC',
            tasks: {
              id: 'ASC',
            }
          }
        }
      },
    relations: [
      'features', 
      'features.userStories', 
      'features.userStories.tasks',
    ] 
    })
  }

  async createProject(name: string, description: string, userId: number) {
    await this.projectsRepository.save({
      name,
      description ,
      user: {
        id: userId,
      },
    });
    return await this.getUserProjects(userId);
  }
} 