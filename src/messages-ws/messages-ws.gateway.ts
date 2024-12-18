import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {


  @WebSocketServer() server: Server


  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization as string;
    let payload: JwtPayload;
    try {
      
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
      
    } catch (error) {
      client.disconnect();
      return;
    }
    
    // console.log({payload});

    
    this.server.emit('clients-updated', this.messagesWsService.getClients());    
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.unregisterClient(client.id);
    this.server.emit('clients-updated', this.messagesWsService.getClients());
  }


  // solo emite aun cliente, el actual
  @SubscribeMessage('message-from-client')
  handledMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(client.id, 'received message:', payload.message);


    client.emit('message-from-server', {
      fullname: this.messagesWsService.getUserFullnameBySocketId(client.id),
      message: payload.message || 'no message',
    });
  }
}
