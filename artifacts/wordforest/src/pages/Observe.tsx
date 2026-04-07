import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useTranslation } from "react-i18next";
import { MOCK_DICTIONARY } from "@/data/dictionary";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useToast } from "@/hooks/use-toast";

const MOOD_KEYWORDS = [
  "맑다", "잔잔하다", "따뜻하다", "고요하다", "설레다",
  "쓸쓸하다", "두근거리다", "포근하다", "서늘하다", "부드럽다",
  "신비롭다", "날카롭다", "조용하다", "아련하다",
];

const USAGE_SUGGESTIONS = [
  "시의 첫 구절에서",
  "노랫말의 후렴구에서",
  "인물의 독백에서",
  "장면 묘사에서",
  "감정 표현에서",
];

const SCENE_TEMPLATES = [
  (word: string) => `이 낱말은 봄비가 내리는 조용한 오후의 장면과 잘 어울려요.`,
  (word: string) => `"${word}"는 설레는 마음과 기대감이 함께 느껴지는 장면에서 빛날 수 있어요.`,
  (word: string) => `이 낱말을 시 속에 넣으면 분위기가 더 선명해질 수 있어요.`,
];

function getMoodForWord(word: string): string[] {
  const charCode = word.charCodeAt(0) + word.length;
  const selected: string[] = [];
  for (let i = 0; i < 3; i++) {
    selected.push(MOOD_KEYWORDS[(charCode + i * 3) % MOOD_KEYWORDS.length]);
  }
  return [...new Set(selected)];
}

function getUsageForWord(word: string): string[] {
  const charCode = word.charCodeAt(0);
  return [
    USAGE_SUGGESTIONS[charCode % USAGE_SUGGESTIONS.length],
    USAGE_SUGGESTIONS[(charCode + 2) % USAGE_SUGGESTIONS.length],
  ];
}

function getSceneForWord(word: string): string[] {
  return SCENE_TEMPLATES.map((fn) => fn(word));
}

interface WordResult {
  word: string;
  pos: string;
  definition: string;
  example: string;
}

function toWordResult(data: any, fallbackWord: string): WordResult | null {
  const proxyItem = data?.item;
  if (proxyItem && typeof proxyItem === "object") {
    return {
      word: proxyItem.word || fallbackWord,
      pos: proxyItem.pos || "알 수 없음",
      definition: proxyItem.definition || "뜻을 찾을 수 없어요.",
      example: proxyItem.example || "",
    };
  }

  const stdictItem = data?.channel?.item?.[0];
  if (stdictItem) {
    return {
      word: stdictItem.word || fallbackWord,
      pos: stdictItem.pos || "알 수 없음",
      definition: stdictItem.sense?.[0]?.definition || stdictItem.definition || "뜻을 찾을 수 없어요.",
      example: stdictItem.sense?.[0]?.example?.[0]?.example || "",
    };
  }

  return null;
}

