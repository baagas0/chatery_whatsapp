export function estimateTypingTime(text, wpm = 40) {
  if (!text || typeof text !== "string") return 0;

  const charactersPerWord = 5;
  const totalCharacters = text.length;

  const totalWords = totalCharacters / charactersPerWord;
  const minutes = totalWords / wpm;
  const seconds = Math.ceil(minutes * 60);

  return seconds;
}
