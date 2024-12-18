import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface connectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    }
}


@Injectable()
export class MessagesWsService {

    private connectedClients: connectedClients = {};

    constructor( 
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }


    async registerClient(client: Socket, userId: string) {
        
        const user = await this.userRepository.findOneBy({ id: userId });

        if(!user) {
            throw new Error('user not found');
        }
        if (!user.isActive) {
            throw new Error('user is not active');
        }
        
        this.checkSocketActive(user);

        this.connectedClients[client.id] = {socket: client, user};
    }

    unregisterClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getClients(): string[] {
        return Object.keys(this.connectedClients);
    }

    getClientsNumber(): number {
        return Object.keys(this.connectedClients).length;
    }

    getUserFullnameBySocketId(socketId: string): string {
        const client = this.connectedClients[socketId].user.fullName;
        
        return client;
    }

    checkSocketActive(user: User) {
        for (const clientId of Object.keys(this.connectedClients)) {
            const connectedClient = this.connectedClients[clientId];
            if (connectedClient.user.id === user.id) {                
                connectedClient.socket.disconnect();
                return;
            }
        }
    }


}
