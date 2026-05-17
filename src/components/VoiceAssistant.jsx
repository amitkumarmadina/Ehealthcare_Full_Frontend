import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, MessageSquare, X, Send, Volume2, User, Bot } from "lucide-react";

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am your Svasthya voice assistant. You can ask me questions or tell me to navigate somewhere, like 'Go to pharmacy' or 'Book appointment'." }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Initialize Speech Recognition once
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";
      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.lang = "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  const processIntent = useCallback((query) => {
    let reply = "I didn't quite catch that. Try asking to 'book an appointment' or 'go to dashboard'.";
    let route = null;

    if (query.includes("dashboard") || query.includes("home")) {
      reply = "Navigating to your dashboard now.";
      route = "/dashboard";
    } else if (query.includes("book") || query.includes("appointment") || query.includes("doctor")) {
      reply = "Taking you to the appointment booking page. You can select a doctor and time there.";
      route = "/appointment";
    } else if (query.includes("video") || query.includes("consult")) {
      reply = "Opening the virtual care hub for video consultations.";
      route = "/video-consult";
    } else if (query.includes("pharmacy") || query.includes("medicine")) {
      reply = "Going to the e-pharmacy. You can order your medicines here.";
      route = "/medicines";
    } else if (query.includes("ambulance") || query.includes("sos") || query.includes("emergency")) {
      reply = "Opening emergency ambulance services immediately.";
      route = "/ambulance";
    } else if (query.includes("nearby") || query.includes("hospital") || query.includes("map")) {
      reply = "Finding nearby hospitals and services for you.";
      route = "/nearby";
    } else if (query.includes("profile") || query.includes("account") || query.includes("record")) {
      reply = "Opening your personal profile and medical records.";
      route = "/profile";
    } else if (query.includes("ai") || query.includes("recommend") || query.includes("symptom")) {
      reply = "Navigating to AI symptom analysis and recommendations.";
      route = "/ai-recommend";
    } else if (query.includes("how to use") || query.includes("help")) {
      reply = "I am a voice assistant designed to help you. You can press the microphone button and say things like 'Order medicines' or 'Book an appointment'. I can also read pages out loud for you.";
    } else if (query.includes("fee") || query.includes("cost") || query.includes("price")) {
      reply = "Consultation fees vary by doctor. You can see the exact fee on the doctor's profile when booking an appointment.";
    } else if (query.includes("senior") || query.includes("elderly")) {
      reply = "We offer special priority and easy navigation for senior citizens. Just tell me what you need, like 'book a checkup'.";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "bot", text: reply }]);
      speak(reply);
      if (route && window.location.pathname !== route) {
        navigate(route);
      }
    }, 600);
  }, [navigate]);

  const handleUserMessage = useCallback((text) => {
    const userMsg = text.trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInputText("");
    processIntent(userMsg.toLowerCase());
  }, [processIntent]);

  // Bind event handlers to recognitionRef whenever handleUserMessage changes
  useEffect(() => {
    const rec = recognitionRef.current;
    if (rec) {
      rec.onstart = () => setIsListening(true);
      rec.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      rec.onend = () => setIsListening(false);
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };
    }
  }, [handleUserMessage]);

  const toggleListen = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      alert("Speech Recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    
    if (isListening) {
      rec.stop();
    } else {
      if (!isOpen) setIsOpen(true);
      try {
        rec.start();
      } catch (e) {
        console.error("Could not start recognition:", e);
      }
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-teal-600 rounded-full shadow-[0_0_40px_rgba(13,148,136,0.4)] flex items-center justify-center text-white hover:bg-teal-700 transition-all z-[100] group hover:scale-110"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <span className="absolute -top-12 right-0 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Voice Assistant
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-6 w-80 sm:w-96 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden z-[100] flex flex-col h-[500px] max-h-[75vh] animate-in slide-in-from-bottom-10">
          <div className="bg-teal-600 p-5 text-white flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-black text-lg flex items-center gap-2"><Volume2 size={20} /> Assistant</h3>
              <p className="text-[10px] font-medium text-teal-100 uppercase tracking-widest mt-0.5">Voice Enabled</p>
            </div>
            {isListening && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-teal-100 text-teal-600'}`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3.5 rounded-2xl max-w-[75%] text-sm font-medium ${
                  msg.sender === 'user' 
                    ? 'bg-gray-900 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-5 bg-white border-t border-gray-100 shrink-0">
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUserMessage(inputText)}
                placeholder="Type or speak..."
                className="flex-1 bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
              />
              <button 
                onClick={() => handleUserMessage(inputText)}
                className="bg-gray-900 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black transition-colors shadow-sm"
              >
                <Send size={16} />
              </button>
            </div>
            <button 
              onClick={toggleListen}
              className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest transition-all shadow-sm ${
                isListening 
                  ? "bg-red-50 border-2 border-red-200 text-red-600 shadow-red-100" 
                  : "bg-teal-50 border-2 border-teal-100 text-teal-700 hover:border-teal-200 shadow-teal-50"
              }`}
            >
              {isListening ? (
                <><MicOff size={16} className="animate-pulse" /> Stop Listening</>
              ) : (
                <><Mic size={16} /> Tap to Speak</>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
