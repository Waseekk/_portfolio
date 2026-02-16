"use client";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectContext, setProjectContext] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Ask me about Irtefa's projects, skills, or resume." }
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-open chatbot when user scrolls to Experience section
  useEffect(() => {
    if (autoOpened) return;
    const el = document.getElementById("experience");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setOpen(true);
            setAutoOpened(true);
          }, 1500);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoOpened]);

  // Handle "Ask Me About This Project" event from ProjectModal
  useEffect(() => {
    function onSuggest(e: CustomEvent<{ project: string }>) {
      const project = e.detail?.project;
      if (!project) return;

      // Determine project context key for API
      const contextKey = getProjectContextKey(project);
      setProjectContext(contextKey);
      setOpen(true);

      // Add context-aware greeting
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `I see you're interested in ${project}! What would you like to know about it?` }
      ]);
    }

    window.addEventListener("chat:suggest", onSuggest as EventListener);
    return () => window.removeEventListener("chat:suggest", onSuggest as EventListener);
  }, []);

  // Map project name to context key for API
  function getProjectContextKey(projectName: string): string {
    const nameLower = projectName.toLowerCase();
    if (nameLower.includes("swiftor") || nameLower.includes("newspaper") || nameLower.includes("sub assistant")) {
      return "swiftor";
    }
    if (nameLower.includes("research bot") || nameLower.includes("multi-tool")) {
      return "research-bot";
    }
    if (nameLower.includes("license plate") || nameLower.includes("ar ")) {
      return "license-plate";
    }
    return projectName.toLowerCase().replace(/\s+/g, "-");
  }

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");

    const userMessage: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Get last 5 exchanges (10 messages) for history, excluding the initial greeting
      const historyMessages = messages.slice(1); // Skip initial greeting
      const recentHistory = historyMessages.slice(-10);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          history: recentHistory,
          projectContext: projectContext
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.answer || "..." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Error reaching the chat API. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    // Clear project context when closing chat
    setProjectContext(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 btn btn-primary rounded-full shadow-lg"
        >
          <MessageCircle className="w-5 h-5" /> Chat
        </button>
      )}
      {open && (
        <div className="fixed bottom-5 right-5 w-[92vw] max-w-sm card">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Ask Irtefa's Portfolio</h4>
            <button
              className="btn btn-ghost"
              onClick={handleClose}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 h-64 overflow-y-auto space-y-2 pr-1">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block px-3 py-2 rounded-2xl ${
                    m.role === "user"
                      ? "bg-accent text-black"
                      : "bg-[#121821] border border-[#1b2330]"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && <div className="text-sm text-muted">Thinking...</div>}
            <div ref={endRef} />
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about my work..."
              className="flex-1 rounded-xl border border-[#2a3340] bg-transparent px-3 py-2 outline-none"
            />
            <button onClick={send} className="btn btn-primary" disabled={loading}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
