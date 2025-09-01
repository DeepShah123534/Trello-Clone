import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { BadRequestException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  const mockTaskRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, 
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getUserStoryTasks => should find tasks corresponding to a user story id', async() => {
    const id = 1;
    const tasks = [
        {
            id: 1,
            name: "Task 1",
            status: 'To Do',
        }, 
        {
            id: 2,
            name: "Task 2",
            status: 'To Do',
        }, 
    ] as Task[];
    jest.spyOn(mockTaskRepository, 'find').mockReturnValue(tasks);

    const result = await service.getUserStoryTasks(id);

    expect(result).toEqual(tasks)
    expect(mockTaskRepository.find).toHaveBeenCalled();
    expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: {userStory: { id } },
    });
  });

  it('createTask => should return the tasks associated with the user story id that is passes in addition to an extra task name that was passed in',
    async() => {
    const name = 'Task 3';
    const userStoryId = 1;
    const savedTask = {
        id: 3,
        name: "Task 3",
        status: 'To Do',
        userStory: {
            id: 1
        },
    } as Task;
    const tasks = [
        {
            id: 1,
            name: "Task 1",
            status: 'To Do',
                    userStory: {
            id: 1
        },
        }, 
        {
            id: 2,
            name: "Task 2",
            status: 'To Do',
                    userStory: {
            id: 1
        },
        }, 
        {
            id: 3,
            name: "Task 3",
            status: 'To Do',
                    userStory: {
            id: 1
        },
        }, 
    ] as Task[]; 

    jest.spyOn(mockTaskRepository, 'save').mockReturnValue(savedTask);
    jest.spyOn(mockTaskRepository, 'find').mockReturnValue(tasks);

    const result = await service.createTask(name, userStoryId)

    expect(result).toEqual(tasks);
    expect(mockTaskRepository.save).toHaveBeenCalled();
    expect(mockTaskRepository.save).toHaveBeenCalledWith({
        name,
        userStory: {
            id: userStoryId,
        },
    });
    expect(mockTaskRepository.find).toHaveBeenCalled();
    expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: { userStory: { id: userStoryId } },
    });
  });

  it('updateTask => should update a task name and return the corresponding user story id', async() => {
    const field = 'name';
    const value = 'Task 1 - Edited';
    const userId = 15;
    const taskId = 1;

    const taskToUpdate = {
      name: 'Task 1',
      status: 'To Do',
      userStory: {
        id: 1,
      },
    } as Task;

    const updatedTask = { 
      name: 'Task 1 - Edited',
      status: 'To Do',
      userStory: {
        id: 1,
      },
    } as Task;

    const userStoryId = 1;

    jest.spyOn(mockTaskRepository, 'findOne').mockReturnValue(taskToUpdate);
    jest.spyOn(mockTaskRepository, 'save').mockReturnValue(updatedTask);

    const result = await service.updateTask(field, value, userId, taskId);

    expect(result).toEqual(userStoryId);
    expect(mockTaskRepository.findOne).toHaveBeenCalled();
    expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: taskId,
          userStory: {
            feature: {
              project: {
                user: { id: userId }
              }
            }
          }
        },
        relations: [
          'userStory'
        ],
      });
      expect(mockTaskRepository.save).toHaveBeenCalled();
      expect(mockTaskRepository.save).toHaveBeenCalledWith(updatedTask);
  });

  it('updateTask => should update a task status and return the corresponding user story id', async() => {
    const field = 'status';
    const value = 'In Progress';
    const userId = 15;
    const taskId = 1;

    const taskToUpdate = {
      name: 'Task 1',
      status: 'To Do',
      userStory: {
        id: 1,
      },
    } as Task;

    const updatedTask = { 
      name: 'Task 1',
      status: 'In Progress',
      userStory: {
        id: 1,
      },
    } as Task;

    const userStoryId = 1;

    jest.spyOn(mockTaskRepository, 'findOne').mockReturnValue(taskToUpdate);
    jest.spyOn(mockTaskRepository, 'save').mockReturnValue(updatedTask);

    const result = await service.updateTask(field, value, userId, taskId);

    expect(result).toEqual(userStoryId);
    expect(mockTaskRepository.findOne).toHaveBeenCalled();
    expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: taskId,
          userStory: {
            feature: {
              project: {
                user: { id: userId }
              }
            }
          }
        },
        relations: [
          'userStory'
        ],
      });
      expect(mockTaskRepository.save).toHaveBeenCalled();
      expect(mockTaskRepository.save).toHaveBeenCalledWith(updatedTask);
  });

  it('updateTask => should throw error if task is not found', async() => {
    const field = 'status';
    const value = 'In Progress';
    const userId = 5;
    const taskId = 1;

    jest.spyOn(mockTaskRepository, 'findOne').mockReturnValue(undefined);

    expect(async () => {
      await service.updateTask(field, value, userId, taskId)
    }).rejects.toThrow(BadRequestException);
    expect(mockTaskRepository.findOne).toHaveBeenCalled();
    expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: taskId,
          userStory: {
            feature: {
              project: {
                user: { id: userId }
              }
            }
          }
        },
        relations: [
          'userStory'
        ],
      });

  }); 

  it('deleteTask => should find a task based on a task and user id, delete it, and return the assoiciated user story id', async() => {
    const taskId = 1;
    const userId = 15;

    const taskToDelete = {
      id: 1,
      name: 'Task 1',
      status: 'To Do',
      userStory: {
        id: 5,
      },
    } as Task;

    const deletedTask = {
      id: 1,
      name: 'Task 1',
      status: 'To Do',
      userStory: {
        id: 5,
      },
    } as Task;

    jest.spyOn(mockTaskRepository, 'findOne').mockReturnValue(taskToDelete);
    jest.spyOn(mockTaskRepository, 'delete').mockReturnValue(deletedTask);

    const result = await service.deleteTask(taskId, userId);

    expect(result).toEqual(deletedTask.userStory.id);
    expect(mockTaskRepository.findOne).toHaveBeenCalled();
    expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: taskId,
          userStory: {
            feature: {
              project: {
                user: { id: userId }
              }
            }
          }
        },
        relations: [
          'userStory', 
        ],
      });
      expect(mockTaskRepository.delete).toHaveBeenCalled();
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(deletedTask);
  });

  it('deleteTask => should throw error if task is not found', async() => {
    const taskId = 1;
    const userId = 100;

    jest.spyOn(mockTaskRepository, 'findOne').mockReturnValue(undefined
      
    );

    expect(async () => {
      await service.deleteTask(taskId, userId)
    }).rejects.toThrow(BadRequestException);
    expect(mockTaskRepository.findOne).toHaveBeenCalled();
    expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: taskId,
          userStory: {
            feature: {
              project: {
                user: { id: userId }
              }
            }
          }
        },
        relations: [
          'userStory', 
        ],
      });

  });   

});
