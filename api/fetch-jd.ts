import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: '请提供有效的 URL' });
  }

  try {
    // Use Jina Reader API to handle JS-rendered pages (BOSS直聘, 拉勾, etc.)
    const jinaUrl = `https://r.jina.ai/${url}`;
    const response = await fetch(jinaUrl, {
      headers: {
        'Accept': 'text/plain',
        'X-Return-Format': 'text',
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      // Fallback: try direct HTML fetch for simpler sites
      return await directFetch(url, res);
    }

    let text = await response.text();

    // Clean up and truncate
    text = text
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim()
      .slice(0, 8000);

    if (text.length < 50) {
      // Too short, probably blocked — fallback
      return await directFetch(url, res);
    }

    return res.status(200).json({ text });
  } catch (err: unknown) {
    // Fallback to direct fetch on Jina error
    try {
      return await directFetch(url, res);
    } catch (fallbackErr: unknown) {
      const message = fallbackErr instanceof Error ? fallbackErr.message : '未知错误';
      return res.status(502).json({ error: `获取网页内容失败: ${message}` });
    }
  }
}

async function directFetch(url: string, res: VercelResponse) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    return res.status(502).json({ error: `无法访问该链接 (HTTP ${response.status})` });
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
    return res.status(502).json({
      error: '该网站有反爬保护，无法自动获取内容。请手动复制 JD 文本后粘贴到文本框中分析。',
    });
  }

  return res.status(200).json({ text });
}
