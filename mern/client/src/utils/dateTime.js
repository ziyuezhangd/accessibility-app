import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import * as chrono from 'chrono-node';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.tz.setDefault('America/New_York');

export const getCurrentTimeInNewYork = () => {
  const now = dayjs.tz(dayjs(), 'America/New_York');
  return now;
};

/**
 *
 * @param {dayjs.Dayjs} day
 * @returns string of todays date (eg: 'Monday')
 */
export const getDayString = (day) => {
  return day.format('dddd');
};

/**
 *
 * @param {string} timeRangeString Supported formats: '9am-4pm' or '10:00am - 4:00pm'
 * @returns {chrono.en.ParsedResult[]} dayjs objects [startTime, endTime]
 */
export const parseTimeRangeFromString = (timeRangeString) => {
  return chrono.parse(timeRangeString, { timezone: 'EST' });
};

/**
 *
 * @param {Date} target date to check
 * @param {Date} date1 start date
 * @param {Date} date2 end date
 * @returns {boolean}
 */
export const isTimeInRange = (target, date1, date2) => {
  return target.isBetween(date1, date2);
};