async function lookupWord(word: string): Promise<WordResult | null> {
  const configuredProxyUrl = import.meta.env.VITE_KRDICT_PROXY_URL?.trim();
  const isNetlifyHost =
    typeof window !== "undefined" &&
    (window.location.hostname.endsWith(".netlify.app") || window.location.hostname === "localhost");
  const proxyUrl = configuredProxyUrl || (isNetlifyHost ? "/.netlify/functions/krdict" : "");
  if (proxyUrl) {
    try {
      const url = `${proxyUrl}?q=${encodeURIComponent(word)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const parsed = toWordResult(data, word);
        if (parsed) {
          return parsed;
        }
      }
    } catch {
      // Fall through to mock
    }
  }

  const mock = MOCK_DICTIONARY[word];
  if (mock) {
    return { word, ...mock };
  }

  return {
    word,
    pos: "낱말",
    definition: `"${word}"의 뜻을 직접 사전에서 찾아보거나, 이 낱말이 가진 느낌을 상상해 보세요.`,
    example: `${word}이(가) 마음속에 떠오른다.`,
  };
}

export default function Observe() {
  const { t } = useTranslation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialWord = params.get("word") || "";

  const [input, setInput] = useState(initialWord);
  const [result, setResult] = useState<WordResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { saveWord, savedWords } = useSavedItems();
  const { toast } = useToast();

  const moods = result ? getMoodForWord(result.word) : [];
  const usages = result ? getUsageForWord(result.word) : [];
  const scenes = result ? getSceneForWord(result.word) : [];

  const isWordSaved = result ? savedWords.some((w) => w.word === result.word) : false;

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const res = await lookupWord(input.trim());
    setResult(res);
    setLoading(false);
  };

  const handleSave = () => {
    if (!result) return;
    saveWord(result.word, result.definition);
    toast({ title: `"${result.word}" 낱말을 저장했어요!`, description: "저장함에서 확인할 수 있어요." });
  };

  useEffect(() => {
    if (initialWord) {
      lookupWord(initialWord).then((res) => {
        setResult(res);
      });
    }
  }, [initialWord]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-icons text-emerald-600 text-2xl leading-none">visibility</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("observe.title")}</h1>
        </div>
        <p className="text-muted-foreground text-sm">낱말 하나를 천천히 들여다봐요. 뜻과 느낌, 어울리는 장면을 찾아봐요.</p>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <input
            data-testid="observe-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("observe.placeholder")}
            className="w-full h-12 pl-4 pr-12 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 material-icons text-muted-foreground/50 leading-none">search</span>
        </div>
        <button
          data-testid="observe-search-btn"
          onClick={handleSearch}
          disabled={loading}
          className="h-12 px-5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
        >
          {loading ? (
            <span className="material-icons animate-spin text-base leading-none">refresh</span>
          ) : (
            <span className="material-icons text-base leading-none">search</span>
          )}
          {t("common.search")}
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-5">
          {/* Word Header */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold text-primary">{result.word}</h2>
                  <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full font-medium">
                    {result.pos}
                  </span>
                </div>
                <p className="text-foreground text-base leading-relaxed font-medium">{result.definition}</p>
                {result.example && (
                  <p className="text-muted-foreground text-sm mt-2 italic">
                    <span className="not-italic text-muted-foreground/60 text-xs mr-1">예문</span>
                    "{result.example}"
                  </p>
                )}
              </div>
              <button
                data-testid="observe-save-btn"
                onClick={handleSave}
                disabled={isWordSaved}
                className={`shrink-0 p-2.5 rounded-xl transition-colors ${
                  isWordSaved
                    ? "bg-primary/10 text-primary"
                    : "border border-border hover:bg-secondary text-muted-foreground hover:text-primary"
                }`}
                title={isWordSaved ? "저장됨" : "저장하기"}
              >
                <span className="material-icons leading-none text-xl">
                  {isWordSaved ? "bookmark" : "bookmark_border"}
                </span>
              </button>
            </div>
          </div>

          {/* Mood Keywords */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-amber-500 text-xl leading-none">mood</span>
              <h3 className="font-semibold text-foreground">{t("observe.mood")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <span
                  key={mood}
                  className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full text-sm font-medium"
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>

          {/* Usage Hint */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-sky-500 text-xl leading-none">lightbulb</span>
              <h3 className="font-semibold text-foreground">{t("observe.usageHint")}</h3>
            </div>
            <ul className="space-y-2">
              {usages.map((usage, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="material-icons text-primary/50 text-sm leading-5">chevron_right</span>
                  {usage}
                </li>
              ))}
            </ul>
          </div>

          {/* Scene Suggestions */}
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-emerald-600 text-xl leading-none">nature</span>
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">어울리는 장면</h3>
            </div>
            <div className="space-y-2">
              {scenes.map((scene, i) => (
                <p key={i} className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  {scene}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-icons text-muted-foreground/20 text-6xl leading-none mb-4">search</span>
          <p className="text-muted-foreground text-base">관찰하고 싶은 낱말을 입력해 보세요.</p>
          <p className="text-muted-foreground/60 text-sm mt-1">예: 봄비, 그리움, 설레다</p>
        </div>
      )}
    </div>
  );
}
