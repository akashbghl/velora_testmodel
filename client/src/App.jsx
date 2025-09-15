import React, { useState, useEffect } from "react";
import axios from "axios";
import Vapi from "@vapi-ai/web";

const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const vapi = new Vapi(VAPI_PUBLIC_KEY);

const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Call started
    vapi.on("call-start", () => {
      console.log("Call has started");
    });

    // Call ended
    vapi.on("call-end", () => {
      console.log("Call has stopped");
    });

    // Speech started
    vapi.on("speech-start", () => {
      console.log("Speech has started");
    });

    // Speech ended
    vapi.on("speech-end", () => {
      console.log("Speech has ended");
    });

    // User speech transcription
    vapi.on("speech", (event) => {
      console.log("User said:", event.text);
      setMessages((prev) => [...prev, { role: "user", content: event.text }]);
    });

    // Assistant messages
    vapi.on("message", (message) => {
      console.log("Assistant:", message);
      setMessages((prev) => [
        ...prev,
        { role: message.role || "assistant", content: message.transcript },
      ]);
    });

    // Volume (optional: could show live mic/assistant level indicator)
    vapi.on("volume-level", (volume) => {
      console.log(`Assistant volume level: ${volume}`);
    });
  }, []);

  // Start assistant
  async function startAssistant() {
    try {
      const res = await axios.get("http://localhost:3000/config");
      const { assistantId } = res.data;
      await vapi.start(assistantId);
      console.log("Assistant started ✅");
    } catch (error) {
      console.error("Error starting assistant:", error);
    }
  }

  // Stop assistant
  function stopAssistant() {
    vapi.stop();
    console.log("Assistant stopped ⏹️");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Velora - AI Friend 👩‍💻</h2>
      <button onClick={startAssistant}>Start</button>
      <button onClick={stopAssistant}>End</button>

      <div
        style={{
          marginTop: "20px",
          border: "1px solid gray",
          padding: "10px",
          borderRadius: "8px",
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, idx) => (
          <p key={idx} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.content}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
