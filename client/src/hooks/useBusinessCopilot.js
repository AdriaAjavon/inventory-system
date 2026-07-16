import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  executeCommand,
} from "../services/api";

import {
  saveConversation,
  loadConversation,
} from "../services/utils/localStorage";

import {
  speak,
} from "../services/voice/textToSpeech";

import loadingMessage from "../services/utils/loadingMessage";

// ----------------------------------
// Initial AI Message
// ----------------------------------

const initialMessages = [
  {
    sender: "ai",
    title: "Business Copilot",
    text: "Welcome! I'm your AI Business Copilot. Type or speak a command to manage your business.",
    type: "info",
    data: null,
    createdAt: new Date(),
  },
];

// ----------------------------------
// Hook
// ----------------------------------

export default function useBusinessCopilot() {
  const navigate = useNavigate();

  // ----------------------------
  // State
  // ----------------------------

  const [messages, setMessages] =
    useState(() => {
      return (
        loadConversation() ||
        initialMessages
      );
    });

  const [loading, setLoading] =
    useState(false);

  const [command, setCommand] =
    useState("");

  // ----------------------------
  // Navigation Commands
  // ----------------------------

  const navigationCommands = {
    dashboard: "/",
    home: "/",

    products: "/products",
    inventory: "/products",
    "add product": "/products",

    sales: "/sales",
    sale: "/sales",
    "new sale": "/sales",

    activity: "/activity",
    logs: "/activity",

    history: "/sales-history",
    "sales history":
      "/sales-history",

    receipt:
      "/sales-history",

    receipts:
      "/sales-history",
  };

  // ----------------------------
  // Add Message
  // ----------------------------

  const addMessage =
    useCallback(
      (
        sender,
        text,
        title = "",
        type = "info",
        data = null
      ) => {
        setMessages((prev) => {
          const updated = [
            ...prev,
            {
              sender,
              text,
              title,
              type,
              data,
              createdAt:
                new Date(),
            },
          ];

          saveConversation(
            updated
          );

          return updated;
        });
      },
      []
    );

  // ----------------------------
  // Add Thinking Message
  // ----------------------------

  const addThinkingMessage = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        ...loadingMessage,
        createdAt: new Date(),
      },
    ]);
  }, []);

  // ----------------------------
  // Remove Thinking Message
  // ----------------------------

  const removeThinkingMessage = useCallback(() => {
    setMessages((prev) =>
      prev.filter((message) => message.loading !== true)
    );
  }, []);

  // ----------------------------
  // Clear Conversation
  // ----------------------------

  const clearConversation = useCallback(() => {
    setMessages(initialMessages);
    saveConversation(initialMessages);
  }, []);

  // ----------------------------
  // Execute Navigation
  // ----------------------------

  const executeNavigation =
    useCallback(
      (cmd) => {
        const route =
          navigationCommands[cmd];

        if (!route) return false;

        navigate(route);

        addMessage(
          "ai",
          `Opening ${cmd}...`,
          "Navigation"
        );

        speak(`Opening ${cmd}`);

        return true;
      },
      [navigate, addMessage]
    );

  // ----------------------------
  // Execute Business Command
  // ----------------------------

  const executeBusinessCommand =
    useCallback(
      async (inputCommand) => {
        const cmd =
          inputCommand.trim().toLowerCase();

        if (!cmd) return;

        addMessage(
          "user",
          inputCommand
        );

        // ------------------------
        // Navigation Commands
        // ------------------------

        if (
          executeNavigation(cmd)
        ) {
          setCommand("");
          return;
        }

        // ------------------------
        // Backend Commands
        // ------------------------

        try {
          setLoading(true);
          addThinkingMessage();

          const result = await executeCommand(cmd);

          addMessage(
            "ai",
            result.message,
            result.title,
            result.type,
            result.data
          );

          // Speak short responses only
          if (
            result.message &&
            result.message.length < 120
          ) {
            speak(result.message);
          }
        } catch (error) {
          console.error(
            "Business Copilot:",
            error
          );

          addMessage(
            "ai",
            "Unable to connect to the Business Engine.",
            "Connection Error",
            "error"
          );

          speak(
            "Unable to connect to the business engine."
          );
        } finally {
          removeThinkingMessage();
          setLoading(false);
          setCommand("");
        }
      },
      [
        addMessage,
        executeNavigation,
        addThinkingMessage,
        removeThinkingMessage,
      ]
    );

  // ----------------------------
  // Submit Command
  // ----------------------------

  const submitCommand =
    useCallback(() => {
      executeBusinessCommand(
        command
      );
    }, [
      command,
      executeBusinessCommand,
    ]);

  // ----------------------------
  // Voice Recognition
  // ----------------------------

  const startVoiceRecognition =
    useCallback(() => {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        addMessage(
          "ai",
          "Voice recognition is not supported in this browser.",
          "Voice Assistant",
          "warning"
        );

        return;
      }

      const recognition =
        new SpeechRecognition();

      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        addMessage(
          "ai",
          "Listening...",
          "Voice Assistant"
        );
      };

      recognition.onresult = (event) => {
        const transcript =
          event.results[0][0].transcript;

        setCommand(transcript);

        executeBusinessCommand(
          transcript
        );
      };

      recognition.onerror = (
        event
      ) => {
        addMessage(
          "ai",
          event.error,
          "Voice Error",
          "error"
        );
      };

      recognition.start();
    }, [
      addMessage,
      executeBusinessCommand,
    ]);

  // ----------------------------
  // Smart Suggestions
  // ----------------------------

  const suggestions = [
    "today sales",
    "today revenue",
    "low stock",
    "business health",
    "inventory value",
    "products",
    "sales history",
    "dashboard",
  ];

  const getSuggestions =
    useCallback(
      (text) => {
        if (!text)
          return suggestions;

        return suggestions.filter(
          (item) =>
            item.includes(
              text.toLowerCase()
            )
        );
      },
      []
    );

  // ----------------------------
  // Conversation Helpers
  // ----------------------------

  const removeLastMessage =
    useCallback(() => {
      setMessages((prev) => {
        if (prev.length <= 1)
          return prev;

        const updated =
          prev.slice(
            0,
            prev.length - 1
          );

        saveConversation(
          updated
        );

        return updated;
      });
    }, []);

  const exportConversation =
    useCallback(() => {
      return JSON.stringify(
        messages,
        null,
        2
      );
    }, [messages]);

  // ----------------------------
  // Reset Command Input
  // ----------------------------

  const resetCommand =
    useCallback(() => {
      setCommand("");
    }, []);

  // ----------------------------
  // Stop AI Speech
  // ----------------------------

  const stopSpeaking =
    useCallback(() => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }, []);

  // ----------------------------
  // Public API
  // ----------------------------

  return {
    // State
    command,
    setCommand,

    messages,
    loading,

    // Main Functions
    submitCommand,
    executeBusinessCommand,
    executeNavigation,

    // Voice
    startVoiceRecognition,
    stopSpeaking,

    // Suggestions
    getSuggestions,

    // Conversation
    addMessage,
    clearConversation,
    removeLastMessage,
    exportConversation,

    // Utilities
    resetCommand,
  };
}