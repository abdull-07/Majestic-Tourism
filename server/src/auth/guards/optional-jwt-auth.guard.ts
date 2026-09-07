import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Like JwtAuthGuard, but never throws if there's no token —
// just leaves request.user undefined instead of blocking the request.
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context) as Promise<boolean> | boolean;
    }

    handleRequest(err: any, user: any) {
        return user || null;
    }
}