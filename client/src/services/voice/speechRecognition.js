const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = null;

export function createSpeechRecognition() {
  if (!SpeechRecognition) {
    return null;
  }

  if (recognition) {
    return recognition;
  }

  recognition = new SpeechRecognition();

  recognition.lang = "en-US";

  recognition.interimResults = false;

  recognition.maxAlternatives = 1;

  recognition.continuous = false;

  return recognition;
}