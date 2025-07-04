

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { ForumThread, ForumThreadSchema } from './schemas/forum-thread.schema';
import { ForumReply, ForumReplySchema } from './schemas/forum-reply.schema';
import { EventsModule } from '../events/events.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ForumThread.name, schema: ForumThreadSchema },
      { name: ForumReply.name, schema: ForumReplySchema },
    ]),
    EventsModule,
    NotificationsModule,
  ],
  providers: [ForumService],
  controllers: [ForumController],
})
export class ForumModule {}
