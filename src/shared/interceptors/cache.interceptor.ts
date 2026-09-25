import { ExecutionContext } from '@nestjs/common';
import { CacheInterceptor as NestCachInterceptor } from '@nestjs/cache-manager';
import { NO_CACHE_KEY } from '../decorators';

export class CacheInterceptor extends NestCachInterceptor {
  protected trackBy(context: ExecutionContext) {
    const noCache = this.reflector.get<boolean>(NO_CACHE_KEY, context.getHandler());
    if (noCache) {
      return undefined;
    }
    return super.trackBy(context);
  }
}
