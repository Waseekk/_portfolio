
"use client";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Ask me about Irtefa’s projects, skills, or résumé." }
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  function onSuggest(e: any) {
    const project = e.detail?.project as string;
    setOpen(true);
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: `Hey, wanna talk about ${project}?` }
    ]);
  }
  window.addEventListener("chat:suggest", onSuggest as any);
  return () => window.removeEventListener("chat:suggest", onSuggest as any);
}, []);


  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: text }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.answer || "…" }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error reaching the chat API. Check your env key or logs." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 btn btn-primary rounded-full shadow-lg">
          <MessageCircle className="w-5 h-5" /> Chat
        </button>
      )}
      {open && (
        <div className="fixed bottom-5 right-5 w-[92vw] max-w-sm card">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Ask Irtefa’s Portfolio</h4>
            <button className="btn btn-ghost" onClick={() => setOpen(false)} aria-label="Close"><X className="w-4 h-4" /></button>
          </div>
          <div className="mt-3 h-64 overflow-y-auto space-y-2 pr-1">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <span className={`inline-block px-3 py-2 rounded-2xl ${m.role === "user" ? "bg-accent text-black" : "bg-[#121821] border border-[#1b2330]"}`}>{m.content}</span>
              </div>
            ))}
            {loading && <div className="text-sm text-muted">Thinking…</div>}
            <div ref={endRef} />
          </div>
          <div className="mt-3 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" ? send() : null}
              placeholder="Ask about my work…" className="flex-1 rounded-xl border border-[#2a3340] bg-transparent px-3 py-2 outline-none" />
            <button onClick={send} className="btn btn-primary"><Send className="w-4 h-4" /></button>
          </div>
          <p className="text-xs text-muted mt-2">Powered by your OpenAI key via a simple API route.</p>
        </div>
      )}
    </>
  );
}
