

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// Schema for Motivation Compass results
@Schema({ _id: false })
class MotivationCompass {
    @Prop({ type: Object })
    scores: Record<string, number>;
    
    @Prop()
    profile: string;
}

// Schema for Consultation Prep Kit data
@Schema({ _id: false })
class PrepKit {
    @Prop()
    journeyWhy: string;

    @Prop()
    hopes: string;

    @Prop()
    fears: string;

    @Prop()
    desiredFeelings: string;

    @Prop()
    medicalSnapshot: string;

    @Prop()
    supportSystem: string;

    @Prop()
    customQuestions: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  @Prop({ type: MotivationCompass })
  motivationCompass: MotivationCompass;

  @Prop({ type: PrepKit })
  prepKit: PrepKit;

  @Prop({ default: false })
  isDiscoverable: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
