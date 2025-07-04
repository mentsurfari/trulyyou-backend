import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type CohortDocument = Cohort & Document;

@Schema({ timestamps: true })
export class Cohort {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, index: true })
  procedure_type: string;

  @Prop({ required: true, index: true })
  recovery_phase: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: Types.ObjectId[] | User[];
}

export const CohortSchema = SchemaFactory.createForClass(Cohort);