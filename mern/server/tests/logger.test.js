import fs from 'fs';
import path from 'path';
import { describe, it, expect } from '@jest/globals';
import logger from '../logger';

describe('Logger', () => {
  const serverPath = path.resolve();
  const logPath = path.join(serverPath, 'logs');

  describe('when called with error message', () => {
    it('should log error message to errors.log', (done) => {
      const errorMessage = 'Test error message id:' + Math.random().toString().slice(2);
      logger.error(errorMessage);

      setTimeout(() => {
        const errorLogContent = fs.readFileSync(path.join(logPath, 'errors.log'), 'utf8');
        expect(errorLogContent).toContain(errorMessage);
        done();
      }, 500);
    });
  
    it('should create logs folder if it does not exist', () => {
      expect(fs.existsSync(logPath)).toBeTruthy();
    });
  });

  it('should log exceptions to exceptions.log', (done) => {
    const exceptionMessage = 'Test exception message id:' + Math.random().toString().slice(2);

    process.emit('uncaughtException', new Error(exceptionMessage));

    setTimeout(() => {
      const exceptionLogContent = fs.readFileSync(path.join(logPath, 'exceptions.log'), 'utf8');
      expect(exceptionLogContent).toContain(exceptionMessage);
      done();
    }, 500);
  });
});