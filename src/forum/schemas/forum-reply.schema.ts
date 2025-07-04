
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { ForumThread } from './forum-thread.schema';

export type ForumReplyDocument = ForumReply & Document;

@Schema({ timestamps: true })
export class ForumReply {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ type: Types.ObjectId, ref: 'ForumThread', required: true, index: true })
  thread: ForumThread;
}

export const ForumReplySchema = SchemaFactory.createForClass(ForumReply);
