
import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { ForumService } from './forum.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { EventsGateway } from '../events/events.gateway';

@Controller('forum')
export class ForumController {
  constructor(
    private readonly forumService: ForumService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get('threads')
  async getAllThreads() {
    return this.forumService.findAllThreads();
  }

  @UseGuards(JwtAuthGuard)
  @Post('threads')
  async createThread(@Req() req, @Body() createThreadDto: CreateThreadDto) {
    const authorId = req.user._id;
    return this.forumService.createThread(createThreadDto, authorId);
  }

  @Get('threads/:id')
  async getThreadById(@Param('id') threadId: string) {
    const thread = await this.forumService.findThreadById(threadId);
    const replies = await this.forumService.findRepliesByThreadId(threadId);
    return { thread, replies };
  }

  @UseGuards(JwtAuthGuard)
  @Post('threads/:id/replies')
  async createReply(
    @Param('id') threadId: string,
    @Req() req,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    const authorId = req.user._id;
    const reply = await this.forumService.createReply(createReplyDto, authorId, threadId);
    
    // Broadcast the new reply to the thread room
    this.eventsGateway.broadcastNewReply(threadId, reply);

    return reply;
  }
}
