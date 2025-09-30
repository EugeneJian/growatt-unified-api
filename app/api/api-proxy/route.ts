import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS() {
  console.log('🔄 处理CORS预检请求 (OPTIONS)');
  
  // 设置CORS头 - 与开发环境完全一致
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, token, Accept, X-Requested-With');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}

export async function GET(request: NextRequest) {
  return handleApiProxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleApiProxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleApiProxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleApiProxyRequest(request, 'DELETE');
}

async function handleApiProxyRequest(request: NextRequest, method: string) {
  console.log(`🔄 Vercel代理请求: ${method} ${request.url}`);
  
  // 设置CORS头 - 与开发环境完全一致
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, token, Accept, X-Requested-With',
    'Access-Control-Max-Age': '86400'
  };

  try {
    // 获取目标URL和参数
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const token = searchParams.get('token');
    
    if (!url) {
      console.log('❌ 缺少url参数');
      const errorResponse = NextResponse.json({ 
        error: 'Missing url parameter',
        message: '请提供目标API URL'
      }, { status: 400 });
      
      // 添加CORS头部
      Object.entries(corsHeaders).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });
      
      return errorResponse;
    }

    // 解码目标URL
    const targetUrl = decodeURIComponent(url);
    console.log(`🎯 目标URL: ${targetUrl}`);
    
    // 构建请求头 - 与开发环境一致
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'User-Agent': 'Vercel-Proxy/1.0'
    };

    // 添加token到请求头 - 与开发环境一致
    if (token) {
      headers['token'] = token;
      console.log(`🔑 Token已添加: ${token.substring(0, 10)}...`);
    }

    console.log(`📤 请求头:`, headers);

    // 获取请求体（对于POST/PUT请求）
    let requestBody: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        requestBody = await request.text();
      } catch (error) {
        // 忽略请求体解析错误，继续处理
      }
    }

    // 发起代理请求
    const response = await fetch(targetUrl, {
      method: method,
      headers: headers,
      body: requestBody,
      signal: AbortSignal.timeout(30000) // 30秒超时
    });

    // 获取响应数据
    const data = await response.text();
    
    console.log(`📊 代理响应: ${response.status} ${response.statusText}`);
    console.log(`📋 响应数据长度: ${data.length} 字符`);
    
    // 设置响应头 - 与开发环境一致
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // 避免设置Vercel自动处理的头部
      if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
        responseHeaders.set(key, value);
      }
    });
    
    // 添加CORS头部
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });
    
    // 返回响应
    const proxyResponse = new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });

    return proxyResponse;

  } catch (error) {
    console.error('❌ 代理错误:', error instanceof Error ? error.message : 'Unknown error');
    
    const errorResponse = NextResponse.json({
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
    
    // 添加CORS头部
    Object.entries(corsHeaders).forEach(([key, value]) => {
      errorResponse.headers.set(key, value);
    });
    
    return errorResponse;
  }
}
