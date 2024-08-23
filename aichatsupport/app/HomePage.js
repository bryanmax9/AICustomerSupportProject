"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation"; // Change to next/navigation
import { auth } from "./firebaseConfig";
import styles from "./homepage.module.css";

export default function HomePage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi👋, I'm your personal bot assistant. How can I help you?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [eyesClosed, setEyesClosed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setEyesClosed((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (content = userInput) => {
    if (typeof content !== "string" || content.trim() === "") {
      alert("Please enter a message before sending.");
      return;
    }

    setUserInput("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: content },
      { role: "assistant", content: "" },
    ]);

    const response = fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }).then(async (res) => {
      const result = await res.json();
      const text = result.message;

      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1];
        let otherMessages = messages.slice(0, messages.length - 1);

        return [...otherMessages, { ...lastMessage, content: text }];
      });

      // Trigger text-to-speech
      speak(text);
    });
  };

  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "Speech Recognition is not supported in this browser. Please use Chrome or Safari, or use the text input."
      );
      return;
    }

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false; // Stop recognition when the user stops speaking
    recognition.interimResults = false; // Only capture final results

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
    };

    recognition.start();
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login"); // Redirect to the login page after logging out
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <Box className={styles.container}>
      {/* Video Background with Linear Gradient */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        className={styles.videoBackground}
      >
        <source src="./videos/background.mp4" type="video/mp4" />
      </Box>
      <Box className={styles.gradientOverlay} />

      {/* Chat Box Centered at the Bottom */}
      <Box className={styles.chatContainer}>
        {/* Robot Face */}
        <Box className={styles.robotFace}>
          <Box className={`${styles.eye} ${eyesClosed ? styles.closed : ""}`} />
          <Box className={`${styles.eye} ${eyesClosed ? styles.closed : ""}`} />
        </Box>

        <Stack className={styles.chatBox}>
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                className={styles.messageBox}
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                <Box
                  className={
                    message.role === "assistant"
                      ? styles.assistantMessage
                      : styles.userMessage
                  }
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack className={styles.inputContainer}>
            <TextField
              label="Message"
              fullWidth
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button variant="contained" onClick={() => sendMessage(userInput)}>
              Send
            </Button>
            <Button variant="contained" onClick={startListening}>
              Speak
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
