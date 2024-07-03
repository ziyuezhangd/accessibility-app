/**
 * @file Utility functions for doing operations on dates/times. Leverages the chrono and dayjs libraries.
 */

import * as chrono from 'chrono-node';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.tz.setDefault('America/New_York');

/**
 *
 * Get the current time in New York
 *
 * @returns {dayjs.Dayjs} a dayjs object representing the current date/time in New York
 */
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
 * Given a string representation of a time range, extract and deduce the start and end times
 * using the chrono library.
 *
 * @param {string} timeRangeString a human-readable string representing a time range (eg: "10am-4pm")
 * @returns {chrono.en.ParsedResult[]} parsed results from time string (see chrono docs for more info)
 */
export const parseTimeRangeFromString = (timeRangeString) => {
  return chrono.parse(timeRangeString);
};

/**
 *
 * Check if a date/time is between two date/times
 * @param {Date} target date to check
 * @param {Date} date1 start date
 * @param {Date} date2 end date
 * @returns {boolean}
 */
export const isTimeInRange = (target, date1, date2) => {
  return target.isBetween(date1, date2);
};
