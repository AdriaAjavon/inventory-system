class VoiceService {
  constructor() {
    this.recognition = null;
  }

  initialize(onResult, onEnd) {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition is not supported in this browser."
      );
      return false;
    }

    this.recognition =
      new SpeechRecognition();

    this.recognition.lang = "en-US";

    this.recognition.continuous = false;

    this.recognition.interimResults = false;

    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      onResult(transcript);
    };

    this.recognition.onend = () => {
      if (onEnd) {
        onEnd();
      }
    };

    return true;
  }

  start() {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

export default new VoiceService();