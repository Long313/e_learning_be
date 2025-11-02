import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import type Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('REDIS_CLIENT') private readonly client: Redis) {}

  getClient() {
    return this.client;
  }

  async setWithTTL(key: string, value: string, ttlSec: number) {
    await this.client.set(key, value, 'EX', ttlSec);
  }

  async getAndDel(key: string): Promise<string | null> {
    const anyClient: any = this.client as any;
    if (typeof anyClient.getdel === 'function') {
      return anyClient.getdel(key);
    }
    const script = "local v=redis.call('GET', KEYS[1]); if v then redis.call('DEL', KEYS[1]); end; return v";
    const res = (await this.client.eval(script, 1, key)) as string | null;
    return res;
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}