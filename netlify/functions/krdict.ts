const KRDICT_API_URL = "https://stdict.korean.go.kr/api/search.do";

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "Content-Type",
};

type NetlifyEvent = {
  httpMethod?: string;
  queryStringParameters?: {
    q?: string;
  };
};

type NetlifyResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

function json(statusCode: number, body: Record<string, unknown>): NetlifyResponse {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...CORS_HEADERS,
    },
    body: JSON.stringify(body),
  };
}

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  const query = event.queryStringParameters?.q?.trim();
  if (!query) {
    return json(400, { error: "Missing required query parameter: q" });
  }

  const apiKey = process.env.KRDICT_API_KEY?.trim();
  if (!apiKey) {
    return json(500, { error: "Server is not configured with KRDICT_API_KEY" });
  }

  const params = new URLSearchParams({
    q: query,
    key: apiKey,
    type_search: "search",
    req_type: "json",
    num: "3",
  });

  const response = await fetch(`${KRDICT_API_URL}?${params.toString()}`);
  if (!response.ok) {
    return json(response.status, { error: "KRDICT request failed" });
  }

  const text = await response.text();
  if (!text || text.trim() === "") {
    return json(404, { error: "No result found" });
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    // KRDICT sometimes returns XML or invalid JSON — expose raw for debugging
    return json(404, { error: "Invalid JSON from KRDICT", raw: text.slice(0, 500) });
  }

  const d = data as Record<string, unknown>;
  const channel = d?.channel as Record<string, unknown> | undefined;
  const item = channel?.item as unknown[] | undefined;
  const firstItem = item?.[0] as Record<string, unknown> | undefined;
  if (!firstItem) {
    // 디버그: KRDICT 실제 응답 구조 확인용 (배포 안정화 후 제거)
    return json(404, {
      error: "No result found",
      debug: {
        total: channel?.total,
        error: channel?.error,
        keys: channel ? Object.keys(channel) : [],
      },
    });
  }

  const sense = (firstItem.sense as unknown[])?.[0] as Record<string, unknown> | undefined;
  const exampleEntry = (sense?.example as unknown[])?.[0] as Record<string, unknown> | undefined;

  return json(200, {
    item: {
      word: (firstItem.word as string) || query,
      pos: (firstItem.pos as string) || "알 수 없음",
      definition: (sense?.definition as string) || (firstItem.definition as string) || "뜻을 찾을 수 없어요.",
      example: (exampleEntry?.example as string) || "",
    },
  });
}
