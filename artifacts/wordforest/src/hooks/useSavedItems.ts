import { useLocalStorage } from "./useLocalStorage";

export interface SavedWord {
  id: string;
  word: string;
  definition: string;
  savedAt: string;
}

export interface SavedExpansionSet {
  id: string;
  topic: string;
  words: { category: string; word: string }[];
  savedAt: string;
}

export interface SavedReading {
  id: string;
  title: string;
  text: string;
  keyWords: string[];
  savedAt: string;
}

export interface SavedExpression {
  id: string;
  scene: string;
  actionVerbs: string[];
  emotions: string[];
  hints: string[];
  savedAt: string;
}

export function useSavedItems() {
  const [savedWords, setSavedWords] = useLocalStorage<SavedWord[]>("wordforest_words", []);
  const [savedExpansions, setSavedExpansions] = useLocalStorage<SavedExpansionSet[]>("wordforest_expansions", []);
  const [savedReadings, setSavedReadings] = useLocalStorage<SavedReading[]>("wordforest_readings", []);
  const [savedExpressions, setSavedExpressions] = useLocalStorage<SavedExpression[]>("wordforest_expressions", []);

  const saveWord = (word: string, definition: string) => {
    const item: SavedWord = {
      id: `word-${Date.now()}`,
      word,
      definition,
      savedAt: new Date().toISOString(),
    };
    setSavedWords((prev) => [item, ...prev.filter((w) => w.word !== word)]);
    return item;
  };

  const removeWord = (id: string) => {
    setSavedWords((prev) => prev.filter((w) => w.id !== id));
  };

  const saveExpansion = (topic: string, words: { category: string; word: string }[]) => {
    const item: SavedExpansionSet = {
      id: `exp-${Date.now()}`,
      topic,
      words,
      savedAt: new Date().toISOString(),
    };
    setSavedExpansions((prev) => [item, ...prev]);
    return item;
  };

  const removeExpansion = (id: string) => {
    setSavedExpansions((prev) => prev.filter((e) => e.id !== id));
  };

  const saveReading = (title: string, text: string, keyWords: string[]) => {
    const item: SavedReading = {
      id: `read-${Date.now()}`,
      title,
      text,
      keyWords,
      savedAt: new Date().toISOString(),
    };
    setSavedReadings((prev) => [item, ...prev]);
    return item;
  };

  const removeReading = (id: string) => {
    setSavedReadings((prev) => prev.filter((r) => r.id !== id));
  };

  const saveExpression = (scene: string, actionVerbs: string[], emotions: string[], hints: string[]) => {
    const item: SavedExpression = {
      id: `expr-${Date.now()}`,
      scene,
      actionVerbs,
      emotions,
      hints,
      savedAt: new Date().toISOString(),
    };
    setSavedExpressions((prev) => [item, ...prev]);
    return item;
  };

  const removeExpression = (id: string) => {
    setSavedExpressions((prev) => prev.filter((e) => e.id !== id));
  };

  const totalSaved = savedWords.length + savedExpansions.length + savedReadings.length + savedExpressions.length;

  return {
    savedWords,
    savedExpansions,
    savedReadings,
    savedExpressions,
    totalSaved,
    saveWord,
    removeWord,
    saveExpansion,
    removeExpansion,
    saveReading,
    removeReading,
    saveExpression,
    removeExpression,
  };
}
