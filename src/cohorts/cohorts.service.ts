
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cohort, CohortDocument } from './schemas/cohort.schema';
import { FindOrCreateCohortDto } from './dto/find-or-create-cohort.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class CohortsService {
  constructor(@InjectModel(Cohort.name) private cohortModel: Model<CohortDocument>) {}

  async findOrCreate(dto: FindOrCreateCohortDto): Promise<CohortDocument> {
    const { procedure_type, recovery_phase } = dto;
    
    let cohort = await this.cohortModel.findOne({ procedure_type, recovery_phase }).exec();

    if (!cohort) {
      cohort = new this.cohortModel({
        ...dto,
        members: [], // Members array is initialized empty
      });
      await cohort.save();
    }
    return cohort;
  }

  async findOrCreateGeneralForum(): Promise<CohortDocument> {
    const generalForumIdentifier = { procedure_type: 'GENERAL_FORUM', recovery_phase: 'ALL' };
    
    let cohort = await this.cohortModel.findOne(generalForumIdentifier).exec();

    if (!cohort) {
        cohort = new this.cohortModel({
            ...generalForumIdentifier,
            name: 'The Sanctuary General Forum',
            description: 'A shared space for all members of the TrulyYou community to engage in broader discussions, ask general questions, and find shared wisdom.',
            members: [], // Members array is initialized empty
        });
        await cohort.save();
    }
    return cohort;
  }
  
  async findById(id: string): Promise<CohortDocument | null> {
    const cohort = await this.cohortModel.findById(id).exec();
    if (!cohort) {
        throw new NotFoundException(`Cohort with ID ${id} not found`);
    }
    return cohort;
  }
}