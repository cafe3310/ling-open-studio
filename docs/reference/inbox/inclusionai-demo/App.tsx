import React, { useState } from 'react';
import { Tab, NavItem } from './types';
import { MessageSquare, Code, PenTool, Layout, Box } from 'lucide-react';
import ChatPage from './pages/ChatPage';
import WebPage from './pages/WebPage';
import WritePage from './pages/WritePage';
import DesignSystemPage from './pages/DesignSystemPage';
import { cn } from './components/DesignSystem';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DESIGN_SYSTEM);

  const navItems: NavItem[] = [
    { id: Tab.DESIGN_SYSTEM, label: 'Design System', icon: Layout },
    { id: Tab.MODEL_CHAT, label: 'Model Chat', icon: MessageSquare },
    { id: Tab.MODEL_WEB, label: 'Model Web', icon: Code },
    { id: Tab.MODEL_WRITE, label: 'Model Write', icon: PenTool },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case Tab.MODEL_CHAT:
        return <ChatPage />;
      case Tab.MODEL_WEB:
        return <WebPage />;
      case Tab.MODEL_WRITE:
        return <WritePage />;
      case Tab.DESIGN_SYSTEM:
      default:
        return <DesignSystemPage />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-brand-bg text-brand-dark font-sans selection:bg-brand-cyan/20">
      {/* Top Navigation */}
      <header className="h-16 bg-white border-b border-brand-border flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center text-white">
            <Box className="w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-lg tracking-tight">InclusionAI</span>
        </div>

        <nav className="flex items-center gap-1 bg-brand-bg/50 p-1 rounded-lg border border-brand-border/50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition-all duration-200",
                activeTab === item.id
                  ? "bg-white text-brand-dark shadow-sm font-medium"
                  : "text-brand-gray hover:text-brand-dark hover:bg-white/50"
              )}
            >
              <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-brand-blue" : "text-gray-400")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-brand-gray">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             System Operational
          </div>
          <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center font-serif text-sm">
            U
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;