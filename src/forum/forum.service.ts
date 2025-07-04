

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForumThread, ForumThreadDocument } from './schemas/forum-thread.schema';
import { ForumReply, ForumReplyDocument } from './schemas/forum-reply.schema';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ForumService {
  constructor(
    @InjectModel(ForumThread.name) private threadModel: Model<ForumThreadDocument>,
    @InjectModel(ForumReply.name) private replyModel: Model<ForumReplyDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createThread(dto: CreateThreadDto, authorId: string): Promise<ForumThreadDocument> {
    const newThread = new this.threadModel({ ...dto, author: authorId });
    return newThread.save();
  }

  async createReply(dto: CreateReplyDto, authorId: string, threadId: string): Promise<ForumReplyDocument> {
    const thread = await this.threadModel.findById(threadId);
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }
    const newReply = new this.replyModel({
      ...dto,
      author: authorId,
      thread: threadId,
    });
    const savedReply = await newReply.save();
    const populatedReply = await this.replyModel.findById(savedReply._id).populate('author', 'email').exec();
    
    // Notify thread author if someone else replied
    if (thread.author.toString() !== authorId.toString()) {
        await this.notificationsService.create({
            recipient: thread.author.toString(),
            message: `${populatedReply.author.email.split('@')[0]} replied to your thread: "${thread.title}"`,
            link: `/sanctuary/threads/${threadId}`,
        });
    }

    return populatedReply;
  }

  async findAllThreads() {
      const threads = await this.threadModel
      .find()
      .populate('author', 'email')
      .sort({ sticky: -1, createdAt: -1 }) // Pinned threads first, then newest
      .exec();

    // This is not performant for large scale, but fine for this project.
    // In a real-world scenario, you'd store replyCount on the thread document.
    const threadsWithReplyCount = await Promise.all(
        threads.map(async (thread) => {
            const replyCount = await this.replyModel.countDocuments({ thread: thread._id });
            return {
                ...thread.toObject(),
                replyCount,
            };
        })
    );

    return threadsWithReplyCount;
  }

  async findThreadById(id: string): Promise<ForumThreadDocument> {
    const thread = await this.threadModel.findById(id).populate('author', 'email').exec();
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }
    return thread;
  }

  async findRepliesByThreadId(threadId: string): Promise<ForumReplyDocument[]> {
    return this.replyModel
      .find({ thread: threadId })
      .populate('author', 'email')
      .sort({ createdAt: 'asc' })
      .exec();
  }
}
