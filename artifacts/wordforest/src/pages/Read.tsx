import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SAMPLE_TEXTS } from "@/data/sampleTexts";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useToast } from "@/hooks/use-toast";

const FUNCTIONAL_WORDS = new Set([
  "이", "가", "을", "를", "은", "는", "의", "에", "에서", "로", "으로",
  "와", "과", "도", "만", "까지", "부터", "에게", "한테", "께", "더",
  "그", "저", "이것", "그것", "저것", "것", "수", "때", "중", "안",
  "하다", "있다", "없다", "되다", "이다", "아니다", "같다", "나", "너", "우리",
  "그리고", "하지만", "그런데", "그래서", "또", "또는", "아", "오", "에",
]);

const MOOD_TEMPLATES = [
  "이 글은 잔잔하고 따뜻한 분위기를 담고 있어요. 마치 봄날 조용한 오후처럼 느껴져요.",
  "설레는 기다림과 간절한 그리움이 함께 느껴지는 글이에요. 독자의 마음을 천천히 두드려요.",
  "고요하면서도 깊은 감정이 흐르는 글이에요. 말하지 않아도 느껴지는 것들이 담겨 있어요.",
  "이 글 속에는 조심스럽고 복잡한 마음이 담겨 있어요. 등장인물의 내면이 섬세하게 표현되어 있어요.",
];

const STUDENT_TIPS = [
  "이 낱말이 글 전체의 분위기를 만들어요.",
  "이 표현은 감정을 담고 있는 중요한 낱말이에요.",
  "반복되는 낱말은 작가가 특별히 강조하고 싶은 것이에요.",
  "이 낱말을 소리 내어 읽어보면 느낌이 더 잘 와닿아요.",
];

const TEACHER_TIPS = [
  "이 낱말은 주제를 담은 핵심어로, 학생들과 함께 연상 활동을 해볼 수 있어요.",
  "반복과 대조를 통해 감정의 흐름을 분석하는 활동으로 연결할 수 있어요.",
  "이 표현을 바꿔 써보는 활동으로 창의적 표현력을 기를 수 있어요.",
  "전체적인 분위기를 몸짓이나 그림으로 표현해보는 통합 활동으로 확장 가능해요.",
];

function extractKeyWords(text: string): string[] {
  const words = text
    .replace(/[().,!?~\n"']/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !FUNCTIONAL_WORDS.has(w));
  const freq: Record<string, number> = {};
  words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
}

function findSymbolicWords(text: string): string[] {
  const symbolic: string[] = [];
  const words = text.replace(/[().,!?~\n"']/g, " ").split(/\s+/).filter((w) => w.length >= 2);
  const freq: Record<string, number> = {};
  words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
  Object.entries(freq).forEach(([w, count]) => {
    if (count >= 2 && !FUNCTIONAL_WORDS.has(w)) {
      symbolic.push(w);
    }
  });
  return symbolic.slice(0, 5);
}

function getMoodForText(text: string): string {
  const idx = text.length % MOOD_TEMPLATES.length;
  return MOOD_TEMPLATES[idx];
}

export default function Read() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"student" | "teacher">("student");
  const [analyzed, setAnalyzed] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const { saveReading } = useSavedItems();
  const { toast } = useToast();

  const keyWords = analyzed ? extractKeyWords(text) : [];
  const symbolicWords = analyzed ? findSymbolicWords(text) : [];
  const mood = analyzed ? getMoodForText(text) : "";
  const tips = mode === "student" ? STUDENT_TIPS : TEACHER_TIPS;

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setAnalyzed(true);
  };

  const handleLoadSample = (sample: typeof SAMPLE_TEXTS[0]) => {
    setText(sample.text);
    setAnalyzed(false);
    setSelectedWord(null);
  };

  const handleSave = () => {
    const title = text.split("\n")[0].slice(0, 20) + (text.length > 20 ? "..." : "");
    saveReading(title, text, keyWords);
    toast({ title: "읽기 내용을 저장했어요!", description: "저장함에서 확인할 수 있어요." });
  };

  const getWordTip = (word: string) => {
    const idx = word.charCodeAt(0) % tips.length;
    return tips[idx];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-icons text-sky-600 text-2xl leading-none">menu_book</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("read.title")}</h1>
        </div>
        <p className="text-muted-foreground text-sm">시, 노랫말, 짧은 글을 깊이 읽어봐요. 중요한 낱말과 분위기를 함께 찾아봐요.</p>
      </div>

      {/* Sample Texts */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-muted-foreground self-center">예시 글:</span>
        {SAMPLE_TEXTS.map((s) => (
          <button
            key={s.title}
            data-testid={`sample-text-${s.title}`}
            onClick={() => handleLoadSample(s)}
            className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Text Input */}
      <div className="mb-4">
        <textarea
          data-testid="read-textarea"
          value={text}
          onChange={(e) => { setText(e.target.value); setAnalyzed(false); setSelectedWord(null); }}
          placeholder={t("read.placeholder")}
          rows={7}
          className="w-full p-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base resize-none leading-relaxed"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex rounded-xl border border-border overflow-hidden bg-card">
          <button
            data-testid="mode-student"
            onClick={() => setMode("student")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {t("read.studentMode")}
          </button>
          <button
            data-testid="mode-teacher"
            onClick={() => setMode("teacher")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === "teacher" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {t("read.teacherMode")}
          </button>
        </div>
        <button
          data-testid="read-analyze-btn"
          onClick={handleAnalyze}
          disabled={!text.trim()}
          className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
        >
          <span className="material-icons text-base leading-none">auto_awesome</span>
          깊이 읽기
        </button>
        {analyzed && (
          <button
            data-testid="read-save-btn"
            onClick={handleSave}
            className="px-4 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors flex items-center gap-1"
          >
            <span className="material-icons text-base leading-none">bookmark_border</span>
            {t("common.save")}
          </button>
        )}
      </div>

      {analyzed && (
        <div className="space-y-5">
          {/* Mood */}
          <div className="p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-sky-600 text-xl leading-none">waves</span>
              <h3 className="font-semibold text-sky-800 dark:text-sky-200">{t("read.mood")}</h3>
            </div>
            <p className="text-sm text-sky-700 dark:text-sky-300 leading-relaxed">{mood}</p>
          </div>

          {/* Key Words */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-primary text-xl leading-none">star</span>
              <h3 className="font-semibold text-foreground">{t("read.keywords")}</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {keyWords.map((kw) => (
                <button
                  key={kw}
                  data-testid={`keyword-${kw}`}
                  onClick={() => setSelectedWord(selectedWord === kw ? null : kw)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    selectedWord === kw
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-secondary-foreground border-secondary-border hover:border-primary/50"
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>
            {selectedWord && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm text-foreground leading-relaxed">
                <span className="font-semibold text-primary">"{selectedWord}"</span>{" "}
                <span className="text-muted-foreground">— {getWordTip(selectedWord)}</span>
              </div>
            )}
          </div>

          {/* Symbolic Words */}
          {symbolicWords.length > 0 && (
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-icons text-violet-500 text-xl leading-none">auto_fix_high</span>
                <h3 className="font-semibold text-foreground">{t("read.symbolic")}</h3>
                <span className="text-xs text-muted-foreground">(반복 등장하는 표현)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {symbolicWords.map((sw) => (
                  <span
                    key={sw}
                    className="px-3 py-1.5 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 rounded-full text-sm font-medium"
                  >
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mode-specific Tips */}
          <div className={`p-5 rounded-2xl border ${
            mode === "student"
              ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
              : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`material-icons text-xl leading-none ${mode === "student" ? "text-amber-600" : "text-emerald-600"}`}>
                {mode === "student" ? "school" : "psychology"}
              </span>
              <h3 className={`font-semibold ${mode === "student" ? "text-amber-800 dark:text-amber-200" : "text-emerald-800 dark:text-emerald-200"}`}>
                {mode === "student" ? "학생을 위한 해설" : "교사를 위한 지도 안내"}
              </h3>
            </div>
            <ul className="space-y-2">
              {tips.slice(0, 3).map((tip, i) => (
                <li key={i} className={`flex items-start gap-2 text-sm leading-relaxed ${
                  mode === "student" ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300"
                }`}>
                  <span className="material-icons text-sm leading-5 shrink-0">chevron_right</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!analyzed && !text && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-icons text-muted-foreground/20 text-6xl leading-none mb-4">menu_book</span>
          <p className="text-muted-foreground text-base">시나 노랫말을 붙여넣고 깊이 읽어봐요.</p>
          <p className="text-muted-foreground/60 text-sm mt-1">또는 위의 예시 글을 골라보세요.</p>
        </div>
      )}
    </div>
  );
}
