import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useTodayWord } from "@/hooks/useTodayWord";
import { useSavedItems } from "@/hooks/useSavedItems";

const SECTION_CARDS = [
  {
    href: "/observe",
    icon: "visibility",
    colorClass: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    titleKey: "nav.observe",
    descKo: "낱말 하나를 천천히 들여다봐요.\n뜻과 느낌, 어울리는 장면을 찾아봐요.",
    descEn: "Look closely at one word at a time.\nDiscover its meaning, mood, and where it fits.",
    descJa: "一つの言葉をゆっくり観察しましょう。\n意味や雰囲気、使える場面を探しましょう。",
    step: "01",
  },
  {
    href: "/expand",
    icon: "account_tree",
    colorClass: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleKey: "nav.expand",
    descKo: "씨앗 낱말에서 가지가 뻗어나가요.\n관련 낱말, 감정, 행동어를 모아봐요.",
    descEn: "From one seed word, branches grow.\nGather related words, emotions, and actions.",
    descJa: "種の言葉から枝が広がります。\n関連語、感情語、行動語を集めましょう。",
    step: "02",
  },
  {
    href: "/read",
    icon: "menu_book",
    colorClass: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800",
    iconColor: "text-sky-600 dark:text-sky-400",
    titleKey: "nav.read",
    descKo: "시, 노랫말, 짧은 글을 깊이 읽어요.\n중요한 낱말과 분위기를 함께 찾아봐요.",
    descEn: "Read poems, lyrics, and passages deeply.\nFind the key words and emotional atmosphere.",
    descJa: "詩や歌詞、短い文章を深く読みましょう。\n重要な言葉と雰囲気を一緒に探しましょう。",
    step: "03",
  },
  {
    href: "/express",
    icon: "theater_comedy",
    colorClass: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800",
    iconColor: "text-violet-600 dark:text-violet-400",
    titleKey: "nav.express",
    descKo: "장면과 감정을 몸과 목소리로 표현해요.\n연기 힌트와 표현 어휘를 찾아봐요.",
    descEn: "Express scenes and emotions with voice and body.\nFind action verbs and performance hints.",
    descJa: "場面と感情を声と体で表現しましょう。\n演技ヒントと表現語彙を探しましょう。",
    step: "04",
  },
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const todayWord = useTodayWord();
  const { savedWords } = useSavedItems();
  const getLangDesc = (card: typeof SECTION_CARDS[0]) => {
    if (i18n.language === "en") return card.descEn;
    if (i18n.language === "ja") return card.descJa;
    return card.descKo;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero */}
      <section className="text-center mb-12 sm:mb-16">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
          <div className="relative w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
            <span className="material-icons text-primary text-4xl leading-none">forest</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2 tracking-tight">
          낱말의 숲
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-1 font-medium">WordForest</p>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mt-3">
          {t("appTagline")}
        </p>
      </section>

      {/* Learning Flow */}
      <section className="mb-10 sm:mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
          {["낱말 관찰", "낱말 확장", "깊이 읽기", "극적 표현"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">{step}</span>
              {i < 3 && (
                <span className="material-icons text-muted-foreground/50 text-lg leading-none">
                  arrow_forward
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-10 sm:mb-14">
        {SECTION_CARDS.map((card) => (
          <Link key={card.href} href={card.href}>
            <div
              data-testid={`section-card-${card.href.slice(1)}`}
              className={`group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${card.colorClass}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-white/60 dark:bg-black/20 shadow-sm">
                  <span className={`material-icons text-2xl leading-none ${card.iconColor}`}>
                    {card.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-muted-foreground/60 tracking-widest">{card.step}</span>
                    <h2 className="text-base font-bold text-foreground">{t(card.titleKey)}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {getLangDesc(card)}
                  </p>
                </div>
                <span className="material-icons text-muted-foreground/30 group-hover:text-primary/50 transition-colors leading-none mt-0.5">
                  chevron_right
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Today's Word & Recent Saved */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Today's Word */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons text-accent text-xl leading-none">wb_sunny</span>
            <h3 className="font-semibold text-foreground text-base">{t("home.todayWord")}</h3>
          </div>
          <Link href={`/observe?word=${encodeURIComponent(todayWord)}`}>
            <div className="group cursor-pointer">
              <div className="text-3xl font-bold text-primary mb-3 group-hover:text-primary/80 transition-colors">
                {todayWord}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mb-2">
                <span className="material-icons text-xs leading-none">menu_book</span>
                표준국어대사전에서 뜻 찾아보기
              </div>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                이 낱말을 눌러서 관찰해 보세요. →
              </p>
            </div>
          </Link>
        </div>

        {/* Recent Saved */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-icons text-accent text-xl leading-none">bookmark</span>
              <h3 className="font-semibold text-foreground text-base">{t("home.recentSaved")}</h3>
            </div>
            {savedWords.length > 0 && (
              <Link href="/saved" className="text-xs text-primary hover:underline">
                전체 보기
              </Link>
            )}
          </div>
          {savedWords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <span className="material-icons text-muted-foreground/30 text-4xl leading-none mb-2">bookmark_border</span>
              <p className="text-sm text-muted-foreground">아직 저장된 낱말이 없어요.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">낱말을 관찰하고 저장해 보세요!</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {savedWords.slice(0, 6).map((sw) => (
                <Link key={sw.id} href={`/observe?word=${encodeURIComponent(sw.word)}`}>
                  <span className="inline-block px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                    {sw.word}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
