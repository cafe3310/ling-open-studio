import { TechStackOption } from "./types";

export const techStacks: TechStackOption[] = [
  {
    id: "html-tailwind",
    name: "HTML + Tailwind",
    description_style: "Strictly use Tailwind CSS utility classes. Do not write custom CSS in <style> tags unless for font loading.",
    description_expander: "Structure the site as a single-page semantic HTML5 document. Use semantic sections like <header>, <main>, and <footer>.",
    boilerplate_code: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-white text-slate-900">
    <!-- Content injected here -->
    <script>
        lucide.createIcons();
    </script>
</body>
</html>
    `.trim()
  },
  {
    id: "react-tailwind",
    name: "React (Browser-side)",
    description_style: "Use Tailwind classes in the 'className' prop. Focus on functional component structure.",
    description_expander: "Design the page as a collection of React components. Use Lucide-react equivalent syntax for icons.",
    boilerplate_code: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;

        const App = () => {
            useEffect(() => {
                lucide.createIcons();
            }, []);

            return (
                <div className="min-h-screen bg-slate-50">
                    {/* Components injected here */}
                    <h1 className="p-10 text-4xl font-bold">Hello from React</h1>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
    `.trim()
  }
];
