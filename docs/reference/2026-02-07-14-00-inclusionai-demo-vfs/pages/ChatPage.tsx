import React, { useState } from 'react';
import { PageContainer, Sidebar, MainContent, Card, Button, Input, SectionTitle, SubTitle, Select } from '../components/DesignSystem';
import { MessageSquarePlus, Trash2, Send, Cpu, Sliders, History } from 'lucide-react';
import { Message, ChatSession } from '../types';

const ChatPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am Ling-Nano. How can I assist you today with high efficiency?', timestamp: Date.now() }
  ]);
  
  const sessions: ChatSession[] = [
    { id: '1', title: 'React Performance Tuning', preview: 'How do I optimize useMemo...', updatedAt: Date.now() },
    { id: '2', title: 'Creative Writing Help', preview: 'Suggest a name for a dragon...', updatedAt: Date.now() - 86400000 },
    { id: '3', title: 'Data Analysis Scripts', preview: 'Python pandas tutorial...', updatedAt: Date.now() - 172800000 },
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now() };
    setMessages([...messages, newMessage]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've processed that request. This is a simulated response demonstrating the UI streaming capability. In a real integration, this would appear token by token.",
        timestamp: Date.now()
      }]);
    }, 1000);
  };

  return (
    <PageContainer>
      {/* Left Sidebar: History */}
      <Sidebar position="left" className="p-4 bg-brand-bg/50">
        <div className="flex items-center justify-between mb-6">
          <SectionTitle className="mb-0 text-xl">History</SectionTitle>
          <Button variant="ghost" size="sm" title="New Chat">
            <MessageSquarePlus className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {sessions.map(session => (
            <Card key={session.id} hoverEffect className="p-3 border-transparent hover:border-brand-border bg-transparent hover:bg-white group">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <h4 className="font-sans font-medium text-brand-dark text-sm truncate">{session.title}</h4>
                  <p className="text-xs text-brand-gray truncate mt-1">{session.preview}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-brand-gray hover:text-red-400 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </Sidebar>

      {/* Center: Chat Interface */}
      <MainContent className="bg-white">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[70%] rounded-2xl p-5 shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-brand-dark text-white border-transparent' 
                    : 'bg-white text-brand-dark border-brand-border'
                }`}
              >
                <p className="text-sm leading-relaxed font-sans">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 border-t border-brand-border bg-white/80 backdrop-blur">
          <div className="relative max-w-4xl mx-auto flex items-center gap-3">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message InclusionAI..."
              className="h-12 rounded-full pl-6 pr-12 shadow-sm border-brand-border focus:border-brand-blue"
            />
            <Button 
              variant="primary" 
              className="absolute right-1 top-1 bottom-1 rounded-full aspect-square p-0 w-10 h-10"
              onClick={handleSend}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-brand-gray uppercase tracking-widest">Powered by Ling-MoE</span>
          </div>
        </div>
      </MainContent>

      {/* Right Sidebar: Settings */}
      <Sidebar position="right" className="p-6 bg-brand-bg/30">
        <SectionTitle className="text-lg flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Model Config
        </SectionTitle>

        <div className="space-y-6 mt-4">
          <div>
            <SubTitle>Model Selection</SubTitle>
            <Select>
              <option>Ling-Nano (1.5B)</option>
              <option>Ling-Standard (7B)</option>
              <option>Ling-Large (70B)</option>
            </Select>
          </div>

          <div>
            <SubTitle>System Prompt</SubTitle>
            <textarea 
              className="w-full h-32 rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-blue resize-none font-sans"
              placeholder="You are a helpful assistant..."
              defaultValue="You are a helpful, harmless, and honest AI assistant created by InclusionAI."
            />
          </div>

          <div>
            <SubTitle>Temperature: 0.7</SubTitle>
            <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full accent-brand-blue h-1 bg-brand-border rounded-lg appearance-none cursor-pointer"/>
            <div className="flex justify-between text-xs text-brand-gray mt-1">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-brand-border">
            <div className="flex items-center gap-2 text-sm text-brand-dark mb-2 font-medium">
              <Cpu className="w-4 h-4 text-brand-cyan" />
              <span>Performance Stats</span>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-xs">
                 <span className="text-brand-gray">Latency</span>
                 <span className="font-mono">45ms</span>
               </div>
               <div className="flex justify-between text-xs">
                 <span className="text-brand-gray">Tokens/sec</span>
                 <span className="font-mono">128</span>
               </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </PageContainer>
  );
};

export default ChatPage;