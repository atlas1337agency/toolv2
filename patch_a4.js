const fs = require('fs');
const files = [
  'src/pages/ResumeGenerator.tsx',
  'src/pages/InvoiceGenerator.tsx',
  'src/pages/FactureGenerator.tsx',
  'src/pages/DocumentGenerator.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Replace A4PreviewWrapper
  const wrapperRegex = /const A4PreviewWrapper = \({ children }: { children: React\.ReactNode }\) => \{[\s\S]*?return \([\s\S]*?\);\n\};/;
  
  const newWrapper = `const A4PreviewWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full bg-white dark:bg-zinc-950 overflow-y-auto overflow-x-hidden flex-1">
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
};`;

  content = content.replace(wrapperRegex, newWrapper);
  
  // Also remove padding from the preview area container if it exists
  content = content.replace(/className={cn\("h-full w-full bg-zinc-100 p-4 lg:p-6 /g, 'className={cn("h-full w-full bg-zinc-100 ');

  fs.writeFileSync(file, content);
}
