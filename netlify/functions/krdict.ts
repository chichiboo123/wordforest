const KRDICT_API_URL = "https://stdict.korean.go.kr/api/search.do";

type NetlifyEvent = {
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
    },
    body: JSON.stringify(body),
  };
}

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
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

  const data = await response.json();
  const item = data?.channel?.item?.[0];
  if (!item) {
    return json(404, { error: "No result found" });
  }

  return json(200, {
    item: {
      word: item.word || query,
      pos: item.pos || "알 수 없음",
      definition: item.sense?.[0]?.definition || item.definition || "뜻을 찾을 수 없어요.",
      example: item.sense?.[0]?.example?.[0]?.example || "",
    },
  });
}
