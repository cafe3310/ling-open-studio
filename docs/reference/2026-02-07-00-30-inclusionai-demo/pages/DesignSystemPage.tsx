import React from 'react';
import { Button, Card, Input, SectionTitle, SubTitle, Select } from '../components/DesignSystem';
import { Palette, Type, Box, Activity, AlertCircle } from 'lucide-react';

const DesignSystemPage: React.FC = () => {
  return (
    <div className="p-12 overflow-y-auto h-full bg-brand-bg">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-5xl font-bold text-brand-dark">InclusionAI Design System</h1>
          <p className="text-brand-gray max-w-2xl mx-auto">
            A visual language built on airy whitespace, precise typography, and a sustainable "Open Intelligence" palette. 
            Designed to feel capable and transparent.
          </p>
        </div>

        {/* Colors */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-brand-border pb-2">
            <Palette className="w-5 h-5 text-brand-blue" />
            <SectionTitle className="mb-0">Color Palette</SectionTitle>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="flex flex-col gap-2">
              <div className="h-16 w-full rounded-md bg-brand-bg border border-brand-border"></div>
              <div>
                <p className="font-bold text-sm">Ice Gray (BG)</p>
                <p className="font-mono text-xs text-gray-400">#F8F9FB</p>
              </div>
            </Card>
            <Card className="flex flex-col gap-2">
              <div className="h-16 w-full rounded-md bg-brand-dark"></div>
              <div>
                <p className="font-bold text-sm">Brand Dark</p>
                <p className="font-mono text-xs text-gray-400">#1A1A1A</p>
              </div>
            </Card>
            <Card className="flex flex-col gap-2">
              <div className="h-16 w-full rounded-md bg-brand-blue"></div>
              <div>
                <p className="font-bold text-sm">Action Blue</p>
                <p className="font-mono text-xs text-gray-400">#3b82f6</p>
              </div>
            </Card>
            <Card className="flex flex-col gap-2">
              <div className="h-16 w-full rounded-md bg-brand-cyan"></div>
              <div>
                <p className="font-bold text-sm">Tech Cyan</p>
                <p className="font-mono text-xs text-gray-400">#06b6d4</p>
              </div>
            </Card>
            <Card className="flex flex-col gap-2">
              <div className="h-16 w-full rounded-md bg-brand-slate"></div>
              <div>
                <p className="font-bold text-sm">Slate (Insight)</p>
                <p className="font-mono text-xs text-gray-400">#5C8D9E</p>
              </div>
            </Card>
            <Card className="flex flex-col gap-2">
              <div className="h-16 w-full rounded-md bg-brand-error"></div>
              <div>
                <p className="font-bold text-sm">Error / Warning</p>
                <p className="font-mono text-xs text-gray-400">#D44C66</p>
              </div>
            </Card>
             <Card className="flex flex-col gap-2 md:col-span-2">
              <div className="h-16 w-full rounded-md bg-gradient-accent"></div>
              <div>
                <p className="font-bold text-sm">Primary Gradient</p>
                <p className="font-mono text-xs text-gray-400">Cyan to Blue</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-brand-border pb-2">
            <Type className="w-5 h-5 text-brand-blue" />
            <SectionTitle className="mb-0">Typography</SectionTitle>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <SubTitle>Serif (Headings)</SubTitle>
               <h1 className="font-serif text-4xl">The quick brown fox jumps over the lazy dog.</h1>
               <h2 className="font-serif text-2xl">Visual Intelligence & Data.</h2>
               <p className="text-sm text-brand-gray">Font Family: Playfair Display</p>
            </div>
            <div className="space-y-4">
               <SubTitle>Sans (Body / UI)</SubTitle>
               <p className="font-sans text-base">The quick brown fox jumps over the lazy dog.</p>
               <p className="font-sans text-sm text-brand-gray">Used for body text, inputs, and dense information display.</p>
               <p className="text-sm text-brand-gray">Font Family: Inter</p>
            </div>
          </div>
        </section>

        {/* Components */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-brand-border pb-2">
            <Box className="w-5 h-5 text-brand-blue" />
            <SectionTitle className="mb-0">Core Components</SectionTitle>
          </div>
          
          <div className="space-y-8">
            {/* Buttons */}
            <div>
              <SubTitle className="mb-4">Buttons</SubTitle>
              <div className="flex flex-wrap gap-4 items-center p-6 bg-white rounded-xl border border-brand-border">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="icon"><Activity className="w-5 h-5" /></Button>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <SubTitle className="mb-4">Form Elements</SubTitle>
              <div className="grid max-w-xl gap-4 p-6 bg-white rounded-xl border border-brand-border">
                <Input placeholder="Standard Input field..." />
                <Select>
                  <option>Select Dropdown Option 1</option>
                  <option>Select Dropdown Option 2</option>
                </Select>
                <div className="flex items-center gap-2 text-brand-error text-sm">
                   <AlertCircle className="w-4 h-4" />
                   <span>Example error state using #D44C66</span>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div>
               <SubTitle className="mb-4">Cards (Hover to see effect)</SubTitle>
               <div className="grid md:grid-cols-3 gap-6">
                 <Card hoverEffect>
                    <SectionTitle className="text-lg">Standard Card</SectionTitle>
                    <p className="text-brand-gray text-sm">A basic container for content with the signature thin border.</p>
                 </Card>
                 <Card hoverEffect className="border-brand-slate/20">
                    <SectionTitle className="text-lg">Insight Highlight</SectionTitle>
                    <p className="text-brand-gray text-sm">Using the new Slate color for subtle emphasis.</p>
                 </Card>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemPage;