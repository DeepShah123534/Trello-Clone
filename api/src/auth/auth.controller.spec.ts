import { Test, TestingModule } from '@nestjs/testing';
import { AccountDetailDto, AuthController, FeatureDto, LogInDto, ProjectDto, SignUpDto, TaskDto, UpdateFeatureDto, UpdateProjectDto, UpdateTaskDto, UpdateUserStoryDto, UserStoryDto, newPasswordDto } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Project } from 'src/projects/entities/project.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: DeepMocked<AuthService>;

  const mockAuthGuard = { canActive: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: createMock<AuthService>(),
        },
      ]
    })
    .overrideGuard(AuthGuard)
    .useValue(mockAuthGuard)
    .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signUp => should add a user to the database and return an access token', async () => {
    const signUpDto = {
      name: 'Deep SHAH',
      email: 'deep@gmail.com',
      username: 'Deep',
      password: 'fake-password',
    } as SignUpDto;

    const fakeToken = 'fake-token';

    service.signUp.mockResolvedValue(fakeToken);

    const result = await controller.signUp(signUpDto);

    expect(result).toEqual(fakeToken);
    expect(service.signUp).toHaveBeenCalled();
    expect(service.signUp).toHaveBeenCalledWith(signUpDto);

  });

  it('logIn => should verify a user exists and their password is correct and return an access token', async () => {
    const logInDto = {
      username: 'Deep',
      password: 'fake-password',
    } as LogInDto;

    const fakeToken = 'fake-token';

    service.logIn.mockResolvedValue(fakeToken);

    const result = await controller.logIn(logInDto);

    expect(result).toEqual(fakeToken);
    expect(service.logIn).toHaveBeenCalled();
    expect(service.logIn).toHaveBeenCalledWith(logInDto);
  });

  it('changeAccountDetail => should change an account detail and return the updated user name, email, and username', async () => {
    const accountDetailDto = {
      username: 'Deep',
      field: 'name',
      value: 'DEEEP',
    } as AccountDetailDto;

    const updatedUser = {
      name: 'Deep SHAH',
      email: 'deep@gmail.com',
      username: 'Deep',
    };

    service.changeAccountDetails.mockResolvedValue(updatedUser);

    const result = await controller.changeAccountDetail(accountDetailDto);

    expect(result).toEqual(updatedUser);
    expect(service.changeAccountDetails).toHaveBeenCalled();
    expect(service.changeAccountDetails).toHaveBeenCalledWith(accountDetailDto);
  });

  it('getProfileData => should return the user email, name, and username from their user id', async () => {
    const req: any = {
      user: {
        sub: 25,
      },
    };

    const userData = {
      name: 'Deep SHAH',
      email: 'deep@gmail.com',
      username: 'Deep',
    };

    service.getProfileData.mockResolvedValue(userData);

    const result = await controller.getProfileData(req);

    expect(result).toEqual(userData);
    expect(service.getProfileData).toHaveBeenCalled();
    expect(service.getProfileData).toHaveBeenCalledWith(req.user.sub);
  });

  it('getUserProjects => should return the user email, name, and username along with the user projects from their user id', async () => {
    const req = {
      user: {
        sub: 15,
      },
    };

    const returnedObject = {
      user: {
        name: 'Deep SHAH',
        email: 'deep@gmail.com',
        username: 'Deep',
      },
      projects: [],
    };

    service.getUserProjects.mockResolvedValue(returnedObject);

    const result = await controller.getUserProjects(req);
    
    expect(result).toEqual(returnedObject);
    expect(service.getUserProjects).toHaveBeenCalled();
    expect(service.getUserProjects).toHaveBeenCalledWith(req.user.sub);
  });

  it('getProject => should return the desired project based on the passed in user and poroject id', async () => {
    const id = 1;
    const req = {
      user: {
        sub: 15,
      },
    };

    const project = {
      id: 1,
      name: 'Project 1',
      description: 'This is a test project',
      features: [],
    } as unknown as Project;

    service.getProject.mockResolvedValue(project);

    const result = await controller.getProject(id, req);
    
    expect(result).toEqual(project);
    expect(service.getProject).toHaveBeenCalled();
    expect(service.getProject).toHaveBeenCalledWith(id, req.user.sub);
  });

  it('createProject => should create a user project and return all of the user projects', async () => {
    const projectDto: ProjectDto = {
      name: 'Project 1',
      description: 'p1 description',
    };

    const req = {
      user: {
        sub: 15,
      },
    };

    const projects = [
      {
        id: 1,
        name: 'Project 1',
        description: 'p1 description',
        features: [],
      },
    ] as unknown as Project[];

    service.createProject.mockResolvedValue(projects);

    const result = await controller.createProject(projectDto, req);

    expect(result).toEqual(projects);
    expect(service.createProject).toHaveBeenCalled();
    expect(service.createProject).toHaveBeenCalledWith(
      projectDto.name,
      projectDto.description,
      req.user.sub,
    );
  });

  it('updateProject => should update a field on a project and return the updated project with statuses', async () => {
    const updateProjectDto: UpdateProjectDto = {
      field: 'name',
      value: 'Project 1 -- Edited',
      projectId: 1,
    };

    const req = {
      user: {
        sub: 15,
      },
    };

    const projectWithStatus = {
      id: 1,
      name: 'Project 1 -- Edited',
      description: 'p1 description',
      features: [],
      status: 'To Do',
    };

    service.updateProject.mockResolvedValue(projectWithStatus);

    const result = await controller.updateProject(updateProjectDto, req);

    expect(result).toEqual(projectWithStatus);
    expect(service.updateProject).toHaveBeenCalled();
    expect(service.updateProject).toHaveBeenCalledWith(
      updateProjectDto.field, 
      updateProjectDto.value, 
      req.user.sub, 
      updateProjectDto.projectId);
  });

  it('deleteProject => should delete a project and return the response from the project repository', async () => {
    const projectId = 1;
    const req = {
      user: {
        sub: 15,
      },
    };

    const deleteResult = {
      raw: [],
      affected: 1,
    };

    service.deleteProject.mockResolvedValue(deleteResult);

    const result = await controller.deleteProject(projectId, req);

    expect(result).toEqual(deleteResult);
    expect(service.deleteProject).toHaveBeenCalled();
    expect(service.deleteProject).toHaveBeenCalledWith(projectId, req.user.sub);
  });

  it('createFeature => should create a feature within a project and return updated projects', async () => {
    const featureDto: FeatureDto = {
      name: 'Feature 1',
      description: 'f1 description',
      projectId: 1,
    };

    const req = {
      user: {
        sub: 15,
      },
    };

    const projects = 
      {
        id: 1,
        name: 'Project 1',
        description: 'p1 description',
        status: 'To Do',
        features: [{
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStoryCount: 0,
          completedUserStoryCount: 0,
          statuses: [],
        }],
      };

    service.createFeature.mockResolvedValue(projects);

    const result = await controller.createFeature(featureDto, req);

    expect(result).toEqual(projects);
    expect(service.createFeature).toHaveBeenCalled();
    expect(service.createFeature).toHaveBeenCalledWith(
      featureDto.name,
      featureDto.description,
      req.user.sub,
      featureDto.projectId,
    );
  });

  it('updateFeature => should update a field on a feature and return the updated project with statuses', async () => {
    const updatefeatureDto: UpdateFeatureDto = {
      field: 'name',
      value: 'Feature 1 -- Edited',
      featureId: 1,
    };

    const req = {
      user: {
        sub: 15,
      },
    };

    const projectWithStatus = 
      {
        id: 1,
        name: 'Project 1',
        description: 'p1 description',
        status: 'To Do',
        features: [{
          id: 1,
          name: 'Feature 1-- Edited',
          description: 'f1 description',
          userStoryCount: 0,
          completedUserStoryCount: 0,
          statuses: [],
        }],
      };

    service.updateFeature.mockResolvedValue(projectWithStatus);

    const result = await controller.updateFeature(updatefeatureDto, req);

    expect(result).toEqual(projectWithStatus);
    expect(service.updateFeature).toHaveBeenCalled();
    expect(service.updateFeature).toHaveBeenCalledWith(
      updatefeatureDto.field, 
      updatefeatureDto.value, 
      req.user.sub, 
      updatefeatureDto.featureId);
  });

  it('deleteFeature => should delete a feature and return the updated project', async () => {
    const featureId = 1;
    const req = {
      user: {
        sub: 15,
      },
    };

    const projectWithStatus = 
      {
        id: 1,
        name: 'Project 1',
        description: 'p1 description',
        status: 'To Do',
        features: [],
      };

    service.deleteFeature.mockResolvedValue(projectWithStatus);

    const result = await controller.deleteFeature(featureId, req);

    expect(result).toEqual(projectWithStatus);
    expect(service.deleteFeature).toHaveBeenCalled();
    expect(service.deleteFeature).toHaveBeenCalledWith(featureId, req.user.sub);
  });

  it('createUserStory => should create a user story within a project and  feature, the returning updated projects', async () => {
    const userStoryDto: UserStoryDto = {
      name: 'user Story 1',
      description: 'us1 description',
      projectId: 1,
      featureId: 1,
    };

    const req = {
      user: {
        sub: 15,
      },
    };

    const projects = 
      {
        id: 1,
        name: 'Project 1',
        description: 'p1 description',
        status: 'To Do',
        features: [{
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStoryCount: 1,
          completedUserStoryCount: 0,
          userStories: [{
            id: 1,
            name: 'user Story 1',
            description: 'us1 description',
            taskCount: 0,
            completedTaskCount: 0,
            tasks: [],
          }],
        }],
      };

    service.createUserStory.mockResolvedValue(projects);

    const result = await controller.createUserStory(userStoryDto, req);

    expect(result).toEqual(projects);
    expect(service.createUserStory).toHaveBeenCalled();
    expect(service.createUserStory).toHaveBeenCalledWith(
      userStoryDto.name,
      userStoryDto.description,
      req.user.sub,
      userStoryDto.projectId,
      userStoryDto.featureId,
    );
  });

  it('updateUserStory => should update a field on a project and return the updated project with statuses', async () => {
    const updateUserStoryDto: UpdateUserStoryDto = {
      field: 'name',
      value: 'User Story 1 -- Edited',
      userStoryId: 1,
    };

    const req = {
      user: {
        sub: 15,
      },
    };

    const projectWithStatus = 
      {
        id: 1,
        name: 'Project 1',
        description: 'p1 description',
        status: 'To Do',
        features: [{
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStoryCount: 1,
          completedUserStoryCount: 0,
          userStories: [{
            id: 1,
            name: 'user Story 1 - Edited',
            description: 'us1 description',
            taskCount: 0,
            completedTaskCount: 0,
            tasks: [],
          }],
        }],
    };

    service.updateUserStory.mockResolvedValue(projectWithStatus);

    const result = await controller.updateUserStory(updateUserStoryDto, req);

    expect(result).toEqual(projectWithStatus);
    expect(service.updateUserStory).toHaveBeenCalled();
    expect(service.updateUserStory).toHaveBeenCalledWith(
      updateUserStoryDto.field, 
      updateUserStoryDto.value, 
      req.user.sub, 
      updateUserStoryDto.userStoryId);
  });

  it('deleteUserStory => should delete a user story and return the updated project', async () => {
    const userStoryId = 1;
    const req = {
      user: {
        sub: 15,
      },
    };

    const projectWithStatus = 
      {
        id: 1,
        name: 'Project 1',
        description: 'p1 description',
        status: 'To Do',
        features: [{
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStoryCount: 0,
          completedUserStoryCount: 0,
          userStories: [],
        }],
    };

    service.deleteUserStory.mockResolvedValue(projectWithStatus);

    const result = await controller.deleteUserStory(userStoryId, req);

    expect(result).toEqual(projectWithStatus);
    expect(service.deleteUserStory).toHaveBeenCalled();
    expect(service.deleteUserStory).toHaveBeenCalledWith(userStoryId, req.user.sub);
  });

  it('createTask => should create a task within a project, feature and user story, then returning updated projects', async () => {
    const taskDto: TaskDto = {
      name: 'task 1',
      projectId: 1,
      featureId: 1,
      userStoryId: 1,
    };

    const req = {
      user: {
        sub: 15,
      },
    };

    const projects = 
      {
        id: 1,
        name: 'Project 1',
        description: 'p1 description',
        status: 'To Do',
        features: [{
          id: 1,
          name: 'Feature 1',
          description: 'f1 description',
          userStoryCount: 1,
          completedUserStoryCount: 0,
          userStories: [{
            id: 1,
            name: 'user Story 1',
            description: 'us1 description',
            taskCount: 1,
            completedTaskCount: 0,
            tasks: [{
              name: 'task 1',
              status: 'To Do',
            }],
          }],
        }],
      };

    service.createTask.mockResolvedValue(projects);

    const result = await controller.createTask(taskDto, req);

    expect(result).toEqual(projects);
    expect(service.createTask).toHaveBeenCalled();
    expect(service.createTask).toHaveBeenCalledWith(
      taskDto.name,
      req.user.sub,
      taskDto.projectId,
      taskDto.featureId,
      taskDto.userStoryId,
    );
  });

  it('updateTask => should update a field on a task and return the updated project with statuses', async () => {
    const updateTaskDto: UpdateTaskDto = {
      field: 'status',
      value: 'Done!',
      taskId: 1,
    };

    const req = {
      user: {
        sub: 15,
      },
    };
    const returnObject = {
      storyStatus: '1/1',
      taskList: [
        {
          name: 'Task 1',
          status: 'Done!',
        },
      ],
    };

    service.updateTask.mockResolvedValue(returnObject);

    const result = await controller.updateTask(updateTaskDto, req);

    expect(result).toEqual(returnObject);
    expect(service.updateTask).toHaveBeenCalled();
    expect(service.updateTask).toHaveBeenCalledWith(
      updateTaskDto.field,
      updateTaskDto.value,
      req.user.sub,
      updateTaskDto.taskId,
    );
   
  });

  it('deleteTask => should delete a task and return the updated project', async () => {
    const taskId = 1;
    const req = {
      user: {
        sub: 15,
      },
    };

    const returnObject = {
      storyStatus: '0/0',
      taskList: [],
    };

    service.deleteTask.mockResolvedValue(returnObject);

    const result = await controller.deleteTask(taskId, req);

    expect(result).toEqual(returnObject);
    expect(service.deleteTask).toHaveBeenCalled();
    expect(service.deleteTask).toHaveBeenCalledWith(taskId, req.user.sub);
  });

  it('saveNewPassword => should update the user password and return the user email, name, and username', async () => {
    const body = {
      newPassword: 'new-password',
      id: 15,
      token: 'fake-token',
    } as newPasswordDto;

    const updatedUser = {
      email: 'deep@gmail.com',
      name: 'Deep SHAH',
      username: 'Deep',
    };

    service.saveNewPassword.mockResolvedValue(updatedUser);

    const result = await controller.saveNewPassword(body);

    expect(result).toEqual(updatedUser);
    expect(service.saveNewPassword).toHaveBeenCalled();
    expect(service.saveNewPassword).toHaveBeenCalledWith(
      body.newPassword, body.id, body.token
    );
  });

  it('deleteUser => should delete the user and return the delete result', async() => {
    const req = {
      user: {
        sub: 15,
      },
    };

    const deleteResult = {
      raw: [],
      affected: 1,
    };

    service.deleteUser.mockResolvedValue(deleteResult);

    const result = await controller.deleteuser(req);

    expect(result).toEqual(deleteResult);
    expect(service.deleteUser).toHaveBeenCalled();
    expect(service.deleteUser).toHaveBeenCalledWith(req.user.sub);
  });

  it('sendResetPasswordEmail => send a password reset email to a user', async () => {
    const body = { email: 'deepshah0206@gmail.com' };
  
    const response = { message: 'Reset email sent' };
    service.sendResetPassword.mockResolvedValue(response);
  
    const result = await controller.sendResetPasswordEmail(body);
  
    expect(result).toEqual(response);
    expect(service.sendResetPassword).toHaveBeenCalled();
    expect(service.sendResetPassword).toHaveBeenCalledWith(body.email);
  });

});
