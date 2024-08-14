import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UsersPasswordAttempt } from './types/user.cache.type';

@Injectable()
export class CustomCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheStorage: Cache) {}

  async setData(key: string, id: number) {
    let result: UsersPasswordAttempt[] | undefined =
      await this.cacheStorage.get(key);
    if (result) {
      const check = this.isUserPresent(id, result);
      if (!check) {
        result.push({
          userId: id,
          passwordAttempt: 1,
        });
      } else {
        result = this.increaseCounter(id, result);
      }
    } else {
      result = [{ userId: id, passwordAttempt: 1 }];
    }
    await this.cacheStorage.set(key, result);
    return await this.getData(key, id);
  }

  async getData(key: string, id: number) {
    const result: UsersPasswordAttempt[] | undefined =
      await this.cacheStorage.get(key);
    let value;
    if (result) {
      result.forEach((element) => {
        if (element.userId === id) {
          value = element;
        }
      });
    }
    return { ...value };
  }

  isUserPresent(id: number, users: UsersPasswordAttempt[]): boolean {
    return users.some((user: UsersPasswordAttempt) => user.userId === id);
  }

  increaseCounter(
    id: number,
    users: UsersPasswordAttempt[],
  ): UsersPasswordAttempt[] {
    const data = users.map((user) => {
      if (user.userId === id) {
        return { ...user, passwordAttempt: user.passwordAttempt + 1 };
      }
      return user;
    });

    return data;
  }

  async removeUser(key: string, id: number) {
    const result: UsersPasswordAttempt[] | undefined =
      await this.cacheStorage.get(key);
    if (result) {
      const data = result.filter(
        (user: UsersPasswordAttempt) => user.userId !== id,
      );
      await this.cacheStorage.set(key, data);
    }
  }
}
