/**
 * React Hook for WebDAV operations
 * 用于 React 应用的 WebDAV 操作 Hook
 */

import { useState, useCallback, useRef } from 'react';
import { AISPWebDAVClient } from './aisp-integration';
import type { WebDAVClientConfig, WebDAVFileInfo } from '../types/aisp-webdav';
import { WebDAVError } from '../types/aisp-webdav';

/**
 * WebDAV 操作状态
 */
export interface WebDAVState {
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 数据 */
  data: any;
  /** 最后更新时间 */
  lastUpdated: Date | null;
}

/**
 * WebDAV 操作结果
 */
export interface WebDAVResult<T = any> extends WebDAVState {
  /** 执行操作 */
  execute: (...args: any[]) => Promise<T>;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 使用 WebDAV 客户端的 Hook
 */
export function useWebDAV(config: WebDAVClientConfig) {
  const clientRef = useRef<AISPWebDAVClient | null>(null);
  
  if (!clientRef.current) {
    clientRef.current = new AISPWebDAVClient(config);
  }

  return clientRef.current;
}

/**
 * 使用 WebDAV 操作的通用 Hook
 */
export function useWebDAVOperation<T = any>(
  operation: (client: AISPWebDAVClient, ...args: any[]) => Promise<T>
) {
  const [state, setState] = useState<WebDAVState>({
    loading: false,
    error: null,
    data: null,
    lastUpdated: null
  });

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const client = new AISPWebDAVClient({
        proxyUrl: 'https://aisp-cors-proxy.vercel.app/api/cors-proxy',
        username: process.env.VITE_WEBDAV_USERNAME || '',
        password: process.env.VITE_WEBDAV_PASSWORD || ''
      });

      const result = await operation(client, ...args);
      
      setState({
        loading: false,
        error: null,
        data: result,
        lastUpdated: new Date()
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof WebDAVError 
        ? error.message 
        : '操作失败';
      
      setState({
        loading: false,
        error: errorMessage,
        data: null,
        lastUpdated: new Date()
      });

      throw error;
    }
  }, [operation]);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      data: null,
      lastUpdated: null
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}

/**
 * 列出目录的 Hook
 */
export function useListDirectory() {
  return useWebDAVOperation(async (client, path: string = '') => {
    return await client.listDirectory(path);
  });
}

/**
 * 上传文件的 Hook
 */
export function useUploadFile() {
  return useWebDAVOperation(async (client, path: string, content: string, contentType?: string) => {
    return await client.uploadFile(path, content, contentType);
  });
}

/**
 * 下载文件的 Hook
 */
export function useDownloadFile() {
  return useWebDAVOperation(async (client, path: string) => {
    return await client.downloadFile(path);
  });
}

/**
 * 删除文件的 Hook
 */
export function useDeleteFile() {
  return useWebDAVOperation(async (client, path: string) => {
    return await client.deleteFile(path);
  });
}

/**
 * 创建目录的 Hook
 */
export function useCreateDirectory() {
  return useWebDAVOperation(async (client, path: string) => {
    return await client.createDirectory(path);
  });
}

/**
 * 检查文件是否存在的 Hook
 */
export function useFileExists() {
  return useWebDAVOperation(async (client, path: string) => {
    return await client.exists(path);
  });
}

/**
 * 获取文件信息的 Hook
 */
export function useFileInfo() {
  return useWebDAVOperation(async (client, path: string) => {
    return await client.getFileInfo(path);
  });
}

/**
 * 文件浏览器组件示例
 */
