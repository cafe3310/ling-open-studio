import React, { useState } from 'react';
import { PageContainer, Sidebar, MainContent, Card, Button, TextArea, SectionTitle, SubTitle, Select } from '../components/DesignSystem';
import { Code2, Smartphone, Monitor, Play, RefreshCw, LayoutTemplate } from 'lucide-react';

const WebPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <PageContainer>
      {/* Left: Instruction Chat */}
      <Sidebar position="left" className="p-4 w-80 bg-white">
        <SectionTitle className="text-lg mb-6">Generator</SectionTitle>

        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-4 overflow-y-auto mb-4">
             {/* Mock Chat History */}
             <div className="bg-brand-bg p-3 rounded-lg border border-brand-border">
                <p className="text-xs text-brand-gray font-bold mb-1 uppercase">User</p>
                <p className="text-sm text-brand-dark">Create a landing page for a coffee shop with a hero section and a menu grid.</p>
             </div>
             <div className="bg-white p-3 rounded-lg border border-brand-cyan/30 shadow-sm">
                <p className="text-xs text-brand-cyan font-bold mb-1 uppercase">Model</p>
                <p className="text-sm text-brand-dark">Generating layout structure...</p>
                <div className="mt-2 text-xs font-mono text-brand-gray bg-brand-bg p-2 rounded">
                   {`<Header />`}<br/>{`<HeroSection />`}<br/>{`<MenuGrid />`}
                </div>
             </div>
          </div>

          <div className="mt-auto pt-4 border-t border-brand-border bg-white">
            <TextArea placeholder="Describe the UI you want to build..." className="h-24 mb-3" />
            <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isGenerating ? 'Coding...' : 'Generate UI'}
            </Button>
          </div>
        </div>
      </Sidebar>

      {/* Middle: Preview */}
      <MainContent className="bg-brand-bg relative flex items-center justify-center p-8">
        {/* Toolbar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-sm border border-brand-border p-1 flex gap-1 z-20">
          <Button
            variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('desktop')}
            className={viewMode === 'desktop' ? 'bg-brand-bg' : ''}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('mobile')}
            className={viewMode === 'mobile' ? 'bg-brand-bg' : ''}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        {/* Preview Container */}
        <div
          className={`transition-all duration-500 bg-white shadow-lg border border-brand-border overflow-hidden relative ${
            viewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-[30px]' : 'w-full h-full rounded-xl'
          }`}
        >
          {/* Mock Generated Content */}
          <div className="w-full h-full flex flex-col font-sans">
            <nav className="p-4 border-b flex justify-between items-center">
              <span className="font-serif font-bold text-xl">Bean & Leaf</span>
              <div className="space-x-4 text-sm hidden sm:block">
                <span>Menu</span>
                <span>Locations</span>
                <span className="font-bold text-orange-600">Order Now</span>
              </div>
            </nav>
            <div className="bg-stone-100 flex-1 flex flex-col items-center justify-center text-center p-8">
              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-stone-800 mb-6">Morning Rituals</h1>
              <p className="max-w-md text-stone-600 mb-8">Artisanal coffee sourced directly from farmers, roasted to perfection in downtown.</p>
              <button className="bg-stone-800 text-white px-8 py-3 rounded-full hover:bg-stone-700 transition">View Menu</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
               {[1,2,3].map(i => (
                 <div key={i} className="aspect-square bg-stone-200 rounded-lg animate-pulse"></div>
               ))}
            </div>
          </div>

          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
               <div className="flex flex-col items-center gap-3">
                 <div className="w-8 h-8 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
                 <span className="font-serif italic text-brand-dark">Refining pixels...</span>
               </div>
            </div>
          )}
        </div>
      </MainContent>

      {/* Right: Config */}
      <Sidebar position="right" className="p-6 w-72 bg-white border-l">
        <SectionTitle className="text-lg flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5" />
          Styles
        </SectionTitle>

        <div className="space-y-8 mt-6">
          <div>
            <SubTitle>Design Aesthetic</SubTitle>
            <div className="grid grid-cols-2 gap-2">
              {['Minimal', 'Modern', 'Skeuomorphic', 'Warm'].map(style => (
                <button key={style} className="text-xs border border-brand-border rounded px-3 py-2 text-brand-gray hover:border-brand-cyan hover:text-brand-cyan transition-colors text-left">
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SubTitle>Tech Stack</SubTitle>
            <Select>
              <option>HTML + Tailwind</option>
              <option>React + Shadcn UI</option>
              <option>Vue + UnoCSS</option>
            </Select>
          </div>

          <div>
             <SubTitle>Advanced</SubTitle>
             <div className="flex items-center justify-between text-sm py-2 border-b border-brand-border">
               <span className="text-brand-dark">Dark Mode Support</span>
               <input type="checkbox" className="accent-brand-cyan" />
             </div>
             <div className="flex items-center justify-between text-sm py-2 border-b border-brand-border">
               <span className="text-brand-dark">Animations</span>
               <input type="checkbox" defaultChecked className="accent-brand-cyan" />
             </div>
          </div>
        </div>
      </Sidebar>
    </PageContainer>
  );
};

export default WebPage;
