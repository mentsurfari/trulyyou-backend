

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateCompassDto } from './dto/update-compass.dto';
import { UpdatePrepKitDto } from './dto/update-prep-kit.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(email: string, passwordHash: string): Promise<UserDocument> {
    const newUser = new this.userModel({ email, password: passwordHash });
    return newUser.save();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
  
  async findOneById(id: string): Promise<UserDocument | null> {
      return this.userModel.findById(id).exec();
  }

  async updateCompass(userId: string, data: UpdateCompassDto): Promise<User> {
      const user = await this.userModel.findByIdAndUpdate(
          userId,
          { $set: { motivationCompass: data } },
          { new: true } // returns the updated document
      ).select('-password');
      return user;
  }

  async updatePrepKit(userId: string, data: UpdatePrepKitDto): Promise<User> {
      const user = await this.userModel.findByIdAndUpdate(
          userId,
          { $set: { prepKit: data } },
          { new: true }
      ).select('-password');
      return user;
  }

  async updateDiscoverability(userId: string, isDiscoverable: boolean): Promise<User> {
      const user = await this.userModel.findByIdAndUpdate(
          userId,
          { $set: { isDiscoverable } },
          { new: true }
      ).select('-password');
      return user;
  }
  
  async findQualifiedCandidates(): Promise<Partial<User>[]> {
      // Find users who have completed the compass and prep kit, and have opted in
      return this.userModel.find({
          'motivationCompass.profile': { $exists: true },
          'prepKit.journeyWhy': { $exists: true, $ne: '' },
          isDiscoverable: true
      })
      .select('-password -roles -email -_id -isDiscoverable') // Anonymize the data
      .exec();
  }

}
