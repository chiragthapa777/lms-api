import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import Piscina from 'piscina';

@Injectable()
export class WorkerPoolService {
  private pool: Piscina;
  constructor(private readonly configService: ConfigService) {
    this.pool = new Piscina({
      filename: resolve(__dirname, '../../workers/worker.js'),
      maxThreads:
        this.configService.get<number>('worker.maxThreads') ?? undefined,
      minThreads:
        this.configService.get<number>('worker.minThreads') ?? undefined,
      idleTimeout:
        this.configService.get<number>('worker.idleTimeout') ?? undefined,
    });
    console.log('Worker pool initialized');
  }

  async generatePdf(definition: Record<string, any>): Promise<Buffer> {
    return await this.pool.run(definition, { name: 'pdfGenerator' });
  }
}
