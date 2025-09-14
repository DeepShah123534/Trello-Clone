import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ProjectsService } from '../projects/projects.service';
import { FeaturesService } from '../features/features.service';
import { UserStoriesService } from '../userStories/userStories.service';
import { TasksService } from '../task/tasks.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { AccountDetailDto, SignUpDto } from './auth.controller';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { LogInDto } from './auth.controller';
import { UserStory } from '../userStories/entities/userStory.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersServices: DeepMocked<UsersService>;
  let projectsServices: DeepMocked<ProjectsService>;
  let featuresServices: DeepMocked<FeaturesService>;
  let userStoriesServices: DeepMocked<UserStoriesService>;
  let tasksServices: DeepMocked<TasksService>;
  let jwtService: DeepMocked<JwtService>;
  let mailService: DeepMocked<MailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: UsersService,
          useValue: createMock<UsersService>(),
        },
        {
          provide: ProjectsService,
          useValue: createMock<ProjectsService>(),
        },
        {
          provide: FeaturesService,
          useValue: createMock<FeaturesService>(),
        },
        {
          provide: UserStoriesService,
          useValue: createMock<UserStoriesService>(),
        },
        {
          provide: TasksService,
          useValue: createMock<TasksService>(),
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
        {
          provide: MailService,
          useValue: createMock<MailService>(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersServices = module.get(UsersService);
    projectsServices = module.get(ProjectsService);
    featuresServices = module.get(FeaturesService);
    userStoriesServices = module.get(UserStoriesService);
    tasksServices = module.get(TasksService);
    jwtService = module.get(JwtService);
    mailService = module.get(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersServices).toBeDefined();
    expect(projectsServices).toBeDefined();
    expect(featuresServices).toBeDefined();
    expect(userStoriesServices).toBeDefined();
    expect(tasksServices).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(mailService).toBeDefined();
  });

  it('hashPassword => should return a hashed version of the passed in password', async () => {
    const password = 'fake-password';
    const hashedPassword = 'hashed-faked-password';

    const bcryptHash = jest.fn().mockReturnValue(hashedPassword);
    (bcrypt.hash as jest.Mock) = bcryptHash;

    const result = await service.hashPassword(password);

    expect(result).toEqual(hashedPassword);
    expect(bcryptHash).toHaveBeenCalled();
    expect(bcryptHash).toHaveBeenCalledWith(password, 10);
  });

  it('createAccessToken => should return a JWT without inputting a secret', async() => {
    const user = {
      id: 15,
    } as User

    const token = 'fake-jwt';

    jwtService.signAsync.mockResolvedValue(token);

    const result = await service.createAccessToken(user);

    expect(result).toEqual(token);
    expect(jwtService.signAsync).toHaveBeenCalled();
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 15 });
  });

  it('createAccessToken => should return a JWT while passing in a secret', async() => {
    const user = {
      id: 15,
    } as User

    const secret = 'fake-secret';

    const token = 'fake-jwt';

    jwtService.signAsync.mockResolvedValue(token);

    const result = await service.createAccessToken(user, secret);

    expect(result).toEqual(token);
    expect(jwtService.signAsync).toHaveBeenCalled();
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 15 }, { secret, expiresIn: '10m' });
  });

  it('verifyUniqueUsername => should return false if user with username exists', async () => {
    const username = 'Deep';
    const user = {
      id: 15,
      name: 'Deep Shah',
      email: 'deepshah0206@gmail..com',
      username: 'Deep',
      password: 'fake-password',
    } as User;

    usersServices.findUserByUsername.mockResolvedValue(user);

    const result = await service.verifyUniqueUsername(username);

    expect(result).toEqual(false);
    expect(usersServices.findUserByUsername).toHaveBeenCalled();
    expect(usersServices.findUserByUsername).toHaveBeenCalledWith(username);
  });

  it('verifyUniqueUsername => should return true if user with username is not found', async () => {
    const username = 'potato';
  
    usersServices.findUserByUsername.mockResolvedValue(null);
  
    const result = await service.verifyUniqueUsername(username);
  
    expect(result).toEqual(true);
    expect(usersServices.findUserByUsername).toHaveBeenCalled();
    expect(usersServices.findUserByUsername).toHaveBeenCalledWith(username);
  });

  it('verifyUniqueEmail => should return false if user with email exists', async () => {
    const email = 'deepshah0206@gmail.com';
    const user = {
      id: 15,
      name: 'Deep Shah',
      email: 'deepshah0206@gmail.com',
      username: 'Deep',
      password: 'fake-password',
    } as User;

    usersServices.findUserByEmail.mockResolvedValue(user);

    const result = await service.verifyUniqueEmail(email);

    expect(result).toEqual(false);
    expect(usersServices.findUserByEmail).toHaveBeenCalled();
    expect(usersServices.findUserByEmail).toHaveBeenCalledWith(email);
  });

  it('verifyUniqueEmail => should return true if user with email is not found', async () => {
    const email = 'potato@gmail.com';
  
    usersServices.findUserByEmail.mockResolvedValue(null);
  
    const result = await service.verifyUniqueEmail(email);
  
    expect(result).toEqual(true);
    expect(usersServices.findUserByEmail).toHaveBeenCalled();
    expect(usersServices.findUserByEmail).toHaveBeenCalledWith(email);
  });  

  it('signUp => should return an access tomen if user name and email are unique', async() => {
    const signUpDto ={
      name: 'Deep Shah',
      username: 'Deep',
      password: 'fake-password',
      email: 'deepshah0206@gmail.com',
    } as SignUpDto;

    const user = {
      id: 1,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah0206@gmail.com',
    } as User;

    usersServices.findUserByUsername.mockResolvedValue(null);
    usersServices.findUserByEmail.mockResolvedValue(null);

    const hashedPassword = 'hashed-fake-password';

    const bcryptHash = jest.fn().mockReturnValue(hashedPassword);
    (bcrypt.hash as jest.Mock) = bcryptHash;

    usersServices.createuser.mockResolvedValue(user);

    const token = 'fake-jwt';
    
    jwtService.signAsync.mockResolvedValue(token);

    const result = await service.signUp(signUpDto);
    expect(result).toEqual(token);

    expect(usersServices.findUserByUsername).toHaveBeenCalled();
    expect(usersServices.findUserByUsername).toHaveBeenCalledWith(signUpDto.username,);

    expect(usersServices.findUserByEmail).toHaveBeenCalled();
    expect(usersServices.findUserByEmail).toHaveBeenCalledWith(signUpDto.email);
    expect(bcryptHash).toHaveBeenCalled();
    expect(bcryptHash).toHaveBeenCalledWith('fake-password', 10);
    expect(usersServices.createuser).toHaveBeenCalled();
    expect(usersServices.createuser).toHaveBeenCalledWith(signUpDto);
    expect(jwtService.signAsync).toHaveBeenCalled();
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.id });
  });

  it('signUp => should throw an error that username already exists', async() => {
    const signUpDto ={
      name: 'Deep Shah',
      username: 'Deep',
      password: 'fake-password',
      email: 'deepshah0206@gmail.com',
    } as SignUpDto;

    const user = {
      id: 1,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah0206@gmail.com',
    } as User;

    usersServices.findUserByUsername.mockResolvedValue(user);

    expect(async() => {
      await service.signUp(signUpDto);
    }).rejects.toThrow(new BadRequestException('Username already exists'));

    expect(usersServices.findUserByUsername).toHaveBeenCalled();
    expect(usersServices.findUserByUsername).toHaveBeenCalledWith(signUpDto.username,);
  });

  it('signUp => should throw an error that email already exists', async() => {
    const signUpDto ={
      name: 'Deep Shah',
      username: 'Deep',
      password: 'fake-password',
      email: 'deepshah0206@gmail.com',
    } as SignUpDto;

    const user = {
      id: 1,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah0206@gmail.com',
    } as User;

    usersServices.findUserByUsername.mockResolvedValue(null);
    usersServices.findUserByEmail.mockResolvedValue(user);

    try {
      await service.signUp(signUpDto);
    } catch (error) {
      expect(error.message).toBe('Email already exists');
      expect(usersServices.findUserByUsername).toHaveBeenCalled();
      expect(usersServices.findUserByUsername).toHaveBeenCalledWith(
        signUpDto.username,
      );
    
      expect(usersServices.findUserByEmail).toHaveBeenCalled();
      expect(usersServices.findUserByEmail).toHaveBeenCalledWith(
        signUpDto.email,
      );
    }
  });

  it('verifyPassword => should return true if entered password matches existing hashed password', async () => {
    const enteredPassword = 'plain-text-password';
    const existingPassword = 'matching-hashed-password';

    const bcryptCompare = jest.fn().mockResolvedValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const result = await service.verifyPassword(
      enteredPassword,
      existingPassword,
    );

    expect(result).toEqual(true);
    expect(bcryptCompare).toHaveBeenCalled();
    expect(bcryptCompare).toHaveBeenCalledWith(
      enteredPassword,
      existingPassword,
    );
  });

  it('verifyPassword => should return false if entered password matches existing hashed password', async () => {
    const enteredPassword = 'plain-text-password';
    const existingPassword = 'not-matching-hashed-password';
  
    const bcryptCompare = jest.fn().mockResolvedValue(false);
    (bcrypt.compare as jest.Mock) = bcryptCompare;
  
    const result = await service.verifyPassword(
      enteredPassword,
      existingPassword,
    );
  
    expect(result).toEqual(false);
    expect(bcryptCompare).toHaveBeenCalled();
    expect(bcryptCompare).toHaveBeenCalledWith(
      enteredPassword,
      existingPassword,
    );
  });

  it('logIn => should return access token if user exists and passwords match', async () => {
   const logInDto = {
     username: 'Deep',
     password: 'fake-password',
   } as LogInDto;

   const user = {
     id: 1,
     name: 'Deep Shah',
     username: 'Deep',
     password: 'hashed-faked-password',
     email: 'deepshah0206@gmail.com',
   } as User;

   usersServices.findUserByUsername.mockResolvedValue(user);

   const bcryptCompare = jest.fn().mockResolvedValue(true);
   (bcrypt.compare as jest.Mock) = bcryptCompare;

   const token = 'fake-jwt';

   jwtService.signAsync.mockResolvedValue(token);

   const result = await service.logIn(logInDto);

   expect(result).toEqual(token);
   expect(usersServices.findUserByUsername).toHaveBeenCalled();
     expect(usersServices.findUserByUsername).toHaveBeenCalledWith(
       logInDto.username,
     );

    expect(bcryptCompare).toHaveBeenCalled();
    expect(bcryptCompare).toHaveBeenCalledWith(
      logInDto.password,
      user.password,
    );

    expect(jwtService.signAsync).toHaveBeenCalled();
    expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.id });
  });

  it('logIn => should throw unauthorized error if user exists and passwords do not match', async () =>{
   const logInDto = {
     username: 'Deep',
     password: 'fake-password',
   } as LogInDto;

   const user = {
     id: 1,
     name: 'Deep Shah',
     username: 'Deep',
     password: 'hashed-faked-password',
     email: 'deepshah0206@gmail.com',
   } as User;

    usersServices.findUserByUsername.mockResolvedValue(user);

    const bcryptCompare = jest.fn().mockResolvedValue(false);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    try {
      await service.logIn(logInDto)
        
    } catch (error) {
      expect(error.message).toEqual('Incorrect password');
      expect(usersServices.findUserByUsername).toHaveBeenCalled();
      expect(usersServices.findUserByUsername).toHaveBeenCalledWith(
        logInDto.username,
      );

      expect(bcryptCompare).toHaveBeenCalled();
      expect(bcryptCompare).toHaveBeenCalledWith(
        logInDto.password,
        user.password,
      );
    }
  });

  it('logIn => should throw unauthorized error if user does not exists', async () =>{
   const logInDto = {
     username: 'fake-user',
     password: 'fake-password',
   } as LogInDto;

    usersServices.findUserByUsername.mockResolvedValue(null);

    try {
      await service.logIn(logInDto)
        
    } catch (error) {
      expect(error.message).toEqual('username does not exist');
      expect(usersServices.findUserByUsername).toHaveBeenCalled();
      expect(usersServices.findUserByUsername).toHaveBeenCalledWith(
        logInDto.username,
      );
    }
  });

  it("changeAccountDetails => return user data after hashing and changing user's password", async () => {
    const accountDetailDto: AccountDetailDto = {
      username: 'Deep',
      field: 'password',
      value: 'new-fake-password',
    }

    const user = {
      id: 15,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah0206@gmail.com',
    } as User;

    const updatedUser = {
      id: 15,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-new-password',
      email: 'deepshah0206@gmail.com',
    } as User;

    const hashedNewPassword = 'hashed-new-password';

    usersServices.findUserByUsername.mockResolvedValue(user);
    usersServices.createuser.mockResolvedValue(updatedUser);

    const bcryptHash = jest.fn().mockReturnValue(hashedNewPassword);
    (bcrypt.hash as jest.Mock) = bcryptHash;

    const result = await service.changeAccountDetails(accountDetailDto);

    expect(result).toEqual({
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    });
    expect(usersServices.findUserByUsername).toHaveBeenCalled();
    expect(usersServices.findUserByUsername).toHaveBeenCalledWith(
      accountDetailDto.username,
    );

    expect(usersServices.createuser).toHaveBeenCalled();
    expect(usersServices.createuser).toHaveBeenCalledWith(updatedUser);
    expect(bcryptHash).toHaveBeenCalled();
    expect(bcryptHash).toHaveBeenCalledWith(accountDetailDto.value, 10);

  }); 

  it("changeAccountDetails => return user data after changing user's usernme", async () => {
    const accountDetailDto: AccountDetailDto = {
      username: 'Deep',
      field: 'username',
      value: 'Deep',
    }

    const user = {
      id: 15,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah0206@gmail.com',
    } as User;

    const updatedUser = {
      id: 15,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah0206@gmail.com',
    } as User;

    usersServices.findUserByUsername.mockResolvedValueOnce(user);
    usersServices.createuser.mockResolvedValue(updatedUser);
    usersServices.findUserByUsername.mockResolvedValueOnce(null);

    const result = await service.changeAccountDetails(accountDetailDto);

    expect(result).toEqual({
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    });
    expect(usersServices.findUserByUsername).toHaveBeenCalled();
    expect(usersServices.findUserByUsername).toHaveBeenCalledWith(
      accountDetailDto.username,
    );
    
    expect(usersServices.createuser).toHaveBeenCalled();
    expect(usersServices.createuser).toHaveBeenCalledWith(updatedUser);


  });

  it("changeAccountDetails => should throw an error if new username is duplicate", async () => {
  const accountDetailDto: AccountDetailDto = {
    username: 'Deep',
    field: 'username',
    value: 'DaDeep',
  };

  const user = {
    id: 15,
    name: 'Deep Shah',
    username: 'Deep',
    password: 'hashed-fake-password',
    email: 'deepshah0206@gmail.com',
  } as User;

  const duplicateUser = {
    id: 22,
    name: 'Yash Shah',
    username: 'Yash',
    password: 'hashed-fake-password',
    email: 'yash@gmail.com',
  } as User;

  usersServices.findUserByUsername
    .mockResolvedValueOnce(user)
    .mockResolvedValueOnce(duplicateUser);

  await expect(service.changeAccountDetails(accountDetailDto))
    .rejects.toThrow('Username already exists');

    // verify both calls and their arguments
    expect(usersServices.findUserByUsername).toHaveBeenCalledTimes(2);
    expect(usersServices.findUserByUsername)
      .toHaveBeenNthCalledWith(1, accountDetailDto.username); 
    expect(usersServices.findUserByUsername)
      .toHaveBeenNthCalledWith(2, accountDetailDto.value);    
  });

  it("changeAccountDetails => return user data after changing user's email", async () => {
    const accountDetailDto: AccountDetailDto = {
      username: 'Deep',
      field: 'email',
      value: 'deepshah0206@gmail.com',
    }

    const user = {
      id: 15,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah0206@gmail.com',
    } as User;

    const updatedUser = {
      id: 15,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah0206@gmail.com',
    } as User;

    usersServices.findUserByUsername.mockResolvedValue(user);
    usersServices.createuser.mockResolvedValue(updatedUser);
    usersServices.findUserByEmail.mockResolvedValue(null);

    const result = await service.changeAccountDetails(accountDetailDto);

    expect(result).toEqual({
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    });
    expect(usersServices.findUserByUsername).toHaveBeenCalled();
    expect(usersServices.findUserByUsername).toHaveBeenCalledWith(
      accountDetailDto.username,
    );
    
    expect(usersServices.createuser).toHaveBeenCalled();
    expect(usersServices.createuser).toHaveBeenCalledWith(updatedUser);
    expect(usersServices.findUserByEmail).toHaveBeenCalled();
    expect(usersServices.findUserByEmail).toHaveBeenCalledWith(user.email);
  });

  it("changeAccountDetails => should throw an error if new email is duplicate", async () => {
    const accountDetailDto: AccountDetailDto = {
      username: 'Deep',
      field: 'email',
      value: 'deepshah0206@gmail.com',
    };

    const user = {
      id: 15,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah0206@gmail.com',
    } as User;

    const duplicateUser = {
      id: 22,
      name: 'Yash Shah',
      username: 'Yash',
      password: 'hashed-fake-password',
      email: 'yashhh@gmail.com',
    } as User;

    usersServices.findUserByUsername.mockResolvedValue(user);
    usersServices.findUserByEmail.mockResolvedValue(duplicateUser);

    try {
      await service.changeAccountDetails(accountDetailDto);
    } catch (error) {
      expect(error.message).toEqual('Email already exists');
      expect(usersServices.findUserByUsername).toHaveBeenCalled();
      expect(usersServices.findUserByUsername).toHaveBeenCalledWith(
        accountDetailDto.username,
      );
    
      expect(usersServices.findUserByEmail).toHaveBeenCalled();
      expect(usersServices.findUserByEmail).toHaveBeenCalledWith(
        accountDetailDto.value,
      );
    }
  });

  it("changeAccountDetails => return user data after changing user name", async () => {
    const accountDetailDto: AccountDetailDto = {
      username: 'Deep',
      field: 'name',
      value: 'Deepp',
    }

    const user = {
      id: 15,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah0206@gmail.com',
    } as User;

    const updatedUser = {
      id: 15,
      name: 'Deepp',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah0206@gmail.com',
    } as User;

    usersServices.findUserByUsername.mockResolvedValue(user);
    usersServices.createuser.mockResolvedValue(updatedUser);

    const result = await service.changeAccountDetails(accountDetailDto);

    expect(result).toEqual({
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    });
    expect(usersServices.findUserByUsername).toHaveBeenCalled();
    expect(usersServices.findUserByUsername).toHaveBeenCalledWith(
      accountDetailDto.username,
    );
    
    expect(usersServices.createuser).toHaveBeenCalled();
    expect(usersServices.createuser).toHaveBeenCalledWith(updatedUser);


  });

  it('getProfileData => return user name, email, and username corresponding to passed in user id', async () => {
    const id = 15;

    const user = {
      id: 15,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah@gmail.com',
    } as User;

    const returningUser = {
      email: user.email,
      name: user.name,
      username: user.username,
    };

    usersServices.findUserById.mockResolvedValue(user);

    const result = await service.getProfileData(id);

    expect(result).toEqual(returningUser);
    expect(usersServices.findUserById).toHaveBeenCalled();
    expect(usersServices.findUserById).toHaveBeenCalledWith(id);
  });

  it("saveNewPassword => should throw an unauthorized error when the token is invalid ", async () => {

    process.env.JWT_SECRET = 'test-secret'; 
    const newPassword = 'fake-new-password';
    const id = 15;
    const token = 'fake-token';

    const user = {
      id: 15,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah@gmail.com',
    } as User;

    usersServices.findUserById.mockResolvedValue(user);
    jwtService.verifyAsync.mockRejectedValue(
      new UnauthorizedException('token is invalid'),
    );

    try {
      await service.saveNewPassword(newPassword, id, token);
    } catch (error) {
        expect(error.message).toEqual('token is invalid');
        expect(usersServices.findUserById).toHaveBeenCalledWith(id);
        expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
          secret: 'test-secret',
        });
    }
  });

  it('deleteUser => should call users service delete user user method and return deleted user', async() => {
    const id = 15;

    const deleteResult = {
      raw: [],
      affected: 1,  
    };

    usersServices.deleteUser.mockResolvedValue(deleteResult);

    const result = await service.deleteUser(id);

    expect(result).toEqual(deleteResult);
    expect(usersServices.deleteUser).toHaveBeenCalled();
    expect(usersServices.deleteUser).toHaveBeenCalledWith(id);
  });

  it('getUserProjects => should return an object  with the user data and their projects when passed a user id', async() => {
    const userId = 15;

    const user = {
      id: 15,
      name: 'Deep Shah',
      username: 'Deep',
      password: 'hashed-fake-password',
      email: 'deepshah@gmail.com',
    } as User;

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

    usersServices.findUserById.mockResolvedValue(user);
    projectsServices.getUserProjects.mockResolvedValue(projectsWithStatuses);

    const result = await service.getUserProjects(userId);

    expect(result).toEqual({user: {
      email: user.email,
      name: user.name,
      username: user.username,
    }, projects: projectsWithStatuses});

    expect(usersServices.findUserById).toHaveBeenCalled();
    expect(usersServices.findUserById).toHaveBeenCalledWith(userId);
    expect(projectsServices.getUserProjects).toHaveBeenCalled();
    expect(projectsServices.getUserProjects).toHaveBeenCalledWith(userId);
  });

  it('getProject => should return to a project ', async() => {

    const userId = 15;

    const id = 1; 

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

    projectsServices.getUserProjects.mockResolvedValue(projectsWithStatuses);

    const result = await service.getProject(id, userId);
    expect(result).toEqual(projectsWithStatuses[0]);
    expect(projectsServices.getUserProjects).toHaveBeenCalledWith(userId);
  });

  it('updateProject => should update project name', async() => {
    const field = 'name';
    const value = 'Updated Project Name';
    const projectId = 1;
    const userId = 15;

    const updatedProject =     {
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

    projectsServices.updateProject.mockResolvedValue(updatedProject);

    const result = await service.updateProject(field, value, projectId, userId);
    
    expect(result).toEqual(updatedProject);
    expect(projectsServices.updateProject).toHaveBeenCalled();
    expect(projectsServices.updateProject).toHaveBeenCalledWith(field, value, projectId, userId);
  });

  it('deleteProject => should return a delete result after calling the deleteProject method in projectsService', async() => {
    const projectId = 1;
    const userId = 15;

    const deleteResult = {
      raw: [],
      affected: 1,  
    };

    projectsServices.deleteProject.mockResolvedValue(deleteResult);

    const result = await service.deleteProject(projectId, userId);
    expect(result).toEqual(deleteResult);
    expect(projectsServices.deleteProject).toHaveBeenCalled();
    expect(projectsServices.deleteProject).toHaveBeenCalledWith(projectId, userId);

  });

  it('createFeature => should create to an existing project and return the updated project', async() => {
    const name = 'Feature 1';
    const description = 'F1 description';
    const userId = 15;
    const projectId = 2;
    
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
      features: [],
    }
    ];

    const updatedProject = 
    {
      id: 2,
      name: 'Project 2',
      description: 'p2 description',
      status: 'To Do',
      features: [{
        id: 3,
        name: 'Feature 1',
        description: 'F1 description',
        userStoriesCount: 0,
        completedUserStories: 0,
        status: 'To Do',
        userStories: [],
      }],
    };

    projectsServices.getUserProjects.mockResolvedValue(projectsWithStatuses);
    projectsServices.getProjectById.mockResolvedValue(updatedProject);

    const result = await service.createFeature(name, description, userId, projectId);
    
    expect(result).toEqual(updatedProject);
    expect(projectsServices.getUserProjects).toHaveBeenCalled();
    expect(projectsServices.getUserProjects).toHaveBeenCalledWith(userId);
    expect(featuresServices.createFeature).toHaveBeenCalled();
    expect(featuresServices.createFeature).toHaveBeenCalledWith(
      name,
      description,
      projectId,
    );
    expect(projectsServices.getProjectById).toHaveBeenCalled();
    expect(projectsServices.getProjectById).toHaveBeenCalledWith(projectId);
  });

  it('createFeature => should throw unauthorized error when project is undefined', async() => {
    const name = 'Feature 1';
    const description = 'F1 description';
    const userId = 15;
    const projectId = 20;

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
      features: [],
    }
    ];

    projectsServices.getUserProjects.mockResolvedValue(projectsWithStatuses);

    try {
      await service.createFeature(name, description, userId, projectId);
    } catch (error) {
      expect(error).toEqual(new UnauthorizedException('project not found'));
      expect(projectsServices.getUserProjects).toHaveBeenCalled();
      expect(projectsServices.getUserProjects).toHaveBeenCalledWith(userId);
    }

  });

  it('updateFeature => should call the feature service update feature method and return the updated project', async() => {
    const field = 'name';
    const value = 'Feature 1 - updated';
    const userId = 15;
    const featureId = 3;

    const projectId = 2;

    const updatedProject = 
    {
      id: 2,
      name: 'Project 2',
      description: 'p2 description',
      status: 'To Do',
      features: [{
        id: 3,
        name: 'Feature 1 - updated',
        description: 'F1 description',
        userStoriesCount: 0,
        completedUserStories: 0,
        status: 'To Do',
        userStories: [],
      }],
    };

    featuresServices.updateFeature.mockResolvedValue(projectId);
    projectsServices.getProjectById.mockResolvedValue(updatedProject);

    const result = await service.updateFeature(field, value, userId, featureId);

    expect(result).toEqual(updatedProject);
    expect(featuresServices.updateFeature).toHaveBeenCalled();
    expect(featuresServices.updateFeature).toHaveBeenCalledWith(
      field,
      value,
      userId,
      featureId,
    );
    expect(projectsServices.getProjectById).toHaveBeenCalled();
    expect(projectsServices.getProjectById).toHaveBeenCalledWith(projectId);
  });

  it('deleteFeature => should return a delete feature and return updated project', async() => {
    const featureId = 3;
    const userId = 15;

    const projectId = 1;

    const projectWithStatuses = 
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
    };

    featuresServices.deleteFeature.mockResolvedValue(projectId);
    projectsServices.getProjectById.mockResolvedValue(projectWithStatuses);

    const result = await service.deleteFeature(featureId, userId);

    expect(result).toEqual(projectWithStatuses);
    expect(featuresServices.deleteFeature).toHaveBeenCalled();
    expect(featuresServices.deleteFeature).toHaveBeenCalledWith(
      featureId,
      userId,
    );
    expect(projectsServices.getProjectById).toHaveBeenCalled();
    expect(projectsServices.getProjectById).toHaveBeenCalledWith(projectId);

  });

  it('createUserStory => should call the user story service to create a user story and return the updated project', async() => {
    const name = 'User Story 3';
    const description = 'us3 description';
    const userId = 15;
    const projectId = 1;
    const featureId = 1;

    const projectsWithStatuses = 
    [
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
          id: 2,
          name: 'Feature 1',
          description: 'f1 description',
          userStoriesCount: 1,
          completedUserStories: 0,
          status: 'To Do',
          userStories: [
            {
              id: 3,
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

    const updatedProject =     {
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
            {
              id: 5,
              name: 'User Story 5',
              description: 'us5 description',
              taskCount: 0,
              completedTask: 0,
              tasks: [],
            },
          ],
        },
      ],
    };

    projectsServices.getUserProjects.mockResolvedValue(projectsWithStatuses);
    projectsServices.getProjectById.mockResolvedValue(updatedProject);    

    const result = await service.createUserStory(
      name,
      description,
      userId,
      projectId,
      featureId,
    );
    
    expect(result).toEqual(updatedProject);
    expect(projectsServices.getUserProjects).toHaveBeenCalled();
    expect(projectsServices.getUserProjects).toHaveBeenCalledWith(userId);
    expect(userStoriesServices.createUserStory).toHaveBeenCalled();
    expect(userStoriesServices.createUserStory).toHaveBeenCalledWith(
      name,
      description,
      featureId,
    );
    expect(projectsServices.getProjectById).toHaveBeenCalled();
    expect(projectsServices.getProjectById).toHaveBeenCalledWith(projectId);

  });

  it('createUserStory => should throw unauthorized error when feature is undefined', async() => {
    const name = 'User Story 3';
    const description = 'us3 description';
    const userId = 15;
    const projectId = 1;
    const featureId = 100;

    const projectsWithStatuses = 
    [
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
          id: 2,
          name: 'Feature 1',
          description: 'f1 description',
          userStoriesCount: 1,
          completedUserStories: 0,
          status: 'To Do',
          userStories: [
            {
              id: 3,
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

    projectsServices.getUserProjects.mockResolvedValue(projectsWithStatuses);
   

    try {
      await service.createUserStory(
      name,
      description,
      userId,
      projectId,
      featureId,
      );
    } catch(error) {
      expect(error).toEqual(new UnauthorizedException('Unauthorized'));
      expect(projectsServices.getUserProjects).toHaveBeenCalled();
      expect(projectsServices.getUserProjects).toHaveBeenCalledWith(userId);
    };
  
  });

  it('createUserStory => should throw unauthorized error when project is undefined', async() => {
    const name = 'User Story 3';
    const description = 'us3 description';
    const userId = 15;
    const projectId = 100;
    const featureId = 1;

    const projectsWithStatuses = 
    [
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
          id: 2,
          name: 'Feature 1',
          description: 'f1 description',
          userStoriesCount: 1,
          completedUserStories: 0,
          status: 'To Do',
          userStories: [
            {
              id: 3,
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

    projectsServices.getUserProjects.mockResolvedValue(projectsWithStatuses);
   
    try {
      await service.createUserStory(
      name,
      description,
      userId,
      projectId,
      featureId,
      );
    } catch(error) {
      expect(error).toEqual(new UnauthorizedException('Unauthorized'));
      expect(projectsServices.getUserProjects).toHaveBeenCalled();
      expect(projectsServices.getUserProjects).toHaveBeenCalledWith(userId);
    };
  
  });

  it('updateUserStory => should call the user story service update user story method and return the updated project', async () => {
    const field = 'name';
    const value = 'User Story 1 - updated';
    const userId = 15;
    const userStoryId = 1;
    
    const projectId = 2;
    
    const updatedProject = {
      id: 2,
      name: 'Project 2',
      description: 'p2 description',
      status: 'To Do',
      features: [{
        id: 3,
        name: 'Feature 1 - updated',
        description: 'F1 description',
        userStoriesCount: 0,
        completedUserStories: 0,
        status: 'To Do',
        userStories: [{
          id: 1,
          name: 'User Story 1 - updated',
          description: 'us1 description',
          taskCount: 1,
          completedTask: 0,
          tasks: [{ id: 1, name: 'Task 1', status: 'To Do' }],
        }],
      }],
    };
  
  
    userStoriesServices.updateUserStory.mockResolvedValue(projectId);
    projectsServices.getProjectById.mockResolvedValue(updatedProject);
  
    const result = await service.updateUserStory(field, value, userId, userStoryId);
  
    expect(result).toEqual(updatedProject);
    expect(userStoriesServices.updateUserStory).toHaveBeenCalledWith(field, value, userId, userStoryId);
    expect(projectsServices.getProjectById).toHaveBeenCalledWith(projectId);
  });

  it('deleteUserStory => should return a delete user story and return updated project', async() => {
    const userStoryId = 3;
    const userId = 15;

    const projectId = 1;

    const projectWithStatuses = 
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

    userStoriesServices.deleteUserStory.mockResolvedValue(projectId);
    projectsServices.getProjectById.mockResolvedValue(projectWithStatuses);
      
    const result = await service.deleteUserStory(userStoryId, userId);
      
    expect(result).toEqual(projectWithStatuses);
    expect(userStoriesServices.deleteUserStory).toHaveBeenCalled();
    expect(userStoriesServices.deleteUserStory).toHaveBeenCalledWith(
      userStoryId,
      userId,
    );
    expect(projectsServices.getProjectById).toHaveBeenCalled();
    expect(projectsServices.getProjectById).toHaveBeenCalledWith(projectId);

  });

  it('createTask => should call the tasks service to create a task and return the updated project', async() => {
    const name = 'Task 3';
    const userId = 15;
    const projectId = 1;
    const featureId = 1;
    const userStoryId = 1;

    const projectsWithStatuses = 
    [
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
              taskCount: 0,
              completedTask: 0,
              tasks: [],
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
      features: [],
    }
    ];

    const updatedProject =    
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
              taskCount: 0,
              completedTask: 0,
              tasks: [],
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
              taskCount: 3,
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
                {
                  id: 11,
                  name: 'Task 11',
                  status: 'To Do',
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

    projectsServices.getUserProjects.mockResolvedValue(projectsWithStatuses);
    projectsServices.getProjectById.mockResolvedValue(updatedProject);    

    const result = await service.createTask(
      name,
      userId,
      projectId,
      featureId,
      userStoryId,
    );
    
    expect(result).toEqual(updatedProject);
    expect(projectsServices.getUserProjects).toHaveBeenCalled();
    expect(projectsServices.getUserProjects).toHaveBeenCalledWith(userId);
    expect(projectsServices.getProjectById).toHaveBeenCalled();
    expect(projectsServices.getProjectById).toHaveBeenCalledWith(projectId);

  });

  it('createTask => should throw unauthorized error when user story is undefined', async() => {
    const name = 'Task 3';
    const userId = 15;
    const projectId = 1;
    const featureId = 1;
    const userStoryId = 1;

    const projectsWithStatuses = 
    [
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
              taskCount: 0,
              completedTask: 0,
              tasks: [],
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
      features: [],
    }
    ];


    projectsServices.getUserProjects.mockResolvedValue(projectsWithStatuses);   

    try {
      await service.createTask(
      name,
      userId,
      projectId,
      featureId,
      userStoryId,
    )
    } catch (error) {
    expect(error).toEqual(new UnauthorizedException('Unauthorized'));
    expect(projectsServices.getUserProjects).toHaveBeenCalled();
    expect(projectsServices.getUserProjects).toHaveBeenCalledWith(userId);
    }

  });

  it('createTask => should throw unauthorized error when feature is undefined', async() => {
    const name = 'Task 3';
    const userId = 15;
    const projectId = 1;
    const featureId = 100;
    const userStoryId = 1;

    const projectsWithStatuses = 
    [
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
              taskCount: 0,
              completedTask: 0,
              tasks: [],
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
      features: [],
    }
    ];


    projectsServices.getUserProjects.mockResolvedValue(projectsWithStatuses);   

    try {
      await service.createTask(
      name,
      userId,
      projectId,
      featureId,
      userStoryId,
    )
    } catch (error) {
    expect(error).toEqual(new UnauthorizedException('Unauthorized'));
    expect(projectsServices.getUserProjects).toHaveBeenCalled();
    expect(projectsServices.getUserProjects).toHaveBeenCalledWith(userId);
    }

  });

  it('createTask => should throw unauthorized error when project is undefined', async() => {
    const name = 'Task 3';
    const userId = 15;
    const projectId = 100;
    const featureId = 1;
    const userStoryId = 1;

    const projectsWithStatuses = 
    [
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
              taskCount: 0,
              completedTask: 0,
              tasks: [],
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
      features: [],
    }
    ];


    projectsServices.getUserProjects.mockResolvedValue(projectsWithStatuses);   

    try {
      await service.createTask(
      name,
      userId,
      projectId,
      featureId,
      userStoryId,
    )
    } catch (error) {
    expect(error).toEqual(new UnauthorizedException('Unauthorized'));
    expect(projectsServices.getUserProjects).toHaveBeenCalled();
    expect(projectsServices.getUserProjects).toHaveBeenCalledWith(userId);
    }

  });

  it('updateTask=> should call the taskservice to update task field and return the updated user story status', async () => {
    const field = 'name';
    const value = 'Todo 1 -- Edited';
    const userId = 15;
    const taskId = 1;

    const userStoryId = 1;

    const updatedUserStoryStatus = '0/3';
      tasksServices.updateTask.mockResolvedValue(userStoryId);
      userStoriesServices.getUserStoryById.mockResolvedValue(
      updatedUserStoryStatus,
    );

    const result = await service.updateTask(field, value, userId, taskId);

    expect(result).toEqual(updatedUserStoryStatus);
    expect(tasksServices.updateTask).toHaveBeenCalled();
    expect(tasksServices.updateTask).toHaveBeenCalledWith(
      field,
      value,
      userId,
      taskId,
    );
    expect(userStoriesServices.getUserStoryById).toHaveBeenCalled();
    expect(userStoriesServices.getUserStoryById).toHaveBeenCalledWith(
      userStoryId,
    );
  });

  it('deleteTask => should delete a task and return the user story status plus updated task list', async () => {
    const taskId = 3;
    const userId = 15;

    const userStoryId = 1;
    const storyStatus = '2/2';
    const updatedUserStory = {
      id: 1,
      name: 'User Story 4',
      description: 'us4 description',
      tasks: [
        { id: 1, name: 'Task 7', status: 'Done!' },
        { id: 2, name: 'Task 8', status: 'Done!' },
      ],
    } as UserStory;

    const expected = {
      storyStatus,
      taskList: updatedUserStory.tasks,
    };

    // Correct mocks
    jest.spyOn(tasksServices, 'deleteTask').mockResolvedValue(userStoryId);
    jest.spyOn(userStoriesServices, 'getUserStoryById').mockResolvedValue(storyStatus);         // returns string
    jest.spyOn(userStoriesServices, 'getUsersStoryById').mockResolvedValue(updatedUserStory);   // returns UserStory

    const result = await service.deleteTask(taskId, userId);

    expect(result).toEqual(expected);

    expect(tasksServices.deleteTask).toHaveBeenCalled();
    expect(tasksServices.deleteTask).toHaveBeenCalledWith(taskId, userId);

    expect(userStoriesServices.getUserStoryById).toHaveBeenCalled();
    expect(userStoriesServices.getUserStoryById).toHaveBeenCalledWith(userStoryId);

    expect(userStoriesServices.getUsersStoryById).toHaveBeenCalled();
    expect(userStoriesServices.getUsersStoryById).toHaveBeenCalledWith(userStoryId);
  });

});
