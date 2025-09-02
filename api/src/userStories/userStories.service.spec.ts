import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserStoriesService } from './userStories.service';
import { UserStory } from './entities/userStory.entity';
import { BadRequestException } from '@nestjs/common';


describe('UserStoriesServices', () => {
  let service: UserStoriesService;

  const mockUserStoriesRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStoriesService, 
        {
          provide: getRepositoryToken(UserStory),
          useValue: mockUserStoriesRepository,
        },
      ],
    }).compile();

    service = module.get<UserStoriesService>(UserStoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getFeatureUserStories => should find user stories corresponding to a feature id.', async() => {
    const id = 3;
    const userStories = [
        {
            id: 11,
            name: 'User Story 11',
            description: ' US 11 Description',
            feature: {
                id: 3,
            },
        },
        {
            id: 12,
            name: 'User Story 12',
            description: ' US 12 Description',
            feature: {
                id: 3,
            },
        }
    ] as UserStory[];

    jest.spyOn(mockUserStoriesRepository, 'find').mockReturnValue(userStories);

    const result = await service.getFeatureUserStories(id);

    expect(result).toEqual(userStories);
    expect(mockUserStoriesRepository.find).toHaveBeenCalled();
    expect(mockUserStoriesRepository.find).toHaveBeenCalledWith({ where: { feature: { id }} });
  });

  it('createUserStory => save the user story that is passed in and return the list of user stories for the feature id was passed in', async() => {
    const name = "User Story 13";
    const description = "US 13 Description";
    const featureId = 3;

    const savedUserStory = {
      id: 13,
      name: 'User Story 13',
      description: 'US 13 Description',
      feature: {
        id: 3,
      },
    } as UserStory;

    const userStories = [
        {
            id: 11,
            name: 'User Story 11',
            description: ' US 11 Description',
            feature: {
                id: 3,
            },
        },
        {
            id: 12,
            name: 'User Story 12',
            description: ' US 12 Description',
            feature: {
                id: 3,
            },
        },
        {
          id: 13,
          name: 'User Story 13',
          description: 'US 13 Description',
          feature: {
            id: 3,
          },
        }
    ] as UserStory[];

    jest.spyOn(mockUserStoriesRepository, 'save').mockReturnValue(savedUserStory);
    jest.spyOn(mockUserStoriesRepository, 'find').mockReturnValue(userStories);

    const result = await service.createUserStory(name, description, featureId);

    expect(result).toEqual(userStories);
    expect(mockUserStoriesRepository.save).toHaveBeenCalled();
    expect(mockUserStoriesRepository.save).toHaveBeenCalledWith(
    {
      name,
      description ,
      featureId,
    });
    expect(mockUserStoriesRepository.find).toHaveBeenCalled();
    expect(mockUserStoriesRepository.find).toHaveBeenCalledWith(
      {
        where: {feature: {id: featureId}},
      });
  });

  it('getUsersStoryById => returns user story from an inputted user story id', async() => {
    const id = 1;
    const userStory = {
      name: 'User Story 1',
      description: 'US 1 Description',
      tasks:[ 
      {
        id: 1,
        name: 'Task 1',
        status: 'To Do', 
      },
      ],
    } as UserStory;

    jest.spyOn(mockUserStoriesRepository, 'findOne').mockReturnValue(userStory);

    const result = await service.getUsersStoryById(id);

    expect(result).toEqual(userStory);
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
       where: { id },
       relations: ['tasks'],
      });
  })

  it('getUsersStoryById => return the number of completed tasks out of the total number of tasks given user story id', async() => {
    const id = 1;
    const userStory = {
      name: 'User Story 1',
      description: 'US 1 Description',
      tasks:[ 
        {
          id: 1,
          name: 'Task 1',
          status: 'To Do', 
        },
        {
          id: 1,
          name: 'Task 2',
          status: 'In Progress', 
        },
        {
          id: 1,
          name: 'Task 3',
          status: 'To Do', 
        },
        {
          id: 1,
          name: 'Task 4',
          status: 'Done!', 
        },
        {
          id: 1,
          name: 'Task 5',
          status: 'In Progress', 
        },
      ],
    } as UserStory;

    jest.spyOn(mockUserStoriesRepository, 'findOne').mockReturnValue(userStory);

    const result = await service.getUserStoryById(id);

    expect(result).toEqual("1/5");
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
       where: { id },
       relations: ['tasks'],
      });
  });

  it('updateUserStory => updates a user story name and returns the associated project id', async () => {
      const field = 'name';
      const value = 'User Story 11 - Edited';
      const userId = 15;
      const userStoryId = 11;

      const storyToUpdate = {
          id: 11,
          name: 'User Story 11',
          description: 'us 11 description',
          feature: {
              id: 4,
              project: {
                  id: 2,
              },
          },
      } as UserStory;

      const updatedStory = {
        id: 11,
        name: 'User Story 11 -- Edited',
        description: 'us 11 description',
        feature: {
          id: 4,
          project: {
            id: 2,
          },
        },
      } as UserStory;

      jest
        .spyOn(mockUserStoriesRepository, 'findOne')
        .mockReturnValue(storyToUpdate);
      jest.spyOn(mockUserStoriesRepository, 'save').mockReturnValue(updatedStory);

      const result = await service.updateUserStory(
        field,
        value,
        userId,
        userStoryId,
      );

      expect(result).toEqual(2);
      expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
      expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: userStoryId,
          feature: { project: { user: { id: userId } } },
        },
        relations: ['feature', 'feature.project'],
      });
      expect(mockUserStoriesRepository.save).toHaveBeenCalled();
      expect(mockUserStoriesRepository.save).toHaveBeenCalledWith(storyToUpdate);


  });

  it('updateUserStory => updates a user story description and returns the associated project id', async () => {
      const field = 'description';
      const value = 'User Story 11 description - Edited';
      const userId = 15;
      const userStoryId = 11;

      const storyToUpdate = {
          id: 11,
          name: 'User Story 11',
          description: 'us 11 description',
          feature: {
              id: 4,
              project: {
                  id: 2,
              },
          },
      } as UserStory;

      const updatedStory = {
        id: 11,
        name: 'User Story 11',
        description: 'us 11 description - Edited',
        feature: {
          id: 4,
          project: {
            id: 2,
          },
        },
      } as UserStory;

      jest
        .spyOn(mockUserStoriesRepository, 'findOne')
        .mockReturnValue(storyToUpdate);
      jest.spyOn(mockUserStoriesRepository, 'save').mockReturnValue(updatedStory);

      const result = await service.updateUserStory(
        field,
        value,
        userId,
        userStoryId,
      );

      expect(result).toEqual(2);
      expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
      expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: userStoryId,
          feature: { project: { user: { id: userId } } },
        },
        relations: ['feature', 'feature.project'],
      });
      expect(mockUserStoriesRepository.save).toHaveBeenCalled();
      expect(mockUserStoriesRepository.save).toHaveBeenCalledWith(storyToUpdate);

  });

  it('updateUserStory => throws an error when a user story is not found.', async () => {
      const field = 'description';
      const value = 'User Story 11 description - Edited';
      const userId = 100;
      const userStoryId = 11;

      jest
        .spyOn(mockUserStoriesRepository, 'findOne')
        .mockReturnValue(undefined);

      expect(async() => {
        await service.updateUserStory(field, value, userId, userStoryId)
      }).rejects.toThrow(BadRequestException);
      expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
      expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: userStoryId,
          feature: { project: { user: { id: userId } } },
        },
        relations: ['feature', 'feature.project'],
      });
  });

  it('deleteUserStory => deletes the user story found by the passed in id and returns the associated project id', async () => {
    const userStoryId = 11;
    const userId = 15;

    const story = {
      id: 11,
      name: 'User Story 11',
      description: 'us 11 description',
      feature: { id: 4, project: { id: 2 } },
    } as UserStory;

    // async mocks
    jest.spyOn(mockUserStoriesRepository, 'findOne').mockResolvedValue(story);
    jest.spyOn(mockUserStoriesRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

    const result = await service.deleteUserStory(userStoryId, userId);

    expect(result).toEqual(2);

    expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: userStoryId,
        feature: { project: { user: { id: userId } } },
      },
      relations: ['feature', 'feature.project'],
    });

    expect(mockUserStoriesRepository.delete).toHaveBeenCalledWith({ id: userStoryId }); // ✅ match service
  });

  it('deleteUserStory => throws an error when a user story is not found', async () => {
    const userStoryId = 11;
    const userId = 100;

    jest.spyOn(mockUserStoriesRepository, 'findOne').mockReturnValue(undefined);

    expect(async () => {
      await service.deleteUserStory(userStoryId, userId);
    }).rejects.toThrow(BadRequestException);
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalled();
    expect(mockUserStoriesRepository.findOne).toHaveBeenCalledWith({
      where: {
        id: userStoryId,
        feature: { project: { user: { id: userId } } },
      },
      relations: ['feature', 'feature.project'],
    });
  });

});
