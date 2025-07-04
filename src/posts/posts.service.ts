import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto, authorId: string | UserDocument, cohortId: string): Promise<PostDocument> {
    const newPost = new this.postModel({
      ...createPostDto,
      author: authorId,
      cohort: cohortId,
    });
    const savedPost = await newPost.save();
    return this.postModel.findById(savedPost._id).populate('author', 'email').exec();
  }

  async findByCohort(cohortId: string): Promise<PostDocument[]> {
    return this.postModel
      .find({ cohort: cohortId })
      .populate('author', 'email') // Only select email from author
      .sort({ createdAt: 'asc' }) // Show oldest posts first
      .exec();
  }
}