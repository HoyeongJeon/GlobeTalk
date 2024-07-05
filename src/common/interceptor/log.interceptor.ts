import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const now = new Date();
    const req = context.switchToHttp().getRequest();

    console.log(`[REQ] ${req.path} ${now.toLocaleString('kr')}`);
    return next.handle().pipe(
      tap(() => {
        console.log(
          `[RES] ${req.path} ${new Date().toLocaleString('kr')} ${new Date().getTime() - now.getTime()}ms`,
        );
      }),
    );
  }
}
