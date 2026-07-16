import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaMicrophone } from "react-icons/fa";

function VoiceAssistant() {
  const navigate = useNavigate();

  const [listening, setListening] =
    useState(false);

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition is not supported in this browser."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const command =
        event.results[0][0].transcript
          .toLowerCase();

      console.log(command);

      if (
        command.includes("dashboard") ||
        command.includes("home")
      ) {
        navigate("/");
      }

      else if (
        command.includes("product") ||
        command.includes("inventory")
      ) {
        navigate("/products");
      }

      else if (
        command.includes("sale")
      ) {
        navigate("/sales");
      }

      else if (
        command.includes("history")
      ) {
        navigate("/sales-history");
      }

      else if (
        command.includes("activity")
      ) {
        navigate("/activity");
      }

      else {
        alert(
          `Command not recognized:\n${command}`
        );
      }

      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);

      alert(
        "Voice recognition failed."
      );
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">

      <div className="text-center">

        <FaMicrophone
          size={60}
          className={`mx-auto ${
            listening
              ? "text-red-500 animate-pulse"
              : "text-pink-400"
          }`}
        />

        <h2 className="text-2xl font-bold mt-6">
          Voice Assistant
        </h2>

        <p className="text-slate-400 mt-3">
          {listening
            ? "Listening..."
            : "Speak naturally to manage inventory and sales."}
        </p>

        <button
          onClick={startVoice}
          className="mt-8 bg-pink-500 hover:bg-pink-400 px-8 py-3 rounded-xl font-bold transition"
        >
          {listening
            ? "Listening..."
            : "Start Listening"}
        </button>

      </div>

    </div>
  );
}

export default VoiceAssistant;