import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserStory } from "./entities/userStory.entity";


@Injectable()
export class UserStoriesService {
    constructor(
    @InjectRepository(UserStory)
    private userStoriesRepository: Repository<UserStory>,
  ) {}

  async getFeatureUserStories(id: number) {
    return await this.userStoriesRepository.find({ where: { feature: { id }} });
  }

  async createUserStory(name: string, description: string, featureId: number) {
    await this.userStoriesRepository.save({
      name,
      description ,
      featureId,
    });
    return await this.getFeatureUserStories(featureId);
  }

  async getUserStoryById(id: number) {
    const userStory = await this.userStoriesRepository.findOne({
       where: { id },
       relations: ['tasks'],
      });

    if (!userStory) {
      console.log('User story not found');
      return;
    }

    const tasks = userStory.tasks;
    const taskCount = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Done!'); 
    const completedTasksLength = completedTasks.length;

    return `${completedTasksLength}/${taskCount}`;
  }

  async getUsersStoryById(id: number) {
    return await this.userStoriesRepository.findOne({
       where: { id },
       relations: ['tasks'],
      });
  }

    async updateUserStory(field: string, value: string, userId: number, userStoryId: number) {
        const storyToUpdate = await this.userStoriesRepository.findOne({
          where: {
            id: userStoryId,
  
              feature: {
                project: {
                  user: { id: userId }
                }
              }
            
          },
          relations: [ 'feature', 'feature.project'],
        });

        console.log('STORY TO UPDATE', storyToUpdate)
  
      if(storyToUpdate) {
        storyToUpdate[field] = value;
        const updatedStory = await this.userStoriesRepository.save(storyToUpdate);

        console.log('UPDATED STORY', updatedStory)
        return updatedStory.feature.project.id;
        
      } else {
        throw new BadRequestException('YOU CANNOT UPDATE THIS USER STORY');
      }
      
    }

    async deleteUserStory(userStoryId:number, userId: number) {
      const storyToDelete = await this.userStoriesRepository.findOne({
        where: {
          id: userStoryId,
          feature: { project: { user: { id: userId } } }  },
        relations: [ 'feature', 'feature.project'],
      });

      if(storyToDelete) {
        await this.userStoriesRepository.delete({ id: userStoryId });
        return storyToDelete.feature.project.id;
      
      } else {
        throw new BadRequestException('YOU CANNOT DELETE THIS USER STORY');
      }

    }
} 