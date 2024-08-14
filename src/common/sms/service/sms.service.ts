import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { ENUM_APP_ENVIRONMENT } from 'src/common/constants/app.constant';

@Injectable()
export class SmsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async sendSMSUsingSparrow(
    to: string,
    message: string,
  ): Promise<AxiosResponse<any[]> | any> {
    const url = this.configService.get<string>('sms.sparrow_base');
    if (!url) throw 'Cannot find url';
    if (
      this.configService.get('APP_ENV') !== ENUM_APP_ENVIRONMENT.DEVELOPMENT
    ) {
      return await firstValueFrom(
        this.httpService.post(url, {
          token: this.configService.get<string>('sms.sparrow_token'),
          from: this.configService.get<string>('sms.sparrow_sender'),
          to: to,
          text: message,
        }),
      );
    } else {
      return null;
    }
  }

  sendSMSUsingAakash(
    to: string,
    message: string,
  ): Observable<AxiosResponse<any[]>> {
    const url = this.configService.get<string>('sms.aakash_base');
    if (!url) throw 'Cannot find url';
    return this.httpService
      .post(url, {
        auth_token: this.configService.get<string>('sms.aakash_token'),
        to: to,
        text: message,
      })
      .pipe(
        catchError((error: AxiosError) => {
          console.log(error?.response?.data);
          throw 'An error happened!';
        }),
      );
  }
}
