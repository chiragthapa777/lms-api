import { Injectable } from '@nestjs/common';
import moment, { ISO_8601, Moment } from 'moment';
import {
  ENUM_HELPER_DATE_DIFF,
  ENUM_HELPER_DATE_FORMAT,
} from '../constants/helper.enum.constant';
import { IHelperDateService } from '../interfaces/helper.date-service.interface';
import {
  DateGroupType,
  DateList,
  IHelperDateExtractDate,
  IHelperDateOptionsBackward,
  IHelperDateOptionsCreate,
  IHelperDateOptionsDiff,
  IHelperDateOptionsFormat,
  IHelperDateOptionsForward,
  IHelperDateOptionsRoundDown,
  IHelperDateStartAndEnd,
  IHelperDateStartAndEndDate,
} from '../interfaces/helper.interface';

@Injectable()
export class HelperDateService implements IHelperDateService {
  constructor() {}

  calculateAge(dateOfBirth: Date, year?: number): number {
    const m = moment();

    if (year) {
      m.set('year', year);
    }

    return m.diff(dateOfBirth, 'years');
  }

  diff(
    dateOne: Date,
    dateTwoMoreThanDateOne: Date,
    options?: IHelperDateOptionsDiff,
  ): number {
    const mDateOne = moment(dateOne);
    const mDateTwo = moment(dateTwoMoreThanDateOne);
    const diff = moment.duration(mDateTwo.diff(mDateOne));

    if (options?.format === ENUM_HELPER_DATE_DIFF.MILIS) {
      return diff.asMilliseconds();
    } else if (options?.format === ENUM_HELPER_DATE_DIFF.SECONDS) {
      return diff.asSeconds();
    } else if (options?.format === ENUM_HELPER_DATE_DIFF.HOURS) {
      return diff.asHours();
    } else if (options?.format === ENUM_HELPER_DATE_DIFF.MINUTES) {
      return diff.asMinutes();
    } else {
      return diff.asDays();
    }
  }

  check(date: string | Date | number): boolean {
    return moment(date, 'YYYY-MM-DD', true).isValid();
  }

  checkDateTime(date: string | Date | number): boolean {
    return moment(date, ISO_8601, true).isValid();
  }

  checkTimestamp(timestamp: number): boolean {
    return moment(timestamp, true).isValid();
  }

  create(
    date?: string | number | Date,
    options?: IHelperDateOptionsCreate,
  ): Date {
    const mDate = moment(date ?? undefined);

    if (options?.startOfDay) {
      mDate.startOf('day');
    }

    return mDate.toDate();
  }

  timestamp(
    date?: string | number | Date,
    options?: IHelperDateOptionsCreate,
  ): number {
    const mDate = moment(date ?? undefined);

    if (options?.startOfDay) {
      mDate.startOf('day');
    }

    return mDate.valueOf();
  }

  format(date: Date, options?: IHelperDateOptionsFormat): string {
    return moment(date).format(options?.format ?? ENUM_HELPER_DATE_FORMAT.DATE);
  }

  forwardInMilliseconds(
    milliseconds: number,
    options?: IHelperDateOptionsForward,
  ): Date {
    return moment(options?.fromDate).add(milliseconds, 'ms').toDate();
  }

  backwardInMilliseconds(
    milliseconds: number,
    options?: IHelperDateOptionsBackward,
  ): Date {
    return moment(options?.fromDate).subtract(milliseconds, 'ms').toDate();
  }

  forwardInSeconds(seconds: number, options?: IHelperDateOptionsForward): Date {
    return moment(options?.fromDate).add(seconds, 's').toDate();
  }

  backwardInSeconds(
    seconds: number,
    options?: IHelperDateOptionsBackward,
  ): Date {
    return moment(options?.fromDate).subtract(seconds, 's').toDate();
  }

  forwardInMinutes(minutes: number, options?: IHelperDateOptionsForward): Date {
    return moment(options?.fromDate).add(minutes, 'm').toDate();
  }

  backwardInMinutes(
    minutes: number,
    options?: IHelperDateOptionsBackward,
  ): Date {
    return moment(options?.fromDate).subtract(minutes, 'm').toDate();
  }

  forwardInHours(hours: number, options?: IHelperDateOptionsForward): Date {
    return moment(options?.fromDate).add(hours, 'h').toDate();
  }

  backwardInHours(hours: number, options?: IHelperDateOptionsBackward): Date {
    return moment(options?.fromDate).subtract(hours, 'h').toDate();
  }

  forwardInDays(days: number, options?: IHelperDateOptionsForward): Date {
    return moment(options?.fromDate).add(days, 'd').toDate();
  }

  backwardInDays(days: number, options?: IHelperDateOptionsBackward): Date {
    return moment(options?.fromDate).subtract(days, 'd').toDate();
  }

  forwardInMonths(months: number, options?: IHelperDateOptionsForward): Date {
    return moment(options?.fromDate).add(months, 'M').toDate();
  }

  backwardInMonths(months: number, options?: IHelperDateOptionsBackward): Date {
    return moment(options?.fromDate).subtract(months, 'M').toDate();
  }

  endOfMonth(date?: Date): Date {
    return moment(date).endOf('month').toDate();
  }

  startOfMonth(date?: Date): Date {
    return moment(date).startOf('month').toDate();
  }

  endOfYear(date?: Date): Date {
    return moment(date).endOf('year').toDate();
  }

  startOfYear(date?: Date): Date {
    return moment(date).startOf('year').toDate();
  }

  endOfDay(date?: Date): Date {
    return moment(date).endOf('day').toDate();
  }

