import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WsBearerTokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient();
    const header = socket.handshake.headers;
    const bearerToken = header['authorization'];
    const rawToken = bearerToken.split(' ')[1];
    if (!rawToken) {
      return false;
    }

    try {
      const decoded = jwt.verify(
        rawToken,
        this.configService.get<string>('JWT_SECRET'),
      );
      console.log('decoded', decoded);
      //   socket['userId'] = decoded;
      return true;
    } catch (error) {
      throw new WsException('Token is invalid');
    }
  }
}
