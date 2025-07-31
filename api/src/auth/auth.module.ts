import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { FeaturesModule } from 'src/features/features.module';
import { UserStoriesModule } from 'src/userStories/userStories.module';
import { TasksModule } from 'src/task/tasks.module';

@Module({
  imports: [
    ConfigModule, // <-- Add this
    UsersModule,
    ProjectsModule,
    FeaturesModule,
    UserStoriesModule,
    TasksModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // <-- ensure ConfigModule is available here
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // <-- safely fetch JWT_SECRET
       
        signOptions: { expiresIn: '600s' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}