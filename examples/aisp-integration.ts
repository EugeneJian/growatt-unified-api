/**
 * AISP WebDAV 集成示例
 * 展示如何在 AISP 应用中集成 CORS 代理服务
 */

import type { 
  IWebDAVClient, 
  WebDAVClientConfig, 
  WebDAVFileInfo, 
  ProxyResponse
} from '../types/aisp-webdav';
import { WebDAVError, WebDAVErrorType } from '../types/aisp-webdav';

/**
 * AISP WebDAV 客户端实现
 */
export class AISPWebDAVClient implements IWebDAVClient {
  private config: WebDAVClientConfig;
  private credentials: string;

  constructor(config: WebDAVClientConfig) {
    this.config = {
      timeout: 30000,
      ...config
    };
    this.credentials = btoa(`${config.username}:${config.password}`);
  }

  /**
   * 发送请求到代理服务
   */
  private async makeRequest(path: string, options: any): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: path,
          options: {
            ...options,
            headers: {
              'Authorization': `Basic ${this.credentials}`,
              ...options.headers
            }
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new WebDAVError('请求超时', WebDAVErrorType.TIMEOUT_ERROR, 504);
      }
      throw error;
    }
  }

  /**
   * 处理响应
   */
  private async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: 'Unknown error' };
      }

      const errorType = this.getErrorType(response.status);
      throw new WebDAVError(
        errorData.error || 'Request failed',
        errorType,
        response.status,
        errorData.requestId
      );
    }

    return response;
  }

  /**
   * 根据状态码获取错误类型
   */
  private getErrorType(status: number): WebDAVErrorType {
    switch (status) {
      case 400:
        return WebDAVErrorType.VALIDATION_ERROR;
      case 401:
        return WebDAVErrorType.AUTHENTICATION_ERROR;
      case 403:
        return WebDAVErrorType.AUTHORIZATION_ERROR;
      case 404:
        return WebDAVErrorType.NOT_FOUND_ERROR;
      case 500:
        return WebDAVErrorType.INTERNAL_ERROR;
      case 502:
      case 503:
        return WebDAVErrorType.PROXY_ERROR;
      case 504:
        return WebDAVErrorType.TIMEOUT_ERROR;
      default:
        return WebDAVErrorType.INTERNAL_ERROR;
    }
  }

  /**
   * 列出目录内容
   */
  async listDirectory(path: string = ''): Promise<WebDAVFileInfo[]> {
    const response = await this.makeRequest(path, {
      method: 'PROPFIND',
      headers: {
        'Depth': '1',
        'Content-Type': 'application/xml'
      },
      body: `<?xml version="1.0" encoding="utf-8"?>
<D:propfind xmlns:D="DAV:">
  <D:allprop/>
</D:propfind>`
    });

    await this.handleResponse(response);
    const xmlText = await response.text();
    return this.parseDirectoryListing(xmlText);
  }

  /**
   * 解析目录列表 XML
   */
  private parseDirectoryListing(xmlText: string): WebDAVFileInfo[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const responses = doc.querySelectorAll('D\\:response, response');
    
    const files: WebDAVFileInfo[] = [];
    
    responses.forEach(response => {
      const href = response.querySelector('D\\:href, href')?.textContent;
      if (!href) return;

      const path = decodeURIComponent(href).replace(/^\/+/, '');
      if (!path) return; // 跳过根路径

      const propstat = response.querySelector('D\\:propstat, propstat');
      const props = propstat?.querySelector('D\\:prop, prop');
      
      const isDirectory = props?.querySelector('D\\:resourcetype, resourcetype')?.querySelector('D\\:collection, collection') !== null;
      const size = props?.querySelector('D\\:getcontentlength, getcontentlength')?.textContent;
      const lastModified = props?.querySelector('D\\:getlastmodified, getlastmodified')?.textContent;
      const etag = props?.querySelector('D\\:getetag, getetag')?.textContent;

      files.push({
        path,
        size: size ? parseInt(size) : undefined,
        lastModified,
        isDirectory,
        etag: etag?.replace(/"/g, '')
      });
    });

    return files;
  }

  /**
   * 上传文件
   */
  async uploadFile(path: string, content: string, contentType: string = 'text/plain'): Promise<ProxyResponse> {
    const response = await this.makeRequest(path, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType
      },
      body: content
    });

    await this.handleResponse(response);
    return {
      status: response.status,
      headers: response.headers,
      body: await response.text(),
      ok: response.ok
    };
  }

  /**
   * 下载文件
   */
  async downloadFile(path: string): Promise<string> {
    const response = await this.makeRequest(path, {
      method: 'GET'
    });

    await this.handleResponse(response);
    return await response.text();
  }

  /**
   * 删除文件
   */
  async deleteFile(path: string): Promise<ProxyResponse> {
    const response = await this.makeRequest(path, {
      method: 'DELETE'
    });

    await this.handleResponse(response);
    return {
      status: response.status,
      headers: response.headers,
      body: await response.text(),
      ok: response.ok
    };
  }

  /**
   * 创建目录
   */
  async createDirectory(path: string): Promise<ProxyResponse> {
    const response = await this.makeRequest(path, {
      method: 'MKCOL'
    });

    await this.handleResponse(response);
    return {
      status: response.status,
      headers: response.headers,
      body: await response.text(),
      ok: response.ok
    };
  }

  /**
   * 移动文件
   */
  async moveFile(sourcePath: string, destinationPath: string): Promise<ProxyResponse> {
    const response = await this.makeRequest(sourcePath, {
      method: 'MOVE',
      headers: {
        'Destination': destinationPath
      }
    });

    await this.handleResponse(response);
    return {
      status: response.status,
      headers: response.headers,
      body: await response.text(),
      ok: response.ok
    };
  }

  /**
   * 复制文件
   */
  async copyFile(sourcePath: string, destinationPath: string): Promise<ProxyResponse> {
    const response = await this.makeRequest(sourcePath, {
      method: 'COPY',
      headers: {
        'Destination': destinationPath
      }
    });

    await this.handleResponse(response);
    return {
      status: response.status,
      headers: response.headers,
      body: await response.text(),
      ok: response.ok
    };
  }

  /**
   * 检查文件是否存在
   */
  async exists(path: string): Promise<boolean> {
    try {
      await this.getFileInfo(path);
      return true;
    } catch (error) {
      if (error instanceof WebDAVError && error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * 获取文件信息
   */
  async getFileInfo(path: string): Promise<WebDAVFileInfo> {
    const response = await this.makeRequest(path, {
      method: 'PROPFIND',
      headers: {
        'Depth': '0',
        'Content-Type': 'application/xml'
      },
      body: `<?xml version="1.0" encoding="utf-8"?>
<D:propfind xmlns:D="DAV:">
  <D:allprop/>
</D:propfind>`
    });

    await this.handleResponse(response);
    const xmlText = await response.text();
    const files = this.parseDirectoryListing(xmlText);
    
    if (files.length === 0) {
      throw new WebDAVError('文件不存在', WebDAVErrorType.NOT_FOUND_ERROR, 404);
    }

    return files[0];
  }
}

/**
 * 环境配置
 */
export const getEnvironmentConfig = (): WebDAVClientConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    proxyUrl: isProduction 
      ? 'https://aisp-cors-proxy.vercel.app/api/cors-proxy'
      : 'http://localhost:3000/api/cors-proxy',
    username: process.env.VITE_WEBDAV_USERNAME || '',
    password: process.env.VITE_WEBDAV_PASSWORD || '',
    timeout: 30000
  };
};

/**
 * 创建 WebDAV 客户端实例
 */
export const createWebDAVClient = (config?: Partial<WebDAVClientConfig>): AISPWebDAVClient => {
  const defaultConfig = getEnvironmentConfig();
  const finalConfig = { ...defaultConfig, ...config };
  
  return new AISPWebDAVClient(finalConfig);
};

/**
 * 使用示例
 */
export const exampleUsage = async () => {
  // 创建客户端
  const client = createWebDAVClient({
    username: 'your-email@example.com',
    password: 'your-app-password'
  });

  try {
    // 列出根目录
    console.log('列出根目录:');
    const files = await client.listDirectory();
    files.forEach(file => {
      console.log(`- ${file.path} (${file.isDirectory ? '目录' : '文件'})`);
    });

    // 创建目录
    console.log('\n创建目录:');
    await client.createDirectory('notes');
    console.log('目录创建成功');

    // 上传文件
    console.log('\n上传文件:');
    await client.uploadFile('notes/test.txt', 'Hello, World!');
    console.log('文件上传成功');

    // 下载文件
    console.log('\n下载文件:');
    const content = await client.downloadFile('notes/test.txt');
    console.log('文件内容:', content);

    // 检查文件是否存在
    console.log('\n检查文件是否存在:');
    const exists = await client.exists('notes/test.txt');
    console.log('文件存在:', exists);

    // 获取文件信息
    console.log('\n获取文件信息:');
    const fileInfo = await client.getFileInfo('notes/test.txt');
    console.log('文件信息:', fileInfo);

  } catch (error) {
    if (error instanceof WebDAVError) {
      console.error(`WebDAV 错误 [${error.type}]:`, error.message);
    } else {
      console.error('未知错误:', error);
    }
  }
};

// 导出默认实例创建函数
export default createWebDAVClient;
