import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CohortsService } from './cohorts.service';
import { CohortsController } from './cohorts.controller';
import { Cohort, CohortSchema } from './schemas/cohort.schema';
import { PostsModule } from '../posts/posts.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cohort.name, schema: CohortSchema }]),
    PostsModule, // To use PostsService in CohortsController
    EventsModule, // To use EventsGateway for real-time updates
  ],
  controllers: [CohortsController],
  providers: [CohortsService],
})
export class CohortsModule {}