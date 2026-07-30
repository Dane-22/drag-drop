import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I am your Site Allocation Assistant. How can I help with worker scheduling or site logistics today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = input.trim().toLowerCase();
    setInput('');

    // Generate smart assistant responses based on user query
    setTimeout(() => {
      let replyText = "I've logged your query. You can drag and drop worker cards directly onto any site day cell in the main board!";
      if (query.includes('conflict') || query.includes('double')) {
        replyText = "The system automatically enforces double-booking prevention! If a worker is already assigned to a site on a specific day, dragging them to another site will trigger a conflict warning.";
      } else if (query.includes('site') || query.includes('add')) {
        replyText = "To add a new construction site, click 'Site 4: [Add Site]' or the '+ Add New Site' button at the top of the grid.";
      } else if (query.includes('worker') || query.includes('hire')) {
        replyText = "You can add new workers using the workforce icon on the bottom floating toolbar!";
      }

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Orange Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-6 w-12 h-12 rounded-full bg-gradient-to-tr from-brandOrange-600 to-brandOrange-500 text-white shadow-xl shadow-brandOrange-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
        title="Open Allocation Assistant Chat"
      >
        <MessageSquare className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-[#162740] border border-[#2a4773] rounded-2xl shadow-2xl z-50 flex flex-col h-[450px] overflow-hidden select-none animate-fadeIn">
          {/* Header */}
          <div className="p-3.5 border-b border-[#21385c] bg-[#192c48] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brandOrange-500/20 flex items-center justify-center text-brandOrange-500">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Allocation Assistant</h4>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-[10px] text-slate-400">Online & Ready</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-[#253e66] rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0f1b2d]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-brandOrange-500/20 text-brandOrange-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[80%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brandOrange-500 text-white rounded-br-none'
                      : 'bg-[#1b2d48] border border-[#2a4773] text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] opacity-70 block text-right mt-1">{msg.timestamp}</span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#21385c] bg-[#192c48] flex gap-2">
            <input
              type="text"
              placeholder="Ask assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#0f1b2d] border border-[#2a4773] rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brandOrange-500"
            />
            <button
              type="submit"
              className="p-2 bg-brandOrange-500 hover:bg-brandOrange-600 text-white rounded-xl transition-colors shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
