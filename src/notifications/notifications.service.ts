
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { EventsGateway } from '../events/events.gateway';

interface CreateNotificationDto {
    recipient: string;
    message: string;
    link: string;
}

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
        private readonly eventsGateway: EventsGateway,
    ) {}

    async create(dto: CreateNotificationDto): Promise<NotificationDocument> {
        const newNotification = new this.notificationModel(dto);
        const savedNotification = await newNotification.save();
        this.eventsGateway.sendNotificationToUser(savedNotification.recipient.toString(), savedNotification);
        return savedNotification;
    }

    async findByUser(userId: string): Promise<NotificationDocument[]> {
        return this.notificationModel
            .find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .exec();
    }

    async markAsRead(notificationId: string, userId: string): Promise<NotificationDocument | null> {
        return this.notificationModel.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { read: true },
            { new: true },
        ).exec();
    }
}
