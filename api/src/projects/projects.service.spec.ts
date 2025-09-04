import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';


describe('ProjectsService', () => {
  let service: ProjectsService;

  const mockUserProjectsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService, 
        {
          provide: getRepositoryToken(Project),
          useValue: mockUserProjectsRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStatusesToProject', () => {
    const project = {
      id: 1,
      name: 'Project 1',
      description: 'p1 description',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
                {
                  id: 2,
                  name: 'Task 2',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 2,
              name: 'User Story 2',
              description: 'us2 description',
              tasks: [
                {
                  id: 3,
                  name: 'Task 3',
                  status: 'In Progress',
                },
                {
                  id: 4,
                  name: 'Task 4',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Feature 2',
          description: 'f2 description',
          userStories: [
            {
              id: 3,
              name: 'User Story 3',
              description: 'us3 description',
              tasks: [
                {
                  id: 5,
                  name: 'Task 5',
                  status: 'To Do',
                },
                {
                  id: 6,
                  name: 'Task 6',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 4,
              name: 'User Story 4',
              description: 'us4 description',
              tasks: [
                {
                  id: 7,
                  name: 'Task 7',
                  status: 'Done!',
                },
                {
                  id: 8,
                  name: 'Task 8',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
      ],
    } as Project;

    const projectWithStatuses = {
      id: 1,
      name: 'Project 1',
      description: 'p1 description',
      status: 'In Progress',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStoriesCount: 2,
          completedUserStories: 0,
          status: 'In Progress',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              taskCount: 2,
              completedTask: 0,
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
                {
                  id: 2,
                  name: 'Task 2',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 2,
              name: 'User Story 2',
              description: 'us2 description',
              taskCount: 2,
              completedTask: 1,
              tasks: [
                {
                  id: 3,
                  name: 'Task 3',
                  status: 'In Progress',
                },
                {
                  id: 4,
                  name: 'Task 4',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Feature 2',
          description: 'f2 description',
          userStoriesCount: 2,
          completedUserStories: 1,
          status: 'In Progress',
          userStories: [
            {
              id: 3,
              name: 'User Story 3',
              description: 'us3 description',
              taskCount: 2,
              completedTask: 0,
              tasks: [
                {
                  id: 5,
                  name: 'Task 5',
                  status: 'To Do',
                },
                {
                  id: 6,
                  name: 'Task 6',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 4,
              name: 'User Story 4',
              description: 'us4 description',
              taskCount: 2,
              completedTask: 2,
              tasks: [
                {
                  id: 7,
                  name: 'Task 7',
                  status: 'Done!',
                },
                {
                  id: 8,
                  name: 'Task 8',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
      ],
    };

    const result = service.addStatusesToProject(project);
    expect(result).toEqual(projectWithStatuses);
  });

  it('getUserProjects => returns a users projects based on their passed in id', async() => {
    const id = 15;

    const projects = [
      {
      id: 1,
      name: 'Project 1',
      description: 'p1 description',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
                {
                  id: 2,
                  name: 'Task 2',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 2,
              name: 'User Story 2',
              description: 'us2 description',
              tasks: [
                {
                  id: 3,
                  name: 'Task 3',
                  status: 'In Progress',
                },
                {
                  id: 4,
                  name: 'Task 4',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Feature 2',
          description: 'f2 description',
          userStories: [
            {
              id: 3,
              name: 'User Story 3',
              description: 'us3 description',
              tasks: [
                {
                  id: 5,
                  name: 'Task 5',
                  status: 'To Do',
                },
                {
                  id: 6,
                  name: 'Task 6',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 4,
              name: 'User Story 4',
              description: 'us4 description',
              tasks: [
                {
                  id: 7,
                  name: 'Task 7',
                  status: 'Done!',
                },
                {
                  id: 8,
                  name: 'Task 8',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Project 2',
      description: 'p2 description',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
              ],
            },
          ],
        },
      ],
    }
    ] as Project[]; 

    const projectsWithStatuses = [
    {
      id: 1,
      name: 'Project 1',
      description: 'p1 description',
      status: 'In Progress',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStoriesCount: 2,
          completedUserStories: 0,
          status: 'In Progress',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              taskCount: 2,
              completedTask: 0,
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
                {
                  id: 2,
                  name: 'Task 2',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 2,
              name: 'User Story 2',
              description: 'us2 description',
              taskCount: 2,
              completedTask: 1,
              tasks: [
                {
                  id: 3,
                  name: 'Task 3',
                  status: 'In Progress',
                },
                {
                  id: 4,
                  name: 'Task 4',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Feature 2',
          description: 'f2 description',
          userStoriesCount: 2,
          completedUserStories: 1,
          status: 'In Progress',
          userStories: [
            {
              id: 3,
              name: 'User Story 3',
              description: 'us3 description',
              taskCount: 2,
              completedTask: 0,
              tasks: [
                {
                  id: 5,
                  name: 'Task 5',
                  status: 'To Do',
                },
                {
                  id: 6,
                  name: 'Task 6',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 4,
              name: 'User Story 4',
              description: 'us4 description',
              taskCount: 2,
              completedTask: 2,
              tasks: [
                {
                  id: 7,
                  name: 'Task 7',
                  status: 'Done!',
                },
                {
                  id: 8,
                  name: 'Task 8',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Project 2',
      description: 'p2 description',
      status: 'To Do',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStoriesCount: 1,
          completedUserStories: 0,
          status: 'To Do',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              taskCount: 1,
              completedTask: 0,
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
              ],
            },
          ],
        },
      ],
    }
    ];

    jest.spyOn(mockUserProjectsRepository, 'find').mockReturnValue(projects);

    const result = await service.getUserProjects(id);
    expect(result).toEqual(projectsWithStatuses);
    expect(mockUserProjectsRepository.find).toHaveBeenCalled();
    expect(mockUserProjectsRepository.find).toHaveBeenCalledWith({ 
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
  })

  });

  it('getProjectById => returns a project based on its passed in id', async() => {
    const id = 1;

    const project = {
      id: 1,
      name: 'Project 1',
      description: 'p1 description',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
                {
                  id: 2,
                  name: 'Task 2',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 2,
              name: 'User Story 2',
              description: 'us2 description',
              tasks: [
                {
                  id: 3,
                  name: 'Task 3',
                  status: 'In Progress',
                },
                {
                  id: 4,
                  name: 'Task 4',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Feature 2',
          description: 'f2 description',
          userStories: [
            {
              id: 3,
              name: 'User Story 3',
              description: 'us3 description',
              tasks: [
                {
                  id: 5,
                  name: 'Task 5',
                  status: 'To Do',
                },
                {
                  id: 6,
                  name: 'Task 6',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 4,
              name: 'User Story 4',
              description: 'us4 description',
              tasks: [
                {
                  id: 7,
                  name: 'Task 7',
                  status: 'Done!',
                },
                {
                  id: 8,
                  name: 'Task 8',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
      ],
    } as Project;

    const projectWithStatuses = {
      id: 1,
      name: 'Project 1',
      description: 'p1 description',
      status: 'In Progress',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStoriesCount: 2,
          completedUserStories: 0,
          status: 'In Progress',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              taskCount: 2,
              completedTask: 0,
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
                {
                  id: 2,
                  name: 'Task 2',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 2,
              name: 'User Story 2',
              description: 'us2 description',
              taskCount: 2,
              completedTask: 1,
              tasks: [
                {
                  id: 3,
                  name: 'Task 3',
                  status: 'In Progress',
                },
                {
                  id: 4,
                  name: 'Task 4',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Feature 2',
          description: 'f2 description',
          userStoriesCount: 2,
          completedUserStories: 1,
          status: 'In Progress',
          userStories: [
            {
              id: 3,
              name: 'User Story 3',
              description: 'us3 description',
              taskCount: 2,
              completedTask: 0,
              tasks: [
                {
                  id: 5,
                  name: 'Task 5',
                  status: 'To Do',
                },
                {
                  id: 6,
                  name: 'Task 6',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 4,
              name: 'User Story 4',
              description: 'us4 description',
              taskCount: 2,
              completedTask: 2,
              tasks: [
                {
                  id: 7,
                  name: 'Task 7',
                  status: 'Done!',
                },
                {
                  id: 8,
                  name: 'Task 8',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
      ],
    };

    jest.spyOn(mockUserProjectsRepository, 'findOne').mockReturnValue(project);
    const result = await service.getProjectById(id);

    expect(result).toEqual(projectWithStatuses);
    expect(mockUserProjectsRepository.findOne).toHaveBeenCalled();
    expect(mockUserProjectsRepository.findOne).toHaveBeenCalledWith({ 
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
  });

  it('createProject', async() => {
    const name = 'Project 2';
    const description = 'p2 description';
    const userId = 15;

    const savedProject = {
      id: 2,
      name: 'Project 2',
      description: 'p2 description',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
              ],
            },
          ],
        },
      ],
    }

    const savedProjects = [
    {
      id: 1,
      name: 'Project 1',
      description: 'p1 description',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
                {
                  id: 2,
                  name: 'Task 2',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 2,
              name: 'User Story 2',
              description: 'us2 description',
              tasks: [
                {
                  id: 3,
                  name: 'Task 3',
                  status: 'In Progress',
                },
                {
                  id: 4,
                  name: 'Task 4',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Feature 2',
          description: 'f2 description',
          userStories: [
            {
              id: 3,
              name: 'User Story 3',
              description: 'us3 description',
              tasks: [
                {
                  id: 5,
                  name: 'Task 5',
                  status: 'To Do',
                },
                {
                  id: 6,
                  name: 'Task 6',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 4,
              name: 'User Story 4',
              description: 'us4 description',
              tasks: [
                {
                  id: 7,
                  name: 'Task 7',
                  status: 'Done!',
                },
                {
                  id: 8,
                  name: 'Task 8',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Project 2',
      description: 'p2 description',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
              ],
            },
          ],
        },
      ],
    }
    ] as Project[]; 

    const projectsWithStatuses = [
    {
      id: 1,
      name: 'Project 1',
      description: 'p1 description',
      status: 'In Progress',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStoriesCount: 2,
          completedUserStories: 0,
          status: 'In Progress',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              taskCount: 2,
              completedTask: 0,
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
                {
                  id: 2,
                  name: 'Task 2',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 2,
              name: 'User Story 2',
              description: 'us2 description',
              taskCount: 2,
              completedTask: 1,
              tasks: [
                {
                  id: 3,
                  name: 'Task 3',
                  status: 'In Progress',
                },
                {
                  id: 4,
                  name: 'Task 4',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Feature 2',
          description: 'f2 description',
          userStoriesCount: 2,
          completedUserStories: 1,
          status: 'In Progress',
          userStories: [
            {
              id: 3,
              name: 'User Story 3',
              description: 'us3 description',
              taskCount: 2,
              completedTask: 0,
              tasks: [
                {
                  id: 5,
                  name: 'Task 5',
                  status: 'To Do',
                },
                {
                  id: 6,
                  name: 'Task 6',
                  status: 'In Progress',
                },
              ],
            },
            {
              id: 4,
              name: 'User Story 4',
              description: 'us4 description',
              taskCount: 2,
              completedTask: 2,
              tasks: [
                {
                  id: 7,
                  name: 'Task 7',
                  status: 'Done!',
                },
                {
                  id: 8,
                  name: 'Task 8',
                  status: 'Done!',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Project 2',
      description: 'p2 description',
      status: 'To Do',
      features: [
        {
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStoriesCount: 1,
          completedUserStories: 0,
          status: 'To Do',
          userStories: [
            {
              id: 1,
              name: 'User Story 1',
              description: 'us1 description',
              taskCount: 1,
              completedTask: 0,
              tasks: [
                {
                  id: 1,
                  name: 'Task 1',
                  status: 'To Do',
                },
              ],
            },
          ],
        },
      ],
    }
    ];

    jest.spyOn(mockUserProjectsRepository, 'save').mockReturnValue(savedProject);
    jest.spyOn(mockUserProjectsRepository, 'find').mockReturnValue(savedProjects);

    const result = await service.createProject(name, description, userId);

    expect(result).toEqual(projectsWithStatuses);
    expect(mockUserProjectsRepository.save).toHaveBeenCalled();
    expect(mockUserProjectsRepository.save).toHaveBeenCalledWith({
      name,
      description ,
      user: {
        id: userId,
      },
    });
    expect(mockUserProjectsRepository.find).toHaveBeenCalled();
    expect(mockUserProjectsRepository.find).toHaveBeenCalledWith({ 
      where: { user: { id: userId } }, 
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
  });

});
