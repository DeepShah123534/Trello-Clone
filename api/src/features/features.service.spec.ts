import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FeaturesService } from './features.service';
import { Feature } from './entities/feature.entity';
import { BadRequestException } from '@nestjs/common';

describe('FeaturesService', () => {
  let service: FeaturesService;

  const mockFeatureRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeaturesService, 
        {
          provide: getRepositoryToken(Feature),
          useValue: mockFeatureRepository,
        }
      ],
    }).compile();

    service = module.get<FeaturesService>(FeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("getProjectFeatures => should return a project's features and user stories based on passed in project id.", async() => {
    const projectId = 1;
    const features = [
        {
            id: 1,
            name: 'Feature 1',
            description: 'f1 description',
            userStories: [],
        },
        {
            id: 2,
            name: 'Feature 2',
            description: 'f2 description',
            userStories: [],
        },
    ] as unknown as Feature[];
    
    jest.spyOn(mockFeatureRepository, 'find').mockReturnValue(features);
    
    const result = await service.getProjectFeatures(projectId);
    
    expect(result).toEqual(features);
    expect(mockFeatureRepository.find).toHaveBeenCalled();
    expect(mockFeatureRepository.find).toHaveBeenCalledWith({
        where: { project: { id: projectId } },
        relations: ['userStories'],
    });
  });

  it("createFeature => should add a feature to a project (saving with scalar projectId) and return that project's features", async () => {
  const name = 'Feature 3';
  const description = 'f3 description';
  const projectId = 1;

  const savedFeature = {
    id: 3,
    name,
    description,
    projectId,       // 👈 matches service shape
  } as unknown as Feature;

  const features = [
    { id: 1, name: 'Feature 1', description: 'f1 description', userStories: [] },
    { id: 2, name: 'Feature 2', description: 'f2 description', userStories: [] },
    { id: 3, name: 'Feature 3', description: 'f3 description', userStories: [] },
  ] as unknown as Feature[];

  // async-safe mocks for TypeORM repository methods
  jest.spyOn(mockFeatureRepository, 'save').mockResolvedValue(savedFeature as any);
  jest.spyOn(mockFeatureRepository, 'find').mockResolvedValue(features as any);

  const result = await service.createFeature(name, description, projectId);

  // returns list of features for the project
  expect(result).toEqual(features);

  // saved with scalar foreign key (matches your service)
  expect(mockFeatureRepository.save).toHaveBeenCalledWith({
    name,
    description,
    projectId,       // 👈 expect scalar FK
  });

  // getProjectFeatures() still queries by relation shape
  expect(mockFeatureRepository.find).toHaveBeenCalledWith({
    where: { project: { id: projectId } },
    relations: ['userStories'],
  });
  });

  it('updateFeature => updates a feature name and returns the associated project id', async () => {
    const field = 'name';
    const value = 'Feature 4 - Edited';
    const userId = 15;
    const featureId = 4;
  
    const featureToUpdate = {
      id: 4,
      name: 'Feature 4',
      description: 'f4 description',
      project: {
        id: 2,
      },
    } as Feature;
  
    const updatedFeature = {
      id: 4,
      name: 'Feature 4 - Edited',
      description: 'f4 description',
      project: {
        id: 2,
      },
    } as Feature;


    jest.spyOn(mockFeatureRepository, 'findOne').mockReturnValue(featureToUpdate);
    jest.spyOn(mockFeatureRepository, 'save').mockReturnValue(updatedFeature);

    const result = await service.updateFeature(field, value, userId, featureId);

    expect(result).toEqual(2);
    expect(mockFeatureRepository.findOne).toHaveBeenCalled();
    expect(mockFeatureRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: featureId,
        project: { user: { id: userId } },
      },
      relations: ['project'],
    });
    expect(mockFeatureRepository.save).toHaveBeenCalled();
    expect(mockFeatureRepository.save).toHaveBeenCalledWith(featureToUpdate);
    
  });

  it('updateFeature => updates a feature description and returns the associated project id', async () => {
    const field = 'description';
    const value = 'Feature 4 description - Edited';
    const userId = 15;
    const featureId = 4;
      
    const featureToUpdate = {
      id: 4,
      name: 'Feature 4',
      description: 'f4 description',
      project: {
        id: 2,
      },
    } as Feature;
  
    const updatedFeature = {
      id: 4,
      name: 'Feature 4 - Edited',
      description: 'f4 description - edited',
      project: {
        id: 2,
      },
    } as Feature;
    jest.spyOn(mockFeatureRepository, 'findOne').mockReturnValue(featureToUpdate);
    jest.spyOn(mockFeatureRepository, 'save').mockReturnValue(updatedFeature); 
    const result = await service.updateFeature(field, value, userId, featureId)     
    expect(result).toEqual(2)  
    expect(mockFeatureRepository.findOne).toHaveBeenCalled();
    expect(mockFeatureRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: featureId,
        project: { user: { id: userId } },
      },
      relations: ['project'],
    });
    expect(mockFeatureRepository.save).toHaveBeenCalled();
    expect(mockFeatureRepository.save).toHaveBeenCalledWith(featureToUpdate);
    
  });

  it('updateFeature => throws an error when a feature is not found', async () => {
    const field = 'name';
    const value = 'Feature 4 -- Edited';
    const userId = 15;
    const featureId = 4;

    jest.spyOn(mockFeatureRepository, 'findOne').mockReturnValue(undefined);

    expect(async () => {
      await service.updateFeature(field, value, userId, featureId);
    }).rejects.toThrow(BadRequestException);
    expect(mockFeatureRepository.findOne).toHaveBeenCalled();
    expect(mockFeatureRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: featureId,
        project: { user: { id: userId } },
      },
      relations: ['project'],
    });

  });

  it('deleteFeature => deletes the feature found by the passed in id and returns the associated project id', async () => {
    const featureId = 4;
    const userId = 15;

    const featureToDelete = {
      id: 4,
      name: 'Feature 4',
      description: 'f4 description',
      project: { id: 2 },
    } as Feature;

    // Use async mocks for TypeORM methods
    jest.spyOn(mockFeatureRepository, 'findOne').mockResolvedValue(featureToDelete as any);
    jest.spyOn(mockFeatureRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

    const result = await service.deleteFeature(featureId, userId);

    expect(result).toEqual(2);

    expect(mockFeatureRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: featureId,
        project: { user: { id: userId } },
      },
      relations: ['project'],
    });


    expect(mockFeatureRepository.delete).toHaveBeenCalledWith({ id: featureId });
  });
  
  it('deleteFeature => throws an error when a feature is not found', async () => {
    const featureId = 4;
    const userId = 100;

    jest.spyOn(mockFeatureRepository, 'findOne').mockReturnValue(undefined);

    expect(async () => {
      await service.deleteFeature(featureId, userId);
    }).rejects.toThrow(BadRequestException);
    expect(mockFeatureRepository.findOne).toHaveBeenCalled();
    expect(mockFeatureRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: featureId,
        project: { user: { id: userId } },
      },
      relations: ['project'],
    });
  });

});
