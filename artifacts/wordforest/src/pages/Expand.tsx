import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EXPANSION_DATA, DEFAULT_RELATED, DEFAULT_EMOTIONS, DEFAULT_ACTIONS, DEFAULT_DESCRIPTIVE } from "@/data/expansionData";
import WordChip from "@/components/WordChip";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useToast } from "@/hooks/use-toast";

interface WordCollection {
  category: string;
  word: string;
}

function getExpansionResult(input: string) {
  const data = EXPANSION_DATA[input.trim()];
  if (data) return data;
  const firstChar = input.charCodeAt(0);
  return {
    related: DEFAULT_RELATED.slice(firstChar % 4, firstChar % 4 + 5),
    emotions: DEFAULT_EMOTIONS.slice(firstChar % 3, firstChar % 3 + 4),
    actions: DEFAULT_ACTIONS.slice(firstChar % 3, firstChar % 3 + 4),
    descriptive: DEFAULT_DESCRIPTIVE.slice(firstChar % 3, firstChar % 3 + 4),
  };
}

const CATEGORY_CONFIG = [
  { key: "related", labelKey: "expand.related", icon: "hub", variant: "related" as const, color: "text-emerald-600" },
  { key: "emotions", labelKey: "expand.emotions", icon: "favorite", variant: "emotion" as const, color: "text-rose-500" },
  { key: "actions", labelKey: "expand.actions", icon: "directions_run", variant: "action" as const, color: "text-blue-500" },
  { key: "descriptive", labelKey: "expand.descriptive", icon: "palette", variant: "descriptive" as const, color: "text-amber-500" },
];

export default function Expand() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Record<string, string[]> | null>(null);
  const [collection, setCollection] = useState<WordCollection[]>([]);
  const { saveExpansion } = useSavedItems();
  const { toast } = useToast();

  const handleSearch = () => {
    if (!input.trim()) return;
    const data = getExpansionResult(input);
    setResult(data);
  };

  const handleAddWord = (category: string, word: string) => {
    if (!collection.find((c) => c.word === word)) {
      setCollection((prev) => [...prev, { category, word }]);
    }
  };

  const handleRemoveFromCollection = (word: string) => {
    setCollection((prev) => prev.filter((c) => c.word !== word));
  };

  const handleSaveCollection = () => {
    if (collection.length === 0) return;
    saveExpansion(input, collection);
    toast({ title: "표현 모음을 저장했어요!", description: `"${input}" 주제의 낱말 ${collection.length}개를 저장했어요.` });
  };

  const isAdded = (word: string) => collection.some((c) => c.word === word);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-icons text-amber-600 text-2xl leading-none">account_tree</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("expand.title")}</h1>
        </div>
        <p className="text-muted-foreground text-sm">씨앗 낱말에서 가지가 뻗어나가요. 관련 낱말, 감정, 행동어를 모아봐요.</p>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <input
            data-testid="expand-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("expand.placeholder")}
            className="w-full h-12 pl-4 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
          />
        </div>
        <button
          data-testid="expand-search-btn"
          onClick={handleSearch}
          className="h-12 px-5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="material-icons text-base leading-none">account_tree</span>
          확장하기
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Word Groups */}
        <div className="lg:col-span-2 space-y-4">
          {result ? (
            CATEGORY_CONFIG.map((cat) => (
              <div key={cat.key} className="p-5 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`material-icons text-xl leading-none ${cat.color}`}>{cat.icon}</span>
                  <h3 className="font-semibold text-foreground">{t(cat.labelKey)}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(result[cat.key] || []).map((word) => (
                    <WordChip
                      key={word}
                      word={word}
                      variant={cat.variant}
                      onAdd={(w) => handleAddWord(t(cat.labelKey), w)}
                      isAdded={isAdded(word)}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-icons text-muted-foreground/20 text-6xl leading-none mb-4">account_tree</span>
              <p className="text-muted-foreground text-base">주제나 낱말을 입력하면 가지가 뻗어나와요.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">예: 봄, 비밀, 기다림, 이별</p>
            </div>
          )}
        </div>

        {/* Collection Panel */}
        <div className="bg-card border border-border rounded-2xl p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-icons text-primary text-xl leading-none">collections</span>
              <h3 className="font-semibold text-foreground text-sm">내 표현 모음</h3>
              {collection.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none">
                  {collection.length}
                </span>
              )}
            </div>
          </div>

          {collection.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-icons text-muted-foreground/20 text-3xl leading-none mb-2 block">add_circle_outline</span>
              <p className="text-xs text-muted-foreground">낱말 옆의 + 버튼을 눌러<br />모음에 추가해 보세요.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {collection.map((item) => (
                  <span
                    key={item.word}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {item.word}
                    <button
                      data-testid={`remove-collection-${item.word}`}
                      onClick={() => handleRemoveFromCollection(item.word)}
                      className="ml-0.5 hover:opacity-70 transition-opacity"
                    >
                      <span className="material-icons text-xs leading-none">close</span>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  data-testid="save-collection-btn"
                  onClick={handleSaveCollection}
                  className="flex-1 h-9 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                >
                  <span className="material-icons text-sm leading-none">save</span>
                  {t("common.save")}
                </button>
                <button
                  onClick={() => setCollection([])}
                  className="h-9 px-3 border border-border rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <span className="material-icons text-sm leading-none">delete_outline</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
