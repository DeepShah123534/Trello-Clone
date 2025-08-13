import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccountDetailDto } from './auth.controller';
import { MailService } from 'src/mail/mail.service';
import { ProjectsService } from 'src/projects/projects.service';
import { FeaturesService } from 'src/features/features.service';
import { UserStoriesService } from 'src/userStories/userStories.service';
import { TasksService } from 'src/task/tasks.service';


@Injectable()
export class AuthService {
  constructor(
    private usersServices: UsersService,
    private projectsServices: ProjectsService,
    private jwtService: JwtService,
    private featuresService: FeaturesService,
    private tasksService: TasksService,
    private userStoriesService: UserStoriesService,
    private mailService: MailService,
  ) {}

  async hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async createAccessToken(user) {

    const payload = { sub: user.id};
    return  await this.jwtService.signAsync(payload);
  }

  async signUp(signUpDto) {

    const userResult = await this.usersServices.findUserByUsername(signUpDto.username);
    const usernameExists = !!(userResult && userResult.username);



    const userEmailUser = await this.usersServices.findUserByEmail(signUpDto.email);
    const useremailExists = !!(userEmailUser && userEmailUser.email);

    if (usernameExists) {
      throw new BadRequestException('Username already exists');
    }
    if (useremailExists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(signUpDto.password);
    signUpDto.password = hashedPassword;
    const user = await this.usersServices.createuser(signUpDto);

    return await this.createAccessToken(user);
  }

  async verifyPassword(enteredPassword: string, storedPassword: string) {
    return await bcrypt.compare(enteredPassword, storedPassword);
  }

  async logIn(logInDto) {
// Check if the user exists
    const user = await this.usersServices.findUserByUsername(logInDto.username);

// User doesn't exist, so we throw an error
    if (!user) {
      throw new UnauthorizedException();
    }

// verify password matches
    const passwordsMatch = await this.verifyPassword(logInDto.password, user.password);

// if password does not match, throw an error
    if (!passwordsMatch) {
      throw new UnauthorizedException;
    }
// create access token and return it
    return await this.createAccessToken(user);
  }

  async changeAccountDetails(accountDetailDto: AccountDetailDto) {
    
    const user = await this.usersServices.findUserByUsername(
      accountDetailDto.username
    );

    if (user == null) {
      throw new BadRequestException('User not found');
    }

    if (accountDetailDto.field === 'password') {
      const plainTextPassword = accountDetailDto.value;
      const hashedPassword = await this.hashPassword(plainTextPassword);
      user[accountDetailDto.field] = hashedPassword;
    } else {
      user[accountDetailDto.field] = accountDetailDto.value;
    }

    const updatedUser = await this.usersServices.createuser(user);
    return{
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    }
  }

    async getProfileData(id: number){
    const user = await this.usersServices.findUserById(id);
    return {
      email: user?.email,
      name: user?.name,
      username: user?.username,
    };
  }

  async sendResetPassword(email: string) {
    const user = await this.usersServices.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException('No user found with that email address');
    }

    // For now: basic token — you can later replace this with a JWT or a DB-stored token
    const token = await this.jwtService.signAsync(
    { sub: user.id },
    {
      secret: process.env.JWT_SECRET, // must match the one used in verifyAsync
      expiresIn: '15m', // optional
    }
  );

    // 📧 Send the reset email
    await this.mailService.sendPasswordResetEmail(user, token);

    return { message: 'Password reset email sent' };
  }

