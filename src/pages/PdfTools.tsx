import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  SplitSquareHorizontal, 
  Minimize2, 
  Presentation, 
  Table, 
  Edit3, 
  Image as ImageIcon, 
  PenTool, 
  Stamp, 
  RotateCw, 
  Globe, 
  Unlock, 
  Lock, 
  Layers, 
  Archive, 
  Wrench, 
  Hash, 
  Scan, 
  Search, 
  GitCompare, 
  ShieldAlert, 
  Crop, 
  Languages,
  Combine
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tools = [
  {
    title: "Merge PDF",
    description: "Combine PDFs in the order you want with the easiest PDF merger available.",
    icon: Combine,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/pdf-tools/merge"
  },
  {
    title: "Split PDF",
    description: "Separate one page or a whole set for easy conversion into independent PDF files.",
    icon: SplitSquareHorizontal,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/pdf-tools/split"
  },
  {
    title: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    icon: Minimize2,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/pdf-tools/compress"
  },
  {
    title: "PDF to Word",
    description: "Easily convert your PDF files into easy to edit DOC and DOCX documents.",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    href: "/pdf-tools/to-word"
  },
  {
    title: "PDF to PowerPoint",
    description: "Turn your PDF files into easy to edit PPT and PPTX slideshows.",
    icon: Presentation,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    href: "/pdf-tools/to-powerpoint"
  },
  {
    title: "PDF to Excel",
    description: "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.",
    icon: Table,
    color: "text-green-600",
    bgColor: "bg-green-600/10",
    href: "/pdf-tools/to-excel"
  },
  {
    title: "Word to PDF",
    description: "Make DOC and DOCX files easy to read by converting them to PDF.",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/pdf-tools/word-to-pdf"
  },
  {
    title: "PowerPoint to PDF",
    description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
    icon: FileText,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    href: "/pdf-tools/powerpoint-to-pdf"
  },
  {
    title: "Excel to PDF",
    description: "Make EXCEL spreadsheets easy to read by converting them to PDF.",
    icon: FileText,
    color: "text-green-600",
    bgColor: "bg-green-600/10",
    href: "/pdf-tools/excel-to-pdf"
  },
  {
    title: "Edit PDF",
    description: "Add text, images, shapes or freehand annotations to a PDF document.",
    icon: Edit3,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    href: "/pdf-tools/edit"
  },
  {
    title: "PDF to JPG",
    description: "Convert each PDF page into a JPG or extract all images contained in a PDF.",
    icon: ImageIcon,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    href: "/pdf-tools/to-jpg"
  },
  {
    title: "JPG to PDF",
    description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
    icon: FileText,
    color: "text-yellow-600",
    bgColor: "bg-yellow-600/10",
    href: "/pdf-tools/jpg-to-pdf"
  },
  {
    title: "Sign PDF",
    description: "Sign yourself or request electronic signatures from others.",
    icon: PenTool,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    href: "/pdf-tools/sign"
  },
  {
    title: "Watermark",
    description: "Stamp an image or text over your PDF in seconds.",
    icon: Stamp,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    href: "/pdf-tools/watermark"
  },
  {
    title: "Rotate PDF",
    description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
    icon: RotateCw,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    href: "/pdf-tools/rotate"
  },
  {
    title: "HTML to PDF",
    description: "Convert webpages in HTML to PDF. Copy and paste the URL of the page you want.",
    icon: Globe,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    href: "/pdf-tools/html-to-pdf"
  },
  {
    title: "Unlock PDF",
    description: "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
    icon: Unlock,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    href: "/pdf-tools/unlock"
  },
  {
    title: "Protect PDF",
    description: "Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.",
    icon: Lock,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    href: "/pdf-tools/protect"
  },
  {
    title: "Organize PDF",
    description: "Sort pages of your PDF file however you like. Delete or add PDF pages.",
    icon: Layers,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    href: "/pdf-tools/organize"
  },
  {
    title: "PDF to PDF/A",
    description: "Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving.",
    icon: Archive,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    href: "/pdf-tools/to-pdfa"
  },
  {
    title: "Repair PDF",
    description: "Repair a damaged PDF and recover data from corrupt PDF.",
    icon: Wrench,
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
    href: "/pdf-tools/repair"
  },
  {
    title: "Page numbers",
    description: "Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.",
    icon: Hash,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    href: "/pdf-tools/page-numbers"
  },
  {
    title: "Scan to PDF",
    description: "Capture document scans from your mobile device and send them instantly to your browser.",
    icon: Scan,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    href: "/pdf-tools/scan"
  },
  {
    title: "OCR PDF",
    description: "Easily convert scanned PDF into searchable and selectable documents.",
    icon: Search,
    color: "text-violet-600",
    bgColor: "bg-violet-600/10",
    href: "/pdf-tools/ocr"
  },
  {
    title: "Compare PDF",
    description: "Show a side-by-side document comparison and easily spot changes between different file versions.",
    icon: GitCompare,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    href: "/pdf-tools/compare"
  },
  {
    title: "Redact PDF",
    description: "Redact text and graphics to permanently remove sensitive information from a PDF.",
    icon: ShieldAlert,
    color: "text-red-600",
    bgColor: "bg-red-600/10",
    href: "/pdf-tools/redact"
  },
  {
    title: "Crop PDF",
    description: "Crop margins of PDF documents or select specific areas.",
    icon: Crop,
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500/10",
    href: "/pdf-tools/crop"
  },
  {
    title: "Translate PDF",
    description: "Easily translate PDF files powered by AI. Keep fonts, layout, and formatting perfectly intact.",
    icon: Languages,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    href: "/pdf-tools/translate"
  }
];

export function PdfTools() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">PDF Tools</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">
            Every tool you need to work with PDFs in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Link to={tool.href || "#"}>
                <Card className="h-full cursor-pointer hover:shadow-md transition-all duration-200 border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 overflow-hidden group">
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tool.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <tool.icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
