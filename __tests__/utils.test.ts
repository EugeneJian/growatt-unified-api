/**
 * 工具函数测试
 */

import { validateProxyRequest, sanitizePath, validateOrigin, validateRequestSize } from '@/utils/validator';
import { createLogger, generateRequestId } from '@/utils/logger';
import { 
  createErrorResponse, 
  handleValidationError, 
  handleProxyError,
  ErrorType 
} from '@/utils/errorHandler';

describe('Validator Utils', () => {
  describe('validateProxyRequest', () => {
    it('should validate correct request', () => {
      const validRequest = {
        path: 'test-file.txt',
        options: {
          method: 'GET',
          headers: {
            'Authorization': 'Basic dGVzdDp0ZXN0'
          }
        }
      };

      const result = validateProxyRequest(validRequest);
      expect(result.valid).toBe(true);
    });

    it('should reject request without path', () => {
      const invalidRequest = {
        options: {
          method: 'GET'
        }
      };

      const result = validateProxyRequest(invalidRequest);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('path');
    });

    it('should reject request with invalid path', () => {
      const invalidRequest = {
        path: '../etc/passwd',
        options: {
          method: 'GET'
        }
      };

      const result = validateProxyRequest(invalidRequest);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid characters');
    });
  });

  describe('sanitizePath', () => {
    it('should clean multiple slashes', () => {
      expect(sanitizePath('//test//file.txt//')).toBe('test/file.txt');
    });

    it('should handle root path', () => {
      expect(sanitizePath('/')).toBe('/');
    });

    it('should remove leading slash', () => {
      expect(sanitizePath('/test/file.txt')).toBe('test/file.txt');
    });

    it('should remove trailing slash', () => {
      expect(sanitizePath('test/file.txt/')).toBe('test/file.txt');
    });
  });

  describe('validateOrigin', () => {
    it('should allow wildcard origin', () => {
      expect(validateOrigin('http://localhost:3000', ['*'])).toBe(true);
    });

    it('should allow specific origin', () => {
      expect(validateOrigin('http://localhost:3000', ['http://localhost:3000'])).toBe(true);
    });

    it('should reject unauthorized origin', () => {
      expect(validateOrigin('http://malicious.com', ['http://localhost:3000'])).toBe(false);
    });
  });

  describe('validateRequestSize', () => {
    it('should allow valid size', () => {
      const result = validateRequestSize('1024');
      expect(result.valid).toBe(true);
    });

    it('should reject oversized request', () => {
      const result = validateRequestSize('11000000'); // 11MB
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too large');
    });

    it('should handle null content length', () => {
      const result = validateRequestSize(null);
      expect(result.valid).toBe(true);
    });
  });
});

describe('Logger Utils', () => {
  describe('generateRequestId', () => {
    it('should generate unique request IDs', () => {
      const id1 = generateRequestId();
      const id2 = generateRequestId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^req_\d+_[a-z0-9]+$/);
    });
  });

  describe('createLogger', () => {
    it('should create logger with request ID', () => {
      const logger = createLogger('test-request-id');
      expect(logger).toBeDefined();
    });

    it('should create logger without request ID', () => {
      const logger = createLogger();
      expect(logger).toBeDefined();
    });
  });
});

describe('Error Handler Utils', () => {
  describe('createErrorResponse', () => {
    it('should create error response for ProxyError', () => {
      const error = handleValidationError('Test error', 'test-id');
      const response = createErrorResponse(error, 'test-id');
      
      expect(response.error).toBe('Test error');
      expect(response.details).toBe(ErrorType.VALIDATION_ERROR);
      expect(response.requestId).toBe('test-id');
      expect(response.timestamp).toBeDefined();
    });

    it('should create error response for generic error', () => {
      const error = new Error('Generic error');
      const response = createErrorResponse(error, 'test-id');
      
      expect(response.error).toBe('Internal server error');
      expect(response.requestId).toBe('test-id');
      expect(response.timestamp).toBeDefined();
    });
  });

  describe('Error handlers', () => {
    it('should create validation error', () => {
      const error = handleValidationError('Validation failed', 'test-id');
      
      expect(error.type).toBe(ErrorType.VALIDATION_ERROR);
      expect(error.statusCode).toBe(400);
      expect(error.requestId).toBe('test-id');
    });

    it('should create proxy error', () => {
      const originalError = new Error('Original error');
      const error = handleProxyError('Proxy failed', originalError, 'test-id');
      
      expect(error.type).toBe(ErrorType.PROXY_ERROR);
      expect(error.statusCode).toBe(502);
      expect(error.requestId).toBe('test-id');
      expect(error.message).toContain('Original error');
    });
  });
});
