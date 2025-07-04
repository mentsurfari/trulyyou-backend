
import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { CohortsService } from './cohorts.service';
import { FindOrCreateCohortDto } from './dto/find-or-create-cohort.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from '../posts/posts.service';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { EventsGateway } from '../events/events.gateway';

@Controller('cohorts')
export class CohortsController {
  constructor(
    private readonly cohortsService: CohortsService,
    private readonly postsService: PostsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Post('find-or-create')
  async findOrCreate(@Body() findOrCreateCohortDto: FindOrCreateCohortDto) {
    // This endpoint is now public, it no longer requires authentication.
    return this.cohortsService.findOrCreate(findOrCreateCohortDto);
  }

  @Get('general-forum')
  async getGeneralForum() {
      // This endpoint is now public.
      return this.cohortsService.findOrCreateGeneralForum();
  }

  @Get(':id/posts')
  async getPostsForCohort(@Param('id') cohortId: string) {
    // This endpoint is public for viewing posts.
    const cohort = await this.cohortsService.findById(cohortId);
    const posts = await this.postsService.findByCohort(cohortId);
    return { cohort, posts };
  }

  @UseGuards(JwtAuthGuard) // Guard is now applied only to this method.
  @Post(':id/posts')
  async createPost(
      @Param('id') cohortId: string, 
      @Body() createPostDto: CreatePostDto,
      @Req() req,
    ) {
      const authorId = req.user._id;
      const post = await this.postsService.create(createPostDto, authorId, cohortId);
      
      // Broadcast the new post to the cohort room
      this.eventsGateway.broadcastNewPost(cohortId, post);

      return post;
  }
}