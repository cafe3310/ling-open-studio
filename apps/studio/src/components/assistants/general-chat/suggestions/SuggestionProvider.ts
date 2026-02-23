export interface Suggestion {
  title: string;
  label: string;
  prompt: string;
}

const GENERAL_SUGGESTIONS = {
  '1T': [
    { title: "Deep Analysis", label: "Self-Attention in Transformer", prompt: "Please provide a deep dive into the working principles and mathematical implementation of the Self-Attention mechanism in the Transformer architecture." },
    { title: "Philosophical Inquiry", label: "Turing Test in 2026", prompt: "In the era of rapid AI evolution, do you believe the traditional Turing Test still holds significance as a benchmark for AI intelligence in 2026?" },
    { title: "Scientific Frontier", label: "Room-Temperature Superconductivity", prompt: "Summarize the latest experimental progress and core technical challenges facing the scientific community in the field of room-temperature superconductivity." },
    { title: "Historical Review", label: "Renaissance & Modern Science", prompt: "Discuss how the intellectual shifts during the European Renaissance laid the foundation for the birth of modern experimental science." },
  ],
  'Flash': [
    { title: "Quick Science", label: "How Black Holes Form", prompt: "Explain in simple terms how black holes are formed and why even light cannot escape their gravitational pull." },
    { title: "Life Wisdom", label: "Scientific Sleep Management", prompt: "Based on sleep cycle theory, please provide practical suggestions for scientifically managing sleep duration and quality." },
    { title: "Coding Basics", label: "Python Decorators", prompt: "Explain the basic syntax and common use cases of decorators in Python with simple examples." },
    { title: "European History", label: "The Magna Carta's Legacy", prompt: "Briefly explain the historical significance of the Magna Carta and its lasting impact on the development of modern constitutional law." },
  ],
  'Mini': [
    { title: "String Processing", label: "Email Regex Pattern", prompt: "Write a regular expression that matches a standard email format and explain what each part of the regex does." },
    { title: "Code Generation", label: "React Counter Component", prompt: "Please write a simple Counter component using React functional components and Hooks." },
    { title: "Translation Aide", label: "Academic English Polish", prompt: "Please translate the following sentence into natural, academic English: 'Artificial intelligence is reshaping the way humans interact with technology.'" },
    { title: "Format Conversion", label: "JSON to CSV Script", prompt: "Provide a simple Python script to convert a local 'data.json' file into a 'data.csv' format." },
  ],
};

const TOOL_SUGGESTIONS = {
  VFS: [
    { title: "File Creation", label: "Self-intro (see FS tab)", prompt: "Create 'about_me.md' with an AI intro via VFS." },
    { title: "List Files", label: "Current session only", prompt: "List files in the current directory via VFS." },
  ],
  JS: [
    { title: "Logical Operation", label: "Calculate Fibonacci Sequence", prompt: "Please use the JavaScript tool to calculate the Fibonacci sequence from 1 to 100." },
    { title: "Performance Benchmarking", label: "Sorting Algorithm Efficiency", prompt: "Use the JS environment to write and compare the execution efficiency of Bubble Sort and Quick Sort when processing 1000 random numbers." },
  ],
};

export function getSuggestions(modelId: string, enabledTools: string[]): Suggestion[] {
  // Determine base pool
  let basePool = GENERAL_SUGGESTIONS.Flash;
  if (modelId.includes('1T')) {
    basePool = GENERAL_SUGGESTIONS['1T'];
  } else if (modelId.toLowerCase().includes('mini')) {
    basePool = GENERAL_SUGGESTIONS.Mini;
  }

  const isVfsEnabled = enabledTools.includes('vfs');
  const isJsEnabled = enabledTools.includes('js');

  let result = [...basePool];

  // Logic: 
  // 1. If VFS enabled, replace last 2
  // 2. If JS enabled, replace remaining last 2 (either general or base)
  
  if (isVfsEnabled && isJsEnabled) {
    // JS 1, JS 2, VFS 1, VFS 2
    return [...TOOL_SUGGESTIONS.JS, ...TOOL_SUGGESTIONS.VFS];
  }

  if (isVfsEnabled) {
    // General 1, General 2, VFS 1, VFS 2
    return [result[0], result[1], ...TOOL_SUGGESTIONS.VFS];
  }

  if (isJsEnabled) {
    // General 1, General 2, JS 1, JS 2
    return [result[0], result[1], ...TOOL_SUGGESTIONS.JS];
  }

  return result;
}