  startOfDay(date?: Date): Date {
    return moment(date).startOf('day').toDate();
  }

  extractDate(date: string | Date | number): IHelperDateExtractDate {
    const newDate = this.create(date);
    const day: string = this.format(newDate, {
      format: ENUM_HELPER_DATE_FORMAT.ONLY_DATE,
    });
    const month: string = this.format(newDate, {
      format: ENUM_HELPER_DATE_FORMAT.ONLY_MONTH,
    });
    const year: string = this.format(newDate, {
      format: ENUM_HELPER_DATE_FORMAT.ONLY_YEAR,
    });

    return {
      date: newDate,
      day,
      month,
      year,
    };
  }

  roundDown(date: Date, options?: IHelperDateOptionsRoundDown): Date {
    const mDate = moment(date).set({ millisecond: 0 });

    if (options?.hour) {
      mDate.set({ hour: 0 });
    }

    if (options?.minute) {
      mDate.set({ minute: 0 });
    }

    if (options?.second) {
      mDate.set({ second: 0 });
    }

    return mDate.toDate();
  }

  getStartAndEndDate(
    options?: IHelperDateStartAndEnd,
  ): IHelperDateStartAndEndDate {
    const today = moment();
    const todayMonth = today.format(ENUM_HELPER_DATE_FORMAT.ONLY_MONTH);
    const todayYear = today.format(ENUM_HELPER_DATE_FORMAT.ONLY_YEAR);
    // set month and year
    const year = options?.year ?? todayYear;
    const month = options?.month ?? todayMonth;

    const date = moment(`${year}-${month}-02`, 'YYYY-MM-DD');
    let startDate: Date = date.startOf('month').toDate();
    let endDate: Date = date.endOf('month').toDate();

    if (options?.month) {
      const date = moment(`${year}-${month}-02`, 'YYYY-MM-DD');
      startDate = date.startOf('month').toDate();
      endDate = date.endOf('month').toDate();
    }

    return {
      startDate,
      endDate,
    };
  }

  createDateRange(
    payload: {
      date?: Moment | string | Date;
      fromDate?: Moment | Date | string;
      toDate?: Moment | string | Date;
      month?: number; // 0-11
      year?: number;
      dateRangeType: 'RANGE' | 'DATE' | 'MONTH' | 'YEAR' | 'WEEK';
    },
    offsetMin = 0,
  ) {
    const {
      date = moment(),
      fromDate = null,
      toDate = null,
      month, // 0-11
      year,
      dateRangeType,
    } = payload;

    // Adjust the initial reference time by the provided offset
    const referenceTime = moment.utc(date).add(offsetMin, 'minutes');
    let startTime, endTime;

    switch (dateRangeType) {
      case 'RANGE':
        if (!fromDate || !toDate) {
          throw new Error(
            'Both fromDate and toDate must be provided for RANGE type.',
          );
        }

        const startTemp = moment.utc(fromDate);
        const endTemp = moment.utc(toDate);

        if (startTemp.isAfter(endTemp)) {
          throw new Error('fromDate must be before toDate.');
        }
        startTime = moment
          .utc(fromDate)
          .add(offsetMin, 'minutes')
          .startOf('day');
        endTime = moment.utc(toDate).add(offsetMin, 'minutes').endOf('day');
        break;
      case 'DATE':
        startTime = referenceTime.clone().startOf('day');
        endTime = referenceTime.clone().endOf('day');
        break;
      case 'MONTH':
        if (month !== undefined && year !== undefined) {
          startTime = moment
            .utc([year, month])
            .add(offsetMin, 'minutes')
            .startOf('month');
          endTime = moment
            .utc([year, month])
            .add(offsetMin, 'minutes')
            .endOf('month');
        } else {
          startTime = referenceTime.clone().startOf('month');
          endTime = referenceTime.clone().endOf('month');
        }
        break;
      case 'YEAR':
        if (year !== undefined) {
          startTime = moment
            .utc([year])
            .add(offsetMin, 'minutes')
            .startOf('year');
          endTime = moment.utc([year]).add(offsetMin, 'minutes').endOf('year');
        } else {
          startTime = referenceTime.clone().startOf('year');
          endTime = referenceTime.clone().endOf('year');
        }
        break;
      case 'WEEK':
        // Adjust to start and end of week based on the reference time
        startTime = referenceTime.clone().startOf('isoWeek');
        endTime = referenceTime.clone().endOf('isoWeek');
        break;
      default:
        throw new Error('Invalid type provided');
    }

    // Apply the offset adjustment after calculating the start and end times
    startTime = startTime.add(offsetMin, 'minutes');
    endTime = endTime.add(offsetMin, 'minutes');

    return {
      startTime: startTime.toDate(),
      endTime: endTime.toDate(),
    };
  }

  generateDateArray(
    startDate: string,
    endDate: string,
    type: DateGroupType,
  ): DateList[] {
    const start = moment(startDate);
    const end = moment(endDate);

    const dateArray: DateList[] = [];

    const currentDate = start.clone();

    while (currentDate.isSameOrBefore(end)) {
      dateArray.push({
        fullDate: currentDate.format('YYYY-MM-DD'),
        fromDate: currentDate.clone().startOf(type).format('YYYY-MM-DD'),
        toDate: currentDate.clone().endOf(type).format('YYYY-MM-DD'),
        date: currentDate.format('DD'),
        year: currentDate.format('YYYY'),
        month: currentDate.format('MMMM'),
        day: currentDate.format('dddd'),
        from: currentDate.clone().startOf(type),
        to: currentDate.clone().endOf(type),
      });
      currentDate.add(1, type);
    }
    return dateArray;
  }
}
