import React, { useState } from 'react';
import { PageContainer, Sidebar, MainContent, Card, Button, SectionTitle, SubTitle } from '../components/DesignSystem';
import { BookOpen, Sparkles, Feather, PenTool, Lightbulb } from 'lucide-react';
import { InspirationCard, StoryMetadata } from '../types';

const WritePage: React.FC = () => {
  const [content, setContent] = useState(`The rain had not stopped for three days. It drummed against the stained glass windows of the library, a rhythmic accompaniment to the silence that filled the room. 

Elara traced the spine of the ancient tome. "They say the ink never dries," she whispered, though there was no one to hear her. The candle flickered, casting long, dancing shadows against the shelves.`);

  const metadata: StoryMetadata = {
    title: "The Ink of Tomorrow",
    summary: "A young archivist discovers a book that writes history before it happens.",
    world: "Victorian London with subtle magic.",
    characters: ["Elara", "The Shadow Binder", "Sir Arthur"],
  };

  const inspirations: InspirationCard[] = [
    { id: '1', type: 'plot', title: 'Plot Twist', content: 'The book suddenly slams shut on its own, trapping her finger.' },
    { id: '2', type: 'description', title: 'Atmosphere', content: 'The smell of ozone and old paper filled the air, sharp and metallic.' },
    { id: '3', type: 'dialogue', title: 'Character', content: '"You shouldn\'t be reading that," a voice echoed from the dark corner.' },
  ];

  const handleInsert = (text: string) => {
    setContent(prev => prev + "\n\n" + text);
  };

  return (
    <PageContainer>
      {/* Left: Context */}
      <Sidebar position="left" className="p-6 bg-brand-bg/30 w-72">
        <SectionTitle className="text-xl font-serif italic mb-6">{metadata.title}</SectionTitle>
        
        <div className="space-y-6">
          <div>
            <SubTitle>Summary</SubTitle>
            <p className="text-sm text-brand-gray leading-relaxed">{metadata.summary}</p>
          </div>
          
          <div>
            <SubTitle>World Settings</SubTitle>
            <div className="flex flex-wrap gap-2">
               <span className="px-2 py-1 bg-white border border-brand-border rounded text-xs text-brand-dark">Victorian</span>
               <span className="px-2 py-1 bg-white border border-brand-border rounded text-xs text-brand-dark">Low Magic</span>
            </div>
          </div>

          <div>
             <SubTitle>Characters</SubTitle>
             <ul className="text-sm text-brand-dark space-y-1">
                {metadata.characters.map(c => (
                  <li key={c} className="flex items-center gap-2">
                    {/* Updated to Slate */}
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-slate"></div>
                    {c}
                  </li>
                ))}
             </ul>
          </div>

          <div className="pt-6 border-t border-brand-border">
             <Button className="w-full mb-2" variant="secondary">
                <Feather className="w-4 h-4" />
                Generate Next Paragraph
             </Button>
             <Button className="w-full" variant="ghost">
                Auto-Complete Chapter
             </Button>
          </div>
        </div>
      </Sidebar>

      {/* Middle: Editor */}
      <MainContent className="bg-white">
        <div className="max-w-3xl mx-auto w-full h-full p-12 overflow-y-auto">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full resize-none outline-none font-serif text-lg leading-loose text-brand-dark placeholder:text-gray-300 selection:bg-brand-slate/20"
            placeholder="Once upon a time..."
          />
        </div>
        {/* Floating AI Helper */}
        <div className="absolute bottom-8 right-8">
           <Button variant="primary" className="rounded-full shadow-lg px-4 py-3 bg-gradient-accent border-none text-white">
              <Sparkles className="w-5 h-5" />
              <span className="ml-2">AI Assist</span>
           </Button>
        </div>
      </MainContent>

      {/* Right: Insights */}
      <Sidebar position="right" className="p-4 bg-brand-bg/50 w-80">
        <div className="flex items-center justify-between mb-6">
           <SectionTitle className="text-lg mb-0">Inspiration</SectionTitle>
           <div className="animate-pulse w-2 h-2 rounded-full bg-green-400" title="Live Analysis Active"></div>
        </div>

        <div className="space-y-4">
           {inspirations.map((card) => (
             <Card 
               key={card.id} 
               hoverEffect 
               className="cursor-pointer border-brand-slate/20 hover:border-brand-slate"
               onClick={() => handleInsert(card.content)}
             >
                <div className="flex items-center gap-2 mb-2">
                   {card.type === 'plot' && <BookOpen className="w-3 h-3 text-brand-blue" />}
                   {/* Updated to Slate */}
                   {card.type === 'description' && <PenTool className="w-3 h-3 text-brand-slate" />}
                   {card.type === 'dialogue' && <Lightbulb className="w-3 h-3 text-brand-cyan" />}
                   <span className="text-xs font-bold uppercase text-brand-gray tracking-wide">{card.type}</span>
                </div>
                <h4 className="font-serif font-medium text-brand-dark mb-1">{card.title}</h4>
                <p className="text-sm text-brand-gray italic">"{card.content}"</p>
                <div className="mt-2 text-xs text-brand-slate opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                   <Sparkles className="w-3 h-3" />
                   Click to insert
                </div>
             </Card>
           ))}
        </div>

        <div className="mt-8">
           <SubTitle>Detected Concepts</SubTitle>
           <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs border border-brand-border bg-white px-2 py-1 rounded text-gray-500">Library</span>
              <span className="text-xs border border-brand-border bg-white px-2 py-1 rounded text-gray-500">Ancient Tome</span>
              <span className="text-xs border border-brand-border bg-white px-2 py-1 rounded text-gray-500">Rain</span>
           </div>
        </div>
      </Sidebar>
    </PageContainer>
  );
};

export default WritePage;