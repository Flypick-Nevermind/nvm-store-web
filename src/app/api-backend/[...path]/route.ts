import { type NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE = process.env.BACKEND_API_URL || 'http://localhost:8081/api';

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const targetUrl = `${BACKEND_BASE}/${path.join('/')}${req.nextUrl.search}`;

  // Clone headers and remove origin / referer to avoid backend CORS rejection
  const headers = new Headers();
  req.headers.forEach((val, key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey !== 'origin' && lowerKey !== 'referer' && lowerKey !== 'host') {
      headers.set(key, val);
    }
  });

  const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.arrayBuffer() : undefined;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const hasNoBody = [204, 205, 304].includes(response.status);
    const data = hasNoBody ? null : await response.arrayBuffer();

    const responseHeaders = new Headers();
    const contentType = response.headers.get('content-type');
    if (contentType && !hasNoBody) {
      responseHeaders.set('content-type', contentType);
    }

    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Backend unreachable';
    return NextResponse.json(
      {
        success: false,
        status: 502,
        message: `Gagal menghubungi backend di ${BACKEND_BASE}: ${message}`,
      },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
