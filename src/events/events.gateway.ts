

import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PostDocument } from '../posts/schemas/post.schema';
import { ForumReplyDocument } from '../forum/schemas/forum-reply.schema';
import { NotificationDocument } from '../notifications/schemas/notification.schema';

@WebSocketGateway({
  cors: {
    origin: [/http:\/\/localhost:\d+$/, /https:\/\/.*\.vercel\.app/], // Match the main server's explicit CORS policy.
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  @SubscribeMessage('join_cohort')
  handleJoinCohort(client: Socket, payload: { cohortId: string }): void {
    client.join(payload.cohortId);
    this.logger.log(`Client ${client.id} joined cohort: ${payload.cohortId}`);
  }

  @SubscribeMessage('join_thread')
  handleJoinThread(client: Socket, payload: { threadId: string }): void {
    client.join(payload.threadId);
    this.logger.log(`Client ${client.id} joined thread: ${payload.threadId}`);
  }

  @SubscribeMessage('join_user_room')
  handleJoinUserRoom(client: Socket, payload: { userId: string }): void {
      if (payload.userId) {
          client.join(payload.userId);
          this.logger.log(`Client ${client.id} joined user room: ${payload.userId}`);
      }
  }

  public broadcastNewPost(cohortId: string, post: PostDocument) {
    this.server.to(cohortId).emit('new_post', post);
    this.logger.log(`Broadcasting new post to cohort: ${cohortId}`);
  }

  public broadcastNewReply(threadId: string, reply: ForumReplyDocument) {
      this.server.to(threadId).emit('new_reply', reply);
      this.logger.log(`Broadcasting new reply to thread: ${threadId}`);
  }
  
  public sendNotificationToUser(userId: string, notification: NotificationDocument) {
      this.server.to(userId).emit('new_notification', notification);
      this.logger.log(`Sent notification to user room: ${userId}`);
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}