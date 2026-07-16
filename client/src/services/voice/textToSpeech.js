let speech = null;

export function speak(text) {
  if (!("speechSynthesis" in window)) {
    console.warn(
      "Text-to-Speech is not supported in this browser."
    );
    return;
  }

  stopSpeaking();

  speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";

  speech.rate = 1;

  speech.pitch = 1;

  speech.volume = 1;

  window.speechSynthesis.speak(speech);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function pauseSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.resume();
  }
}

export function isSpeaking() {
  if (!("speechSynthesis" in window)) {
    return false;
  }

  return window.speechSynthesis.speaking;
}
