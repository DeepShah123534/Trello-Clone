import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';
import { Transform, Type } from 'class-transformer';
import { AuthGuard } from './auth.guard';


export class SignUpDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  name: string;

  @IsEmail()
  @Transform((params) => sanitizeHtml(params.value))
  email: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  username: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  password: string;
};

export class LogInDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  username: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  password: string;
};

export class AccountDetailDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  field: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  value: string;
};

export class Email {
  @IsEmail(undefined, { message: 'Please enter a valid email address!' })
  @Transform((params) => sanitizeHtml(params.value))
  email: string;
}

export class newPasswordDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  newPassword: string;

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  token: string;

}

export class ProjectDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  name: string;

  @IsOptional()
  @Transform((params) => sanitizeHtml(params.value))
  description: string;
}

export class FeatureDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  name: string;

  @IsOptional()
  @Transform((params) => sanitizeHtml(params.value))
  description: string;

  @IsNotEmpty()
  projectId: number;
}

export class UserStoryDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  name: string;

  @IsOptional()
  @Transform((params) => sanitizeHtml(params.value))
  description: string;

  @IsNotEmpty()
  @Type(() => Number)
  featureId: number;

  @IsNotEmpty()
  projectId: number;
}

export class TaskDto {
  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  name: string;

  @IsNotEmpty()
  projectId: number;

  @IsNotEmpty()
  @Type(() => Number)
  featureId: number;

  @IsNotEmpty()
  userStoryId: number;

}

export class UpdateTaskDto {

  @IsNotEmpty()
  field: string;

  @IsNotEmpty()
  @Transform((params) => sanitizeHtml(params.value))
  value: string;

  @IsNotEmpty()
  taskId: number;
}


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('log-in')
  logIn(@Body() logInDto: LogInDto) {
    return this.authService.logIn(logInDto);
  }

  @UseGuards(AuthGuard)
  @Post('change-account-detail')
  changeAccountDetail(@Body() accountDetailDto: AccountDetailDto) {
    return this.authService.changeAccountDetails(accountDetailDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfileData(@Request() req) {
    return this.authService.getProfileData(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('project/:id')
  getProject(@Param('id') id: number, @Request() req) {
    return this.authService.getProject( id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('user-projects')
  getUserProjects(@Request() req) {
    return this.authService.getUserProjects(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('create-projects')
  createProject(@Body() projectDto: ProjectDto, @Request() req) {
    return this.authService.createProject(
      projectDto.name,
      projectDto.description,
      req.user.sub,
    );
  }

  @UseGuards(AuthGuard)
  @Post('create-feature')
  createFeature(@Body() featureDto: FeatureDto, @Request() req) {
    return this.authService.createFeature(
      featureDto.name,
      featureDto.description,
      req.user.sub,
      featureDto.projectId,
    );
  }

  @UseGuards(AuthGuard)
  @Post('create-user-story')
  createUserStory(@Body() userStoryDto: UserStoryDto, @Request() req) {
    console.log('user story dto: ', userStoryDto, req.user.sub )
    return this.authService.createUserStory(
      userStoryDto.name,
      userStoryDto.description,
      req.user.sub,
      userStoryDto.featureId,
      userStoryDto.projectId,
    )
  }

  @UseGuards(AuthGuard)
  @Post('create-task')
  createTask(@Body() taskDto: TaskDto, @Request() req) {
    console.log('TASK DTO', taskDto, req.user.sub)
    return this.authService.createTask(
      taskDto.name,
      req.user.sub,
      taskDto.projectId,
      taskDto.featureId,
      taskDto.userStoryId,
    )
  }

  @UseGuards(AuthGuard)
  @Post('update-task')
  updateTask(@Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return this.authService.updateTask(
      updateTaskDto.field,
      updateTaskDto.value,
      req.user.sub,
      updateTaskDto.taskId,
    )
  }

  @Post('reset-password')
  sendResetPasswordEmail(@Body() email: Email) {
    return this.authService.sendResetPassword(email.email);
  }

  @Post('save-new-password')
  saveNewPassword(@Body() body: newPasswordDto) {
    return this.authService.saveNewPassword(
      body.newPassword,
      body.id,
      body.token);
  }

  @UseGuards(AuthGuard)
  @Post('delete-user')
  deleteuser(@Request() req){
    return this.authService.deleteUser(req.user.sub);
  }

}