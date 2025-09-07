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
import { BadRequestException } from '@nestjs/common';
import { LogInDto } from './auth.controller';
import e from 'express';

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

});
