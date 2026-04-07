import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

type Tab = "words" | "expansions" | "readings" | "expressions";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function Saved() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("words");
  const { savedWords, savedExpansions, savedReadings, savedExpressions, removeWord, removeExpansion, removeReading, removeExpression } = useSavedItems();
  const { toast } = useToast();

  const tabs = [
    { key: "words" as Tab, label: "관찰한 낱말", icon: "visibility", count: savedWords.length },
    { key: "expansions" as Tab, label: "확장 모음", icon: "account_tree", count: savedExpansions.length },
    { key: "readings" as Tab, label: "읽기 메모", icon: "menu_book", count: savedReadings.length },
    { key: "expressions" as Tab, label: "극적 표현", icon: "theater_comedy", count: savedExpressions.length },
  ];

  const handleRemoveWord = (id: string, word: string) => {
    removeWord(id);
    toast({ title: `"${word}"를 삭제했어요.` });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-icons text-primary text-2xl leading-none">bookmark</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("nav.saved")}</h1>
        </div>
        <p className="text-muted-foreground text-sm">저장한 낱말, 표현 모음, 읽기 메모, 극적 표현을 모두 볼 수 있어요.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            data-testid={`saved-tab-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            <span className="material-icons text-sm leading-none">{tab.icon}</span>
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-secondary text-foreground"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Words Tab */}
      {activeTab === "words" && (
        <div>
          {savedWords.length === 0 ? (
            <EmptyState icon="visibility" message="아직 저장된 낱말이 없어요." link="/observe" linkLabel="낱말 관찰 하러 가기" />
          ) : (
            <div className="space-y-3">
              {savedWords.map((item) => (
                <div key={item.id} data-testid={`saved-word-${item.id}`} className="p-4 rounded-xl bg-card border border-border flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/observe?word=${encodeURIComponent(item.word)}`} className="text-lg font-bold text-primary hover:underline">
                        {item.word}
                      </Link>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.definition}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{formatDate(item.savedAt)}</p>
                  </div>
                  <button
                    data-testid={`delete-word-${item.id}`}
                    onClick={() => handleRemoveWord(item.id, item.word)}
                    className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <span className="material-icons text-base leading-none">delete_outline</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expansions Tab */}
      {activeTab === "expansions" && (
        <div>
          {savedExpansions.length === 0 ? (
            <EmptyState icon="account_tree" message="아직 저장된 확장 모음이 없어요." link="/expand" linkLabel="낱말 확장 하러 가기" />
          ) : (
            <div className="space-y-4">
              {savedExpansions.map((item) => (
                <div key={item.id} data-testid={`saved-expansion-${item.id}`} className="p-5 rounded-xl bg-card border border-border">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground text-base">"{item.topic}" 표현 모음</h3>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">{formatDate(item.savedAt)}</p>
                    </div>
                    <button
                      onClick={() => removeExpansion(item.id)}
                      className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <span className="material-icons text-base leading-none">delete_outline</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.words.map((w, i) => (
                      <span key={i} className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                        {w.word}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Readings Tab */}
      {activeTab === "readings" && (
        <div>
          {savedReadings.length === 0 ? (
            <EmptyState icon="menu_book" message="아직 저장된 읽기 메모가 없어요." link="/read" linkLabel="깊이 읽기 하러 가기" />
          ) : (
            <div className="space-y-4">
              {savedReadings.map((item) => (
                <div key={item.id} data-testid={`saved-reading-${item.id}`} className="p-5 rounded-xl bg-card border border-border">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">{formatDate(item.savedAt)}</p>
                    </div>
                    <button
                      onClick={() => removeReading(item.id)}
                      className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <span className="material-icons text-base leading-none">delete_outline</span>
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 whitespace-pre-line">{item.text}</p>
                  {item.keyWords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.keyWords.map((kw) => (
                        <span key={kw} className="px-2 py-0.5 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-full text-xs font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expressions Tab */}
      {activeTab === "expressions" && (
        <div>
          {savedExpressions.length === 0 ? (
            <EmptyState icon="theater_comedy" message="아직 저장된 극적 표현이 없어요." link="/express" linkLabel="극적 표현 하러 가기" />
          ) : (
            <div className="space-y-4">
              {savedExpressions.map((item) => (
                <div key={item.id} data-testid={`saved-expression-${item.id}`} className="p-5 rounded-xl bg-card border border-border">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm line-clamp-2">"{item.scene}"</h3>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">{formatDate(item.savedAt)}</p>
                    </div>
                    <button
                      onClick={() => removeExpression(item.id)}
                      className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <span className="material-icons text-base leading-none">delete_outline</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">행동 동사</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.actionVerbs.slice(0, 3).map((v) => (
                          <span key={v} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">{v}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">감정 낱말</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.emotions.slice(0, 3).map((e) => (
                          <span key={e} className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 rounded-full text-xs font-medium">{e}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, message, link, linkLabel }: { icon: string; message: string; link: string; linkLabel: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="material-icons text-muted-foreground/20 text-6xl leading-none mb-4">{icon}</span>
      <p className="text-muted-foreground text-base mb-3">{message}</p>
      <Link href={link} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
        {linkLabel}
      </Link>
    </div>
  );
}