export function FileBrowser() {
  const [currentPath, setCurrentPath] = useState('');
  const listDirectory = useListDirectory();

  const handleListDirectory = useCallback(() => {
    listDirectory.execute(currentPath);
  }, [listDirectory, currentPath]);

  const handleFileClick = useCallback((file: WebDAVFileInfo) => {
    if (file.isDirectory) {
      setCurrentPath(file.path);
    } else {
      // 处理文件点击
      console.log('点击文件:', file.path);
    }
  }, []);

  return (
    <div className="file-browser">
      <div className="toolbar">
        <input
          type="text"
          value={currentPath}
          onChange={(e) => setCurrentPath(e.target.value)}
          placeholder="输入路径"
        />
        <button onClick={handleListDirectory} disabled={listDirectory.loading}>
          {listDirectory.loading ? '加载中...' : '列出目录'}
        </button>
      </div>

      {listDirectory.error && (
        <div className="error">
          错误: {listDirectory.error}
        </div>
      )}

      {listDirectory.data && (
        <div className="file-list">
          {listDirectory.data.map((file: WebDAVFileInfo) => (
            <div
              key={file.path}
              className={`file-item ${file.isDirectory ? 'directory' : 'file'}`}
              onClick={() => handleFileClick(file)}
            >
              <span className="file-name">{file.path}</span>
              {file.size && <span className="file-size">{file.size} bytes</span>}
              {file.lastModified && (
                <span className="file-date">{new Date(file.lastModified).toLocaleString()}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 文件上传组件示例
 */
export function FileUpload() {
  const [filePath, setFilePath] = useState('');
  const [fileContent, setFileContent] = useState('');
  const uploadFile = useUploadFile();

  const handleUpload = useCallback(() => {
    if (!filePath || !fileContent) {
      alert('请输入文件路径和内容');
      return;
    }

    uploadFile.execute(filePath, fileContent);
  }, [uploadFile, filePath, fileContent]);

  return (
    <div className="file-upload">
      <h3>上传文件</h3>
      
      <div className="form-group">
        <label>文件路径:</label>
        <input
          type="text"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          placeholder="例如: notes/test.txt"
        />
      </div>

      <div className="form-group">
        <label>文件内容:</label>
        <textarea
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
          placeholder="输入文件内容"
          rows={10}
        />
      </div>

      <button onClick={handleUpload} disabled={uploadFile.loading}>
        {uploadFile.loading ? '上传中...' : '上传文件'}
      </button>

      {uploadFile.error && (
        <div className="error">
          错误: {uploadFile.error}
        </div>
      )}

      {uploadFile.data && (
        <div className="success">
          文件上传成功！
        </div>
      )}
    </div>
  );
}

/**
 * 文件下载组件示例
 */
export function FileDownload() {
  const [filePath, setFilePath] = useState('');
  const downloadFile = useDownloadFile();

  const handleDownload = useCallback(() => {
    if (!filePath) {
      alert('请输入文件路径');
      return;
    }

    downloadFile.execute(filePath);
  }, [downloadFile, filePath]);

  return (
    <div className="file-download">
      <h3>下载文件</h3>
      
      <div className="form-group">
        <label>文件路径:</label>
        <input
          type="text"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          placeholder="例如: notes/test.txt"
        />
      </div>

      <button onClick={handleDownload} disabled={downloadFile.loading}>
        {downloadFile.loading ? '下载中...' : '下载文件'}
      </button>

      {downloadFile.error && (
        <div className="error">
          错误: {downloadFile.error}
        </div>
      )}

      {downloadFile.data && (
        <div className="file-content">
          <h4>文件内容:</h4>
          <pre>{downloadFile.data}</pre>
        </div>
      )}
    </div>
  );
}

/**
 * 完整的文件管理器组件示例
 */
export function FileManager() {
  return (
    <div className="file-manager">
      <h2>WebDAV 文件管理器</h2>
      
      <div className="sections">
        <div className="section">
          <FileBrowser />
        </div>
        
        <div className="section">
          <FileUpload />
        </div>
        
        <div className="section">
          <FileDownload />
        </div>
      </div>
    </div>
  );
}

// 导出所有 Hook 和组件
export {
  useWebDAV,
  useWebDAVOperation,
  useListDirectory,
  useUploadFile,
  useDownloadFile,
  useDeleteFile,
  useCreateDirectory,
  useFileExists,
  useFileInfo,
  FileBrowser,
  FileUpload,
  FileDownload,
  FileManager
};
