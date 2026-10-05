const fs = require('fs');
const files = [
  'src/pages/ResumeGenerator.tsx',
  'src/pages/InvoiceGenerator.tsx',
  'src/pages/FactureGenerator.tsx',
  'src/pages/DocumentGenerator.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Replace outer container
  content = content.replace(
    /className="w-full h-full text-\[\#333\] text-\[(\d+)px\] leading-\[1\.6\] font-sans overflow-hidden/g,
    'className="w-full min-h-full text-[#333] text-[$1px] leading-[1.6] font-sans'
  );

  // Resume Generator lacks bg-white on the outer container, let's just make sure it's removed overflow-hidden and h-full
  content = content.replace(
    /className="w-full h-full text-\[\#333\] text-\[12px\] leading-\[1\.6\] font-sans overflow-hidden"/g,
    'className="w-full min-h-full text-[#333] text-[12px] leading-[1.6] font-sans bg-white"'
  );

  // Replace inner container
  content = content.replace(
    /className="w-full h-full overflow-hidden p-8 md:p-12 flex flex-col"/g,
    'className="w-full min-h-full p-4 sm:p-6 md:p-12 flex flex-col"'
  );
  content = content.replace(
    /className="w-full h-full overflow-hidden p-8 md:p-12"/g,
    'className="w-full min-h-full p-4 sm:p-6 md:p-12"'
  );

  fs.writeFileSync(file, content);
}
