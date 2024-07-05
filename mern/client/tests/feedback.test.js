import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Feedback, postFeedback } from '../src/services/feedback';
import { MANHATTAN_LAT, MANHATTAN_LNG } from '../src/utils/MapUtils';

const testName = 'Kate';
const testEmail = 'kate@example.com';
const testComment = 'Test';
const testCoordinates = [40.91, -73.55];
const testAge = 29;
const testGender = 'female';
const testConditions = 'Test';

describe('Class Feedback', () => {
  it('should create a feedback instance with coordinates', () => {
    const feedback = new Feedback(testName, testEmail, testComment, testAge, testGender, testConditions, testCoordinates);

    expect(feedback).toBeInstanceOf(Feedback);
    expect(feedback.name).toBe(testName);
    expect(feedback.email).toBe(testEmail);
    expect(feedback.comment).toBe(testComment);
    expect(feedback.age).toBe(testAge);
    expect(feedback.gender).toBe(testGender);
    expect(feedback.conditions).toBe(testConditions);
    expect(feedback.coordinates).toEqual(testCoordinates);
  });

  it('should handle invalid coordinates', () => {
    let invalidCoordinates = [41];
    expect(() => {
      new Feedback(testName, testEmail, testComment, testAge, testGender, testConditions, invalidCoordinates);
    }).toThrow(Error);

    invalidCoordinates = {latitude: 41, longitude: -73};
    expect(() => {
      new Feedback(testName, testEmail, testComment, testAge, testGender, testConditions, invalidCoordinates);
    }).toThrow(Error);
  });

  it('should handle suspicious coordinates', () => {
    jest.spyOn(console, 'warn');
    let suspiciousCoordinates = [MANHATTAN_LAT + 1.5, MANHATTAN_LNG];
    const feedback1 = new Feedback(testName, testEmail, testComment, testAge, testGender, testConditions, suspiciousCoordinates);
    expect(feedback1).toBeInstanceOf(Feedback);

    suspiciousCoordinates = [MANHATTAN_LAT - 1.1, MANHATTAN_LNG];
    const feedback2 = new Feedback(testName, testEmail, testComment, testAge, testGender, testConditions, suspiciousCoordinates);
    expect(feedback2).toBeInstanceOf(Feedback);

    suspiciousCoordinates = [MANHATTAN_LAT, MANHATTAN_LNG + 2];
    const feedback3 = new Feedback(testName, testEmail, testComment, testAge, testGender, testConditions, suspiciousCoordinates);
    expect(feedback3).toBeInstanceOf(Feedback);

    suspiciousCoordinates = [MANHATTAN_LAT, MANHATTAN_LNG - 1.7];
    const feedback4 = new Feedback(testName, testEmail, testComment, testAge, testGender, testConditions, suspiciousCoordinates);
    expect(feedback4).toBeInstanceOf(Feedback);

    suspiciousCoordinates = [MANHATTAN_LNG, MANHATTAN_LAT];
    const feedback5 = new Feedback(testName, testEmail, testComment, testAge, testGender, testConditions, suspiciousCoordinates);
    expect(feedback5).toBeInstanceOf(Feedback);

    expect(console.warn).toHaveBeenCalledTimes(5);
  });
});

describe('Function postFeedback', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should post feedback successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: true }));
    const feedback = new Feedback(testName, testEmail, testComment, testAge, testGender, testConditions, testCoordinates);

    const result = await postFeedback(feedback);
    expect(fetch).toHaveBeenCalledWith('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });
    expect(result).toEqual({ success: true });
  });

  it('should handle fetch error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'API error',
      })
    );
    const feedback = new Feedback(testName, testEmail, testComment, testAge, testGender, testConditions, testCoordinates);

    await expect(postFeedback(feedback)).rejects.toThrow(Error);
    expect(fetch).toHaveBeenCalledWith('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });
  });
});