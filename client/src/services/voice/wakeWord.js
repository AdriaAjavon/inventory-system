const WAKE_WORD = "hey inventory";

export function getWakeWord() {
  return WAKE_WORD;
}

export function isWakeWord(transcript = "") {
  return transcript
    .trim()
    .toLowerCase()
    .includes(WAKE_WORD);
}