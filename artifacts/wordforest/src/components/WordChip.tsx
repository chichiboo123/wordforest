interface WordChipProps {
  word: string;
  onAdd?: (word: string) => void;
  isAdded?: boolean;
  variant?: "default" | "emotion" | "action" | "descriptive" | "related";
}

const variantStyles: Record<string, string> = {
  default: "bg-secondary text-secondary-foreground border-secondary-border",
  emotion: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  action: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  descriptive: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  related: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
};

export default function WordChip({ word, onAdd, isAdded, variant = "default" }: WordChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${variantStyles[variant]}`}
    >
      {word}
      {onAdd && (
        <button
          data-testid={`add-chip-${word}`}
          onClick={() => onAdd(word)}
          className={`ml-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
            isAdded
              ? "bg-primary text-primary-foreground"
              : "bg-black/10 dark:bg-white/10 hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <span className="material-icons text-xs leading-none">{isAdded ? "check" : "add"}</span>
        </button>
      )}
    </span>
  );
}
