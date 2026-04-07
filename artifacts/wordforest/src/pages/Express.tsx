import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EXPRESS_DATA } from "@/data/expressData";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useToast } from "@/hooks/use-toast";

function detectSceneType(input: string): keyof typeof EXPRESS_DATA {
  for (const [type, data] of Object.entries(EXPRESS_DATA)) {
    if (type === "default") continue;
    if ((data as typeof EXPRESS_DATA.apology).keywords.some((kw) => input.includes(kw))) {
      return type as keyof typeof EXPRESS_DATA;
    }
  }
  return "default";
}

const EXAMPLE_SCENES = [
  "친구에게 미안하지만 쉽게 사과하지 못하는 장면",
  "오래전 헤어진 친구가 너무 보고 싶은 장면",
  "처음 무대에 서서 설레고 긴장된 장면",
  "기쁜 소식을 받아 행복이 넘치는 장면",
];

export default function Express() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ type: string; actionVerbs: string[]; emotions: string[]; hints: string[] } | null>(null);
  const { saveExpression } = useSavedItems();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!input.trim()) return;
    const type = detectSceneType(input);
    const data = EXPRESS_DATA[type];
    setResult({
      type,
      actionVerbs: data.actionVerbs,
      emotions: data.emotions,
      hints: data.hints,
    });
  };

  const handleSave = () => {
    if (!result) return;
    saveExpression(input, result.actionVerbs, result.emotions, result.hints);
    toast({ title: "극적 표현을 저장했어요!", description: "저장함에서 확인할 수 있어요." });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-icons text-violet-600 text-2xl leading-none">theater_comedy</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("express.title")}</h1>
        </div>
        <p className="text-muted-foreground text-sm">장면과 감정을 몸과 목소리로 표현해봐요. 연기 힌트와 표현 어휘를 찾아봐요.</p>
      </div>

      {/* Example Scenes */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">예시 장면:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_SCENES.map((scene) => (
            <button
              key={scene}
              data-testid={`example-scene-${scene.slice(0, 5)}`}
              onClick={() => setInput(scene)}
              className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
            >
              {scene}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mb-4">
        <textarea
          data-testid="express-textarea"
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(null); }}
          placeholder={t("express.placeholder")}
          rows={4}
          className="w-full p-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base resize-none leading-relaxed"
        />
      </div>

      <div className="flex gap-3 mb-8">
        <button
          data-testid="express-generate-btn"
          onClick={handleGenerate}
          disabled={!input.trim()}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
        >
          <span className="material-icons text-base leading-none">theater_comedy</span>
          표현 찾기
        </button>
        {result && (
          <button
            data-testid="express-save-btn"
            onClick={handleSave}
            className="px-4 py-2.5 border border-border rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors flex items-center gap-1"
          >
            <span className="material-icons text-base leading-none">bookmark_border</span>
            {t("common.save")}
          </button>
        )}
      </div>

      {result && (
        <div className="space-y-5">
          {/* Scene type label */}
          {result.type !== "default" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="material-icons text-sm leading-none">label</span>
              <span>
                {result.type === "apology" && "사과와 망설임의 장면으로 분석했어요."}
                {result.type === "longing" && "그리움과 기다림의 장면으로 분석했어요."}
                {result.type === "joy" && "기쁨과 설레임의 장면으로 분석했어요."}
              </span>
            </div>
          )}

          {/* Action Verbs */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-blue-500 text-xl leading-none">directions_run</span>
              <h3 className="font-semibold text-foreground">{t("express.actionVerbs")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.actionVerbs.map((verb) => (
                <span
                  key={verb}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-medium"
                >
                  {verb}
                </span>
              ))}
            </div>
          </div>

          {/* Emotion Words */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-rose-500 text-xl leading-none">favorite</span>
              <h3 className="font-semibold text-foreground">{t("express.emotionWords")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.emotions.map((emotion) => (
                <span
                  key={emotion}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-full text-sm font-medium"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Hints */}
          <div className="p-5 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-violet-600 text-xl leading-none">record_voice_over</span>
              <h3 className="font-semibold text-violet-800 dark:text-violet-200">{t("express.performanceHints")}</h3>
            </div>
            <ul className="space-y-3">
              {result.hints.map((hint, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-200 dark:bg-violet-800 flex items-center justify-center text-violet-700 dark:text-violet-300 text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed">{hint}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Teacher tip */}
          <div className="p-4 rounded-xl bg-muted border border-border text-sm text-muted-foreground">
            <span className="material-icons text-sm leading-5 mr-1 align-text-top">tips_and_updates</span>
            이 표현들을 참고해서 자신만의 방식으로 장면을 표현해 보세요. 정답은 없어요!
          </div>
        </div>
      )}

      {!result && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-icons text-muted-foreground/20 text-6xl leading-none mb-4">theater_comedy</span>
          <p className="text-muted-foreground text-base">어떤 장면이나 감정을 표현하고 싶으신가요?</p>
          <p className="text-muted-foreground/60 text-sm mt-1">위의 예시를 눌러 시작해 보세요.</p>
        </div>
      )}
    </div>
  );
}
