import { SetMetadata } from '@nestjs/common';

export const NO_CACHE_KEY = 'noCache';
export const NoCache = () => SetMetadata(NO_CACHE_KEY, true);
