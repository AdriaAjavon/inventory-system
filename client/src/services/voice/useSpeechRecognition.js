import { useState } from "react";
import { createSpeechRecognition } from "./speechRecognition";

export default function useSpeechRecognition() {
  const [listening, setListening] =
    useState(false);

  const [transcript, setTranscript] =
    useState("");

  const recognition =
    createSpeechRecognition();

  const startListening = () => {
    if (!recognition) {
      alert(
        "Speech Recognition is not supported in this browser."
      );

      return;
    }

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const text =
        event.results[0][0].transcript;

      setTranscript(text);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return {
    listening,
    transcript,
    startListening,
    stopListening,
  };
}