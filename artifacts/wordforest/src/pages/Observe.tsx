import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useTranslation } from "react-i18next";
import { lookupWord, type WordResult } from "@/lib/krdict";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useToast } from "@/hooks/use-toast";

// 창작 활동을 위한 어울림 힌트 (단어 특성과 관계없는 일반 제안)
const MOOD_KEYWORDS = [
  "잔잔하다", "따뜻하다", "설레다", "아련하다",
  "신비롭다", "포근하다", "쓸쓸하다", "두근거리다",
];

const USAGE_SUGGESTIONS = [
  "시의 첫 구절에서 분위기를 열어줄 때",
  "인물의 내면을 묘사하는 독백에서",
  "노랫말의 후렴구에서 감정을 강조할 때",
  "장면 전환 전후의 묘사에서",
];

function SourceBadge({ source }: { source: WordResult["source"] }) {
  if (source === "krdict") {
    return (
      <a
        href="https://stdict.korean.go.kr"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:opacity-80 transition-opacity"
        title="국립국어원 표준국어대사전에서 가져온 뜻풀이입니다"
      >
        <span className="material-icons text-xs leading-none">menu_book</span>
        표준국어대사전
      </a>
    );
  }
  if (source === "mock") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border">
        <span className="material-icons text-xs leading-none">inventory_2</span>
        샘플 데이터
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-700">
      <span className="material-icons text-xs leading-none">info</span>
      사전 미등재
    </span>
  );
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
      setLoading(true);
      lookupWord(initialWord).then((res) => {
        setResult(res);
        setLoading(false);
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
          {/* 낱말 뜻풀이 (표준국어대사전) */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h2 className="text-3xl font-bold text-primary">{result.word}</h2>
                  <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full font-medium">
                    {result.pos}
                  </span>
                  <SourceBadge source={result.source} />
                </div>
                <p className="text-foreground text-base leading-relaxed font-medium">{result.definition}</p>
                {result.example && (
                  <p className="text-muted-foreground text-sm mt-3 pl-3 border-l-2 border-primary/20">
                    <span className="text-muted-foreground/60 text-xs block mb-0.5">예문</span>
                    <span className="italic">"{result.example}"</span>
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

          {/* 창작 활용 힌트 */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons text-amber-500 text-xl leading-none">lightbulb</span>
              <h3 className="font-semibold text-foreground">창작 활용 힌트</h3>
            </div>
            <div className="space-y-4">
              {/* 분위기 낱말 */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">어울리는 분위기</p>
                <div className="flex flex-wrap gap-2">
                  {MOOD_KEYWORDS.map((mood) => (
                    <span
                      key={mood}
                      className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full text-sm font-medium"
                    >
                      {mood}
                    </span>
                  ))}
                </div>
              </div>
              {/* 사용 상황 */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">어울리는 상황</p>
                <ul className="space-y-1.5">
                  {USAGE_SUGGESTIONS.map((usage, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="material-icons text-primary/50 text-sm leading-5">chevron_right</span>
                      {usage}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 낱말 확장으로 이동 */}
          {result.source !== "fallback" && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-icons text-emerald-600 text-xl leading-none">account_tree</span>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  <span className="font-semibold">"{result.word}"</span>에서 가지를 뻗어볼까요?
                </p>
              </div>
              <a
                href={`/expand`}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, "", `/expand`);
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="shrink-0 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                낱말 확장 →
              </a>
            </div>
          )}
        </div>
      )}

      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-6">
            <span className="material-icons text-muted-foreground/20 text-6xl leading-none">search</span>
          </div>
          <p className="text-muted-foreground text-base">관찰하고 싶은 낱말을 입력해 보세요.</p>
          <p className="text-muted-foreground/60 text-sm mt-1">예: 봄비, 그리움, 설레다</p>
          <div className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground/50">
            <span className="material-icons text-xs leading-none">menu_book</span>
            국립국어원 표준국어대사전 연동
          </div>
        </div>
      )}
    </div>
  );
}
