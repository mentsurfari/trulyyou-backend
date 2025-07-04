

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CohortsModule } from './cohorts/cohorts.module';
import { PostsModule } from './posts/posts.module';
import { EventsModule } from './events/events.module';
import { ForumModule } from './forum/forum.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // Make ConfigModule global to be available across the app
    ConfigModule.forRoot({
      isGlobal: true,
      // You can add a .env file for local development
      // envFilePath: '.env', 
    }),
    // Use an async factory for Mongoose to inject the ConfigService
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    AuthModule,
    UsersModule,
    CohortsModule,
    PostsModule,
    EventsModule,
    ForumModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}