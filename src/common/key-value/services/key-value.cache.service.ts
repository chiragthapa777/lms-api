import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { IKeyValueService } from '../interfaces';
import { IGetKeyData } from '../interfaces/key-value.interface';

@Injectable({})
export class KeyValueCacheService implements IKeyValueService {
  maxRequest: number;
  maxRequestTime: number;
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly configService: ConfigService,
  ) {
    this.maxRequest = Number(this.configService.get('helper.maxRequest'));
    this.maxRequestTime = Number(
      this.configService.get('helper.maxRequestTime'),
    );
  }

  generateKey(data: IGetKeyData): string {
    return `${data.module ?? ''}:${data.feature ?? ''}:${
      data.identifier ?? ''
    }`;
  }

  /**
   * @async
   * function to get the value of key in redis
   * @param key {string}
   * @returns {Promise<string|null>}
   */
  async get(key: string): Promise<string | null | undefined> {
    const data: string | null | undefined = await this.cache.get(key);
    return data;
  }

  /**
   * @async
   * function to increment the count of key which stores number
   * @param key {string}
   * @param by {number?} - count by which the number should be incremented, default is 1.
   * @returns {Promise<number>}
   */
  async increment(key: string, by: number = 1): Promise<any> {
    const ttl = this.maxRequestTime * 1000;

    const data = await this.keyExists(key);
    if (data) {
      const resp: string | undefined = await this.cache.get(key);
      await this.cache.set(key, Number(resp) + by, ttl);
    }
  }

  /**
   * @async
   * function to decrement the count of key which stores number
   * @param key {string}
   * @param by {number?} - count by which the number should be decremented, default is 1.
   * @returns {Promise<number>}
   */
  async decrement(key: string, by: number = 1): Promise<any> {
    const ttl = this.maxRequestTime * 1000;

    const data = await this.keyExists(key);
    if (data) {
      const resp: string | undefined = await this.cache.get(key);
      await this.cache.set(key, Number(resp) - by, ttl);
    }
  }

  /**
   * @async
   * function to set the key value pair in redis
   * @param key {string}
   * @param value {number?} - default 1
   * @param options {any} - extra options
   */
  async set(key: string, value: number | string): Promise<void> {
    const ttl = this.maxRequestTime * 1000;

    await this.cache.set(key, value, ttl);
  }

  /**
   * @async
   * function to check if key exists
   * @param key {string}
   * @returns {Promise<boolean>}
   */
  async keyExists(key: string): Promise<boolean> {
    const data = await this.cache.get(key);
    return !!data;
    // return !!(await this.cache.get(key));
  }

  /**
   * @async
   * function to remove key
   * @param key {string}
   * @returns {Promise<boolean>}
   */
  async removeKey(key: string): Promise<boolean> {
    if (await this.keyExists(key)) {
      await this.cache.del(key);
      return true;
    }
    return false;
  }

  /**
   * function to get key from module, feature and identifier
   * example: key = `user:passwordAttempt:1234`
   * @param key
   * @returns
   */
  async checkRequestData(
    key: string,
    isPasswordAttempt: boolean,
  ): Promise<number> {
    const check = await this.keyExists(key);
    if (check) {
      if (!isPasswordAttempt) {
        const result = Number(await this.get(key));
        if (result >= this.maxRequest) {
          throw new HttpException(
            'Request Limit Exceed! Please Try Again Later.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
      }

      await this.increment(key);

      return Number(await this.get(key));
    } else {
      await this.set(key, 1);
      return Number(await this.get(key));
    }
  }
}
