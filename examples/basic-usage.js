/**
 * AISP WebDAV CORS 代理服务 - 基础使用示例
 * 适用于 JavaScript/TypeScript 项目
 */

// 配置信息
const CONFIG = {
  // 代理服务 URL
  proxyUrl: 'https://aisp-cors-proxy.vercel.app/api/cors-proxy',
  
  // 坚果云认证信息（请替换为您的实际信息）
  username: 'your-email@example.com',
  password: 'your-app-password'
};

// 生成认证头
const credentials = btoa(`${CONFIG.username}:${CONFIG.password}`);

/**
 * 发送 WebDAV 请求到代理服务
 */
async function webdavRequest(path, method, headers = {}, body = null) {
  try {
    const response = await fetch(CONFIG.proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: path,
        options: {
          method: method,
          headers: {
            'Authorization': `Basic ${credentials}`,
            ...headers
          },
          body: body
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${errorData.error}`);
    }

    return response;
  } catch (error) {
    console.error('WebDAV 请求失败:', error);
    throw error;
  }
}

/**
 * 列出目录内容
 */
async function listDirectory(path = '') {
  console.log(`📁 列出目录: ${path || '根目录'}`);
  
  const response = await webdavRequest(path, 'PROPFIND', {
    'Depth': '1',
    'Content-Type': 'application/xml'
  }, `<?xml version="1.0" encoding="utf-8"?>
<D:propfind xmlns:D="DAV:">
  <D:allprop/>
</D:propfind>`);

  const xmlText = await response.text();
  console.log('📋 目录内容:', xmlText);
  return xmlText;
}

/**
 * 上传文件
 */
async function uploadFile(filePath, content, contentType = 'text/plain') {
  console.log(`📤 上传文件: ${filePath}`);
  
  const response = await webdavRequest(filePath, 'PUT', {
    'Content-Type': contentType
  }, content);

  console.log('✅ 文件上传成功');
  return response;
}

/**
 * 下载文件
 */
async function downloadFile(filePath) {
  console.log(`📥 下载文件: ${filePath}`);
  
  const response = await webdavRequest(filePath, 'GET');
  const content = await response.text();
  
  console.log('📄 文件内容:', content);
  return content;
}

/**
 * 删除文件
 */
async function deleteFile(filePath) {
  console.log(`🗑️ 删除文件: ${filePath}`);
  
  const response = await webdavRequest(filePath, 'DELETE');
  console.log('✅ 文件删除成功');
  return response;
}

/**
 * 创建目录
 */
async function createDirectory(dirPath) {
  console.log(`📁 创建目录: ${dirPath}`);
  
  const response = await webdavRequest(dirPath, 'MKCOL');
  console.log('✅ 目录创建成功');
  return response;
}

/**
 * 移动文件
 */
async function moveFile(sourcePath, destinationPath) {
  console.log(`🔄 移动文件: ${sourcePath} -> ${destinationPath}`);
  
  const response = await webdavRequest(sourcePath, 'MOVE', {
    'Destination': destinationPath
  });
  
  console.log('✅ 文件移动成功');
  return response;
}

/**
 * 复制文件
 */
async function copyFile(sourcePath, destinationPath) {
  console.log(`📋 复制文件: ${sourcePath} -> ${destinationPath}`);
  
  const response = await webdavRequest(sourcePath, 'COPY', {
    'Destination': destinationPath
  });
  
  console.log('✅ 文件复制成功');
  return response;
}

/**
 * 使用示例
 */
async function example() {
  try {
    console.log('🚀 开始 WebDAV 操作示例...\n');

    // 1. 列出根目录
    await listDirectory();
    console.log('');

    // 2. 创建目录
    await createDirectory('notes');
    console.log('');

    // 3. 上传文件
    await uploadFile('notes/test.txt', 'Hello, World! 这是测试文件内容。');
    console.log('');

    // 4. 下载文件
    await downloadFile('notes/test.txt');
    console.log('');

    // 5. 列出 notes 目录
    await listDirectory('notes');
    console.log('');

    // 6. 复制文件
    await copyFile('notes/test.txt', 'notes/test-copy.txt');
    console.log('');

    // 7. 移动文件
    await moveFile('notes/test-copy.txt', 'notes/moved-test.txt');
    console.log('');

    // 8. 删除文件
    await deleteFile('notes/moved-test.txt');
    console.log('');

    console.log('🎉 所有操作完成！');

  } catch (error) {
    console.error('❌ 操作失败:', error.message);
  }
}

/**
 * 错误处理示例
 */
async function errorHandlingExample() {
  try {
    // 尝试访问不存在的文件
    await downloadFile('non-existent-file.txt');
  } catch (error) {
    if (error.message.includes('404')) {
      console.log('📝 文件不存在，这是预期的错误');
    } else {
      console.error('❌ 意外错误:', error.message);
    }
  }
}

/**
 * 批量操作示例
 */
async function batchOperationsExample() {
  console.log('📦 批量操作示例...');
  
  const files = [
    { path: 'notes/file1.txt', content: '文件1内容' },
    { path: 'notes/file2.txt', content: '文件2内容' },
    { path: 'notes/file3.txt', content: '文件3内容' }
  ];

  try {
    // 并行上传多个文件
    const uploadPromises = files.map(file => 
      uploadFile(file.path, file.content)
    );
    
    await Promise.all(uploadPromises);
    console.log('✅ 所有文件上传完成');
    
    // 列出目录查看结果
    await listDirectory('notes');
    
  } catch (error) {
    console.error('❌ 批量操作失败:', error.message);
  }
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    webdavRequest,
    listDirectory,
    uploadFile,
    downloadFile,
    deleteFile,
    createDirectory,
    moveFile,
    copyFile,
    example,
    errorHandlingExample,
    batchOperationsExample
  };
}

// 如果直接运行此文件，执行示例
if (typeof window === 'undefined' && require.main === module) {
  example();
}

