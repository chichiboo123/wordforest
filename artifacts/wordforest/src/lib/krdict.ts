/**
 * 표준국어대사전 API 클라이언트
 *
 * 국립국어원 표준국어대사전 API를 통해 낱말의 뜻과 품사, 예문을 가져옵니다.
 * 환경에 따라 Netlify Function 프록시를 경유하며, API를 사용할 수 없는 경우
 * 내장 샘플 데이터로 대체됩니다.
 *
 * API 출처: https://stdict.korean.go.kr
 */

import { MOCK_DICTIONARY } from "@/data/dictionary";

export type WordSource = "krdict" | "mock" | "fallback";

export interface WordResult {
  word: string;
  pos: string;
  definition: string;
  example: string;
  source: WordSource;
}

function getProxyUrl(): string {
  const configured = import.meta.env.VITE_KRDICT_PROXY_URL?.trim();
  if (configured) return configured;
  if (
    typeof window !== "undefined" &&
    (window.location.hostname.endsWith(".netlify.app") ||
      window.location.hostname === "localhost")
  ) {
    return "/.netlify/functions/krdict";
  }
  return "";
}

function parseProxyResponse(data: unknown, fallbackWord: string): WordResult | null {
  const d = data as Record<string, unknown>;

  // Netlify function normalised response
  const proxyItem = d?.item as Record<string, unknown> | undefined;
  if (proxyItem && typeof proxyItem === "object") {
    return {
      word: (proxyItem.word as string) || fallbackWord,
      pos: (proxyItem.pos as string) || "알 수 없음",
      definition: (proxyItem.definition as string) || "뜻을 찾을 수 없어요.",
      example: (proxyItem.example as string) || "",
      source: "krdict",
    };
  }

  // Raw KRDICT API response (direct call)
  const channel = d?.channel as Record<string, unknown> | undefined;
  const item = (channel?.item as unknown[])?.[0] as Record<string, unknown> | undefined;
  if (item) {
    const sense = (item.sense as unknown[])?.[0] as Record<string, unknown> | undefined;
    return {
      word: (item.word as string) || fallbackWord,
      pos: (item.pos as string) || "알 수 없음",
      definition:
        (sense?.definition as string) ||
        (item.definition as string) ||
        "뜻을 찾을 수 없어요.",
      example: ((sense?.example as unknown[])?.[0] as Record<string, unknown>)?.example as string || "",
      source: "krdict",
    };
  }

  return null;
}

/**
 * 표준국어대사전에서 낱말을 검색합니다.
 * API를 사용할 수 없으면 내장 샘플 데이터를 반환합니다.
 */
export async function lookupWord(word: string): Promise<WordResult> {
  const proxyUrl = getProxyUrl();

  if (proxyUrl) {
    try {
      const res = await fetch(`${proxyUrl}?q=${encodeURIComponent(word)}`);
      if (res.ok) {
        const data = await res.json();
        const parsed = parseProxyResponse(data, word);
        if (parsed) return parsed;
      }
    } catch {
      // fall through to mock data
    }
  }

  const mock = MOCK_DICTIONARY[word];
  if (mock) {
    return { word, ...mock, source: "mock" };
  }

  return {
    word,
    pos: "낱말",
    definition: `"${word}"의 뜻을 직접 사전에서 찾아보거나, 이 낱말이 가진 느낌을 상상해 보세요.`,
    example: `${word}이(가) 마음속에 떠오른다.`,
    source: "fallback",
  };
}
