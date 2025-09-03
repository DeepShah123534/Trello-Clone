import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Feature } from "./entities/feature.entity";


@Injectable()
export class FeaturesService {
    constructor(
    @InjectRepository(Feature)
    private featuresRepository: Repository<Feature>,
  ) {}

  async getProjectFeatures(id: number) {
    return await this.featuresRepository.find({ where: { project: { id }}, relations: ['userStories'] });
    
  }

  async createFeature(name: string, description: string, projectId: number) {
    await this.featuresRepository.save({
      name,
      description ,
      projectId,
    });
    return await this.getProjectFeatures(projectId);
  }

  async updateFeature(field: string, value: string, userId: number, featureId: number) {
          const featureToUpdate = await this.featuresRepository.findOne({
            where: {
              id: featureId,
                  project: {
                    user: { id: userId }
                  }
            },
            relations: [ 'project'],
          });
  
          console.log('STORY TO UPDATE', featureToUpdate)
    
        if(featureToUpdate) {
          featureToUpdate[field] = value;
          const updatedFeature = await this.featuresRepository.save(featureToUpdate);
  
          console.log('UPDATED STORY', updatedFeature)
          return updatedFeature.project.id;
          
        } else {
          throw new BadRequestException('YOU CANNOT UPDATE THIS FEATURE');
        }
        
  }

  async deleteFeature(featureId: number, userId: number) {
      const featureToDelete = await this.featuresRepository.findOne({
        where: {
          id: featureId,
         project: { user: { id: userId }  }  },
        relations: ['project'],
      });

      if(featureToDelete) {
        await this.featuresRepository.delete({ id: featureId });
        return featureToDelete.project.id;
      
      } else {
        throw new BadRequestException('YOU CANNOT DELETE THIS FEATURE');
      }

    }
} 