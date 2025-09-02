// Jest setup file
// 设置测试环境

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.WEBDAV_BASE_URL = 'https://dav.jianguoyun.com/dav/';
process.env.CORS_ALLOW_ORIGIN = '*';
process.env.REQUEST_TIMEOUT = '30000';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

