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
 * @param {string} timeRangeString 
 * @returns {string|null} the formatted time range string or null if the string is too complex to format
 */
function formatTimeRangeString (timeRangeString){
  if (timeRangeString && !/\d/.test(timeRangeString)) {
    return null;
  }
  if (timeRangeString.includes('dusk') || timeRangeString.includes('spring summer')) {
    return null;
  }
  if (timeRangeString.includes('\n')) {
    return timeRangeString;
  }
  if (chrono.parse(timeRangeString).length === 1) {
    return timeRangeString;
  }

  const openingHours = {
    'Monday': 'Closed', 
    'Tuesday': 'Closed', 
    'Wednesday': 'Closed', 
    'Thursday': 'Closed', 
    'Friday': 'Closed', 
    'Saturday': 'Closed',
    'Sunday': 'Closed'
  };
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  if (timeRangeString === 'Bathrooms are open from 7 a.m.-7 p.m., with a one-hour closure for cleaning from 12 noon-1 p.m.') {
    Object.keys(openingHours).forEach(day => {
      openingHours[day] = '7am - 7pm';
    });
  }

  if (timeRangeString.includes('Monday to Friday:')) {
    const startIndex = timeRangeString.indexOf('Monday to Friday:');
    const endIndex = timeRangeString.indexOf(';', startIndex);
    let result;
    if (endIndex !== -1) {
      result = timeRangeString.substring(startIndex + 'Monday to Friday:'.length, endIndex).trim();
    } else {
      result = timeRangeString.substring(startIndex + 'Monday to Friday:'.length);
    }
    Object.keys(openingHours).forEach(day => {
      if (days.slice(0, 5).includes(day)) {
        openingHours[day] = result;
      }
    });
  }
  if (timeRangeString.includes('Saturday & Sunday:')) {
    const startIndex = timeRangeString.indexOf('Saturday & Sunday:');
    const endIndex = timeRangeString.indexOf(';', startIndex);
    let result;
    if (endIndex !== -1) {
      result = timeRangeString.substring(startIndex + 'Saturday & Sunday:'.length, endIndex).trim();
    } else {
      result = timeRangeString.substring(startIndex + 'Saturday & Sunday:'.length);
    }
    Object.keys(openingHours).forEach(day => {
      if (days.slice(5).includes(day)) {
        openingHours[day] = result;
      }
    });
  }
  if (timeRangeString.includes('Monday to Saturday:')) {
    const startIndex = timeRangeString.indexOf('Monday to Saturday:');
    const endIndex = timeRangeString.indexOf(';', startIndex);
    let result;
    if (endIndex !== -1) {
      result = timeRangeString.substring(startIndex + 'Monday to Saturday:'.length, endIndex).trim();
    } else {
      result = timeRangeString.substring(startIndex + 'Monday to Saturday:'.length);
    }
    Object.keys(openingHours).forEach(day => {
      if (days.slice(0, 6).includes(day)) {
        openingHours[day] = result;
      }
    });
    if (timeRangeString.includes('Sunday:')) {
      const startIndex = timeRangeString.indexOf('Sunday:');
      const endIndex = timeRangeString.indexOf(';', startIndex);
      let result;
      if (endIndex !== -1) {
        result = timeRangeString.substring(startIndex + 'Sunday:'.length, endIndex).trim();
      } else {
        result = timeRangeString.substring(startIndex + 'Sunday:'.length);
      }
      openingHours.Sunday = result;
    } else if (timeRangeString.includes('Sundays:')) {
      const startIndex = timeRangeString.indexOf('Sundays:');
      const endIndex = timeRangeString.indexOf(';', startIndex);
      let result;
      if (endIndex !== -1) {
        result = timeRangeString.substring(startIndex + 'Sundays:'.length, endIndex).trim();
      } else {
        result = timeRangeString.substring(startIndex + 'Sundays:'.length);
      }
      openingHours.Sunday = result;
    } else if (timeRangeString.includes('Sunday & holidays:')) {
      const startIndex = timeRangeString.indexOf('Sunday & holidays:');
      const endIndex = timeRangeString.indexOf(';', startIndex);
      let result;
      if (endIndex !== -1) {
        result = timeRangeString.substring(startIndex + 'Sunday & holidays:'.length, endIndex).trim();
      } else {
        result = timeRangeString.substring(startIndex + 'Sunday & holidays:'.length);
      }
      openingHours.Sunday = result;
    }
  }

  let formattedString = '';
  for (const day in openingHours) {
    formattedString += `${day}: ${openingHours[day]} \n`;
  }
  return formattedString;
}

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
 * @returns {chrono.en.ParsedResult[]|null} parsed results from time string (see chrono docs for more info), returns null if the string cannot be parsed
 */
export const parseTimeRangeFromString = (timeRangeString) => {
  const formattedString = formatTimeRangeString(timeRangeString);
  
  if (formattedString !== null) {
    return chrono.parse(formattedString);
  } else {
    return null;
  }
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
  return target.isBetween(date1, date2, null, '[]');
};

/**
 * Check if NY is in DST now: DST begins on the second Sunday of March and ends on the first Sunday of November
 * @returns {boolean}
 */
export const isDSTNow = () => {
  const now = getCurrentTimeInNewYork();

  const year = now.year();
  let dstStart = dayjs.tz(`${year}-03-01 00:00:00`, 'America/New_York').add(1, 'week').day(0);
  if (dstStart < dayjs.tz(`${year}-03-08 00:00:00`, 'America/New_York')) {
    dstStart = dstStart.add(1, 'week');
  }
  let dstEnd = dayjs.tz(`${year}-11-01 00:00:00`, 'America/New_York').day(0);
  if (dstEnd < dayjs.tz(`${year}-11-01 00:00:00`, 'America/New_York')) {
    dstEnd = dstEnd.add(1, 'week');
  }
  const isDST = now.isBetween(dstStart, dstEnd, null, '[]');

  return isDST;
};