  async saveNewPassword(newPassword: string, id: number, token: string) {
    const user = await this.usersServices.findUserById(id);
    if (!user) throw new BadRequestException('User not found');

    await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    }) 
    .catch(() => {
      throw new UnauthorizedException('token is invalid');
    }) 
    .then(async () => {
      const hashedPassword = await this.hashPassword(newPassword);
      user.password = hashedPassword;
      return await this.usersServices.createuser(user);
    })
  }
   
  async deleteUser(id: number) {
    return await this.usersServices.deleteUser(id);
  }

  async getUserProjects(userId: number) {
    const user = await this.getProfileData(userId);
    const projects = await this.projectsServices.getUserProjects(userId)
    console.log('USER: ', user);
    console.log('PROJECTS: ', projects );
    return { user, projects, };
  }

  async getProject(id: number, userId: number) {
    const projects = await this.projectsServices.getUserProjects(userId);
    return projects.find((project) => project.id === id);
  }


  async createProject(name: string, description: string, userId: number) {
    return await this.projectsServices.createProject(name, description, userId);
  }

  async createFeature(name: string, description: string, userId: number, projectId: number) {
    const projects = await this.projectsServices.getUserProjects(userId);
    const project = projects.find((project) => project.id === projectId);


    if (project && project.id) {
      await this.featuresService.createFeature(name, description, projectId);
      return await this.projectsServices.getProjectById(projectId)
    } else {
      throw new UnauthorizedException('project not found');
    }
  }

    async createUserStory(name: string, description: string, userId: number, featureId: number, projectId: number) {
      const projects = await this.projectsServices.getUserProjects(userId);

      const project = projects.find((project) => project.id === projectId);

      if (!project || !project.features) {
        console.log("❌ Project or its features not found!");
        throw new UnauthorizedException('project or features not found');
      }
      const features = project.features;
      const feature = project.features.find((feature) => feature.id === featureId);

      if (feature && feature.id) {
        await this.userStoriesService.createUserStory(name, description, featureId);
        return await this.projectsServices.getProjectById(projectId);
      } else {
        console.log("❌ Feature not found!");
        throw new UnauthorizedException('feature not found');
      }
    }

    async createTask(
      name: string, 
      userId: number, 
      projectId: number, 
      featureId: number, 
      userStoryId: number,
    ) {
      const projects = await this.projectsServices.getUserProjects(userId);
      const project = projects.find((project) => project.id === projectId);

      if (!project || !project.features) {
        console.log("❌ Project or its features not found!");
        throw new UnauthorizedException('project or features not found');
      }

      const features = project.features;
      const feature = project.features.find((feature) => feature.id === featureId);

      if (!feature || !feature.userStories) {
        console.log("❌ Feature or its user stories not found!");
        throw new UnauthorizedException('feature or user stories not found');
      }

      const userStories = feature.userStories;
      const userStory = userStories.find((story) => story.id === userStoryId)

      console.log('USER STORY', userStory)

      if (userStory && userStory.id) {
        await this.tasksService.createTask(name, userStoryId);
        return await this.projectsServices.getProjectById(projectId);
      } else {
        console.log("❌ user story not found!");
        throw new UnauthorizedException('user story not found');
      }
    }

    async updateUserStory(
      field: string, 
      value: string, 
      userId: number,
      userStoryId: number,
    ) {
      const projectId = await this.userStoriesService.updateUserStory(field, value, userId, userStoryId);
      return await this.projectsServices.getProjectById(projectId);
    } 

    async deleteUserStory(userStoryId: number, userId: number) {
      const projectId = await this.userStoriesService.deleteUserStory(userStoryId, userId);
      return await this.projectsServices.getProjectById(projectId);
    }

    async updateTask(
      field: string,
      value: string, 
      userId: number,
      taskId: number,
    ) {
      const userStoryId =  await this.tasksService.updateTask(field, value,userId, taskId);
      return await this.userStoriesService.getUserStoryById(userStoryId);
    
    }

    async updateFeature(
      field: string, 
      value: string, 
      userId: number,
      featureId: number,
    ) {
      const projectId = await this.featuresService.updateFeature(field, value, userId, featureId);
      return await this.projectsServices.getProjectById(projectId);
    } 

    async deleteFeature(featureId: number,  userId: number,){
      const projectId = await this.featuresService.deleteFeature(featureId, userId);
      return await this.projectsServices.getProjectById(projectId);
    }

    async updateProject(
      field: string, 
      value: string, 
      userId: number,
      projectId: number,
    ) {
      return await this.projectsServices.updateProject(field, value, userId, projectId);
    } 

    async deleteTask(taskId: number, userId: number) {
      const userStoryId = await this.tasksService.deleteTask(taskId, userId);

      const storyStatus = await this.userStoriesService.getUserStoryById(userStoryId);

      const updatedUserStory = await this.userStoriesService.getUsersStoryById(userStoryId);

      return  {
        storyStatus,
        taskList: updatedUserStory ? updatedUserStory.tasks : [],
      }
    }

    async deleteProject(projectId: number,  userId: number,){
      return await this.projectsServices.deleteProject(projectId, userId);

    }
}