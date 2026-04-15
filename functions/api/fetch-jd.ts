export async function onRequestPost({ request }: { request: Request }) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return Response.json({ error: '无效的 JSON 请求体' }, { status: 400 });
  }

  const { url } = body as any;
  if (!url || typeof url !== 'string') {
    return Response.json({ error: '请提供有效的 URL' }, { status: 400 });
  }

  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const response = await fetch(jinaUrl, {
      headers: {
        'Accept': 'text/plain',
        'X-Return-Format': 'text',
      },
    });

    if (!response.ok) {
      return await directFetch(url);
    }

    let text = await response.text();

    text = text
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim()
      .slice(0, 8000);

    if (text.length < 50) {
      return await directFetch(url);
    }

    return Response.json({ text }, { status: 200 });
  } catch (err: unknown) {
    try {
      return await directFetch(url);
    } catch (fallbackErr: unknown) {
      const message = fallbackErr instanceof Error ? fallbackErr.message : '未知错误';
      return Response.json({ error: `获取网页内容失败: ${message}` }, { status: 502 });
    }
  }
}

async function directFetch(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    },
  });

  if (!response.ok) {
    return Response.json({ error: `无法访问该链接 (HTTP ${response.status})` }, { status: 502 });
  }

  const html = await response.text();

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<\/(p|div|h[1-6]|li|tr|br|hr)[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim()
    .slice(0, 8000);

  if (text.length < 50 || text.includes('请稍候') || text.includes('正在加载')) {
    return Response.json({
      error: '该网站有反爬保护，无法自动获取内容。请手动复制 JD 文本后粘贴到文本框中分析。',
    }, { status: 502 });
  }

  return Response.json({ text }, { status: 200 });
}
