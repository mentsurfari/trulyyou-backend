
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ForumThreadDocument = ForumThread & Document;

@Schema({ timestamps: true })
export class ForumThread {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ default: false })
  sticky: boolean;
}

export const ForumThreadSchema = SchemaFactory.createForClass(ForumThread);
