
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],  // 👈 Important so other modules like AuthModule can use it
})
export class MailModule {}