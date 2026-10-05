import React, { useState, useRef, useEffect } from 'react';
import { Download, Settings2, FileImage, FileText, File } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng, toSvg } from 'html-to-image';

const PAPER_TYPES = [
  { value: 'lined', label: 'Lined Paper' },
  { value: 'vertical_lined', label: 'Vertical Lined Paper' },
  { value: 'grid', label: 'Grid Paper' },
  { value: 'dot', label: 'Dot Paper' },
  { value: 'pink_millimeter_grid', label: 'Pink Millimeter Grid' },
  { value: 'grid_lined_split', label: 'Split-column note paper' },
  { value: 'blank', label: 'Blank Paper' },
  { value: 'music', label: 'Music Paper' },
  { value: 'guitar_tab', label: 'Guitar Tab' },
  { value: 'ukulele_staff_tab', label: 'Staff + Ukulele TAB' },
  { value: 'calligraphy', label: 'Calligraphy Paper' },
  { value: 'cornell', label: 'Cornell Notes' },
  { value: 'isometric', label: 'Isometric Grid' },
  { value: 'hexagonal', label: 'Hexagonal Grid' },
  { value: 'seyes', label: 'Seyes Grid' },
  { value: 'storyboard', label: 'Storyboard' },
  { value: 'pinyin_paper', label: 'Pinyin Practice Paper', group: 'Chinese Homework Papers' },
  { value: 'pinyin_tianzi', label: 'Pinyin Tianzi Grid', group: 'Chinese Homework Papers' },
  { value: 'composition_paper', label: 'Composition Paper', group: 'Chinese Homework Papers' },
  { value: 'arithmetic_paper', label: 'Arithmetic Paper', group: 'Chinese Homework Papers' },
  { value: 'english_paper', label: 'English Practice Paper', group: 'Chinese Homework Papers' },
  { value: 'german_primary', label: 'German Three-Line Practice Paper', group: 'Chinese Homework Papers' },
  { value: 'german_primary_bordered', label: 'German Three-Line (with border)', group: 'Chinese Homework Papers' },
  { value: 'brazilian_calligraphy', label: 'Brazilian Calligraphy (Caderno de Caligrafia)', group: 'Chinese Homework Papers' },
  { value: 'practice_paper', label: 'Practice Paper', group: 'Chinese Homework Papers' },
  { value: 'mizige', label: 'Mi Zi Ge', group: 'Calligraphy Practice Papers' },
  { value: 'huigongge', label: 'Hui Gong Ge', group: 'Calligraphy Practice Papers' },
  { value: 'jiugongge', label: 'Jiu Gong Ge', group: 'Calligraphy Practice Papers' },
  { value: 'chinesetianzi', label: 'Chinese Tianzi Grid', group: 'Calligraphy Practice Papers' },
  { value: 'crossgrid', label: 'Cross Grid', group: 'Calligraphy Practice Papers' },
  { value: 'hardpen_huigongge', label: 'Hardpen Hui Gong Ge', group: 'Calligraphy Practice Papers' },
  { value: 'vintage_note', label: 'Vintage Note', group: 'New Papers' },
  { value: 'children_drawing', label: 'Children Drawing', group: 'New Papers' },
  { value: 'minimal_journal', label: 'Minimal Journal', group: 'New Papers' },
  { value: 'student_note', label: 'Student Note', group: 'New Papers' },
  { value: 'meeting_note', label: 'Meeting Note', group: 'New Papers' },
  { value: 'project_planning', label: 'Project Planning', group: 'New Papers' },
  { value: 'sketch', label: 'Sketch Paper', group: 'New Papers' },
  { value: 'creative_log', label: 'Creative Log', group: 'New Papers' },
  { value: 'branded', label: 'Branded Paper', group: 'New Papers' },
  { value: 'error_correction', label: 'Error Correction', group: 'New Papers' },
  { value: 'chinese_preview_card', label: 'Chinese Preview Card', group: 'New Papers' },
  { value: 'chinese_english_word_practice', label: 'Chinese-English Word Practice', group: 'New Papers' },
];

const PAPER_SIZES = [
  { value: 'a4', label: 'A4 (210 × 297 mm)', width: 210, height: 297 },
  { value: 'a5', label: 'A5 (148 × 210 mm)', width: 148, height: 210 },
  { value: 'a3', label: 'A3 (297 × 420 mm)', width: 297, height: 420 },
  { value: 'b4', label: 'B4 (250 × 353 mm)', width: 250, height: 353 },
  { value: 'b5', label: 'B5 (176 × 250 mm)', width: 176, height: 250 },
  { value: 'letter', label: 'Letter (8.5 × 11 in)', width: 215.9, height: 279.4 },
  { value: 'legal', label: 'Legal (8.5 × 14 in)', width: 215.9, height: 355.6 },
  { value: 'tabloid', label: 'Tabloid (11 × 17 in)', width: 279.4, height: 431.8 },
  { value: 'executive', label: 'Executive (7.25 × 10.5 in)', width: 184.15, height: 266.7 },
  { value: 'custom', label: 'Custom Size', width: 210, height: 297 },
];

const THEMES = [
  { value: 'default', label: 'Default Theme', bg: '#ffffff', line: '#d1d5db' },
  { value: 'night', label: 'Night Theme', bg: '#18181b', line: '#3f3f46' },
  { value: 'sepia', label: 'Sepia', bg: '#fef3c7', line: '#d97706' },
  { value: 'vintage', label: 'Vintage', bg: '#fdf6e3', line: '#93a1a1' },
  { value: 'pastel', label: 'Pastel', bg: '#f0fdf4', line: '#86efac' },
  { value: 'classic', label: 'Classic', bg: '#f8fafc', line: '#94a3b8' },
  { value: 'minimalist', label: 'Minimalist', bg: '#ffffff', line: '#e5e7eb' },
  { value: 'ocean', label: 'Ocean', bg: '#f0f9ff', line: '#7dd3fc' },
  { value: 'forest', label: 'Forest', bg: '#f0fdf4', line: '#86efac' },
  { value: 'sunset', label: 'Sunset', bg: '#fff7ed', line: '#fdba74' },
  { value: 'tech', label: 'Tech', bg: '#0f172a', line: '#334155' },
  { value: 'elegant', label: 'Elegant', bg: '#fafaf9', line: '#d6d3d1' },
  { value: 'creative', label: 'Creative', bg: '#fdf4ff', line: '#f0abfc' },
];

export function PaperMe() {
  const [paperType, setPaperType] = useState('lined');
  const [paperSize, setPaperSize] = useState('a4');
  const [customWidth, setCustomWidth] = useState(210);
  const [customHeight, setCustomHeight] = useState(297);
  const [theme, setTheme] = useState('default');
  const [lineColor, setLineColor] = useState('#d1d5db');
  const [lineStyle, setLineStyle] = useState('solid');
  const [lineSpacing, setLineSpacing] = useState(8);
  const [lineWidth, setLineWidth] = useState(0.5);
  const [margins, setMargins] = useState(20);
  const [enableSidebar, setEnableSidebar] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [watermark, setWatermark] = useState('');
  const [pageCount, setPageCount] = useState(1);
  const [showPageNumber, setShowPageNumber] = useState(false);
  const [startPageNumber, setStartPageNumber] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [marginLinePosition, setMarginLinePosition] = useState('left');
  const [marginLineWidth, setMarginLineWidth] = useState(1.5);
  const [marginLineColor, setMarginLineColor] = useState('#ef4444');
  const [marginLineStyle, setMarginLineStyle] = useState('solid');

  const [bgPattern, setBgPattern] = useState('none');
  const [bgCustomImage, setBgCustomImage] = useState('');

  const [enableWatermark, setEnableWatermark] = useState(false);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.15);
  const [watermarkAngle, setWatermarkAngle] = useState(-45);
  const [watermarkFontSize, setWatermarkFontSize] = useState(40);
  const [watermarkColor, setWatermarkColor] = useState('#000000');

  const [enableLogo, setEnableLogo] = useState(false);
  const [logoImage, setLogoImage] = useState('');
  const [logoPosition, setLogoPosition] = useState('top-left');
  const [logoSize, setLogoSize] = useState(20);
  const [logoOpacity, setLogoOpacity] = useState(1);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgCustomImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle theme change
  useEffect(() => {
    const selectedTheme = THEMES.find(t => t.value === theme);
    if (selectedTheme) {
      setBgColor(selectedTheme.bg);
      setLineColor(selectedTheme.line);
    }
  }, [theme]);

  const currentSize = paperSize === 'custom' 
    ? { width: customWidth, height: customHeight }
    : PAPER_SIZES.find(s => s.value === paperSize) || PAPER_SIZES[0];

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    
    setIsGeneratingPDF(true);
    // Wait for state to update and re-render without SVG page numbers
    await new Promise(resolve => setTimeout(resolve, 100));

    const pdf = new jsPDF({
      orientation: currentSize.width > currentSize.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [currentSize.width, currentSize.height]
    });

    try {
      const dataUrl = await toPng(previewRef.current, { quality: 1, pixelRatio: 2 });
      
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, 0, currentSize.width, currentSize.height);
        
        if (showPageNumber) {
          pdf.setFontSize(10);
          pdf.setTextColor(150);
          pdf.text(`${startPageNumber + i}`, currentSize.width / 2, currentSize.height - 10, { align: 'center' });
        }
      }
      
      pdf.save(`paper_${paperType}.pdf`);
    } catch (err) {
      console.error('Error generating PDF', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPNG = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `paper_${paperType}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating PNG', err);
    }
  };

  const handleDownloadSVG = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toSvg(previewRef.current);
      const link = document.createElement('a');
      link.download = `paper_${paperType}.svg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating SVG', err);
    }
  };

  // Generate SVG content based on paper type
  const renderPaperContent = () => {
    const w = currentSize.width;
    const h = currentSize.height;
    const m = margins;
    const spacing = lineSpacing;
    const lWidth = lineWidth;
    const lColor = lineColor;
    
    // SVG stroke dasharray
    const dashArray = lineStyle === 'dashed' ? '5,5' : lineStyle === 'dotted' ? '1,5' : 'none';
    const strokeLinecap = lineStyle === 'dotted' ? 'round' : 'butt';

    const elements = [];
    const bgElements = [];

    if (bgPattern !== 'none') {
      const defs = [];
      if (bgPattern === 'grid') {
        defs.push(
          <pattern key="bg-grid" id="bg-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={lColor} strokeWidth="0.5" opacity="0.2" />
          </pattern>
        );
      } else if (bgPattern === 'dots') {
        defs.push(
          <pattern key="bg-dots" id="bg-dots" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={lColor} opacity="0.2" />
          </pattern>
        );
      } else if (bgPattern === 'lines') {
        defs.push(
          <pattern key="bg-lines" id="bg-lines" width="10" height="10" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="10" y2="10" stroke={lColor} strokeWidth="0.5" opacity="0.2" />
          </pattern>
        );
      } else if (bgPattern === 'crosshatch') {
        defs.push(
          <pattern key="bg-crosshatch" id="bg-crosshatch" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 10 10 M 10 0 L 0 10" fill="none" stroke={lColor} strokeWidth="0.5" opacity="0.2" />
          </pattern>
        );
      } else if (bgPattern === 'graph') {
        defs.push(
          <pattern key="bg-graph" id="bg-graph" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="url(#bg-grid)" />
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={lColor} strokeWidth="1" opacity="0.3" />
          </pattern>
        );
      } else if (bgPattern === 'custom' && bgCustomImage) {
        defs.push(
          <pattern key="bg-custom" id="bg-custom" width="100%" height="100%" patternUnits="userSpaceOnUse">
            <image href={bgCustomImage} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" opacity="0.3" />
          </pattern>
        );
      }
      
      if (defs.length > 0) {
        bgElements.push(<defs key="bg-defs">{defs}</defs>);
        bgElements.push(<rect key="bg-rect" width="100%" height="100%" fill={`url(#bg-${bgPattern})`} />);
      }
    }

    if (paperType === 'lined') {
      for (let y = m; y <= h - m; y += spacing) {
        elements.push(<line key={`h-${y}`} x1={m} y1={y} x2={w - m} y2={y} stroke={lColor} strokeWidth={lWidth} strokeDasharray={dashArray} strokeLinecap={strokeLinecap} />);
      }
    } else if (paperType === 'vertical_lined') {
      for (let x = m; x <= w - m; x += spacing) {
        elements.push(<line key={`v-${x}`} x1={x} y1={m} x2={x} y2={h - m} stroke={lColor} strokeWidth={lWidth} strokeDasharray={dashArray} strokeLinecap={strokeLinecap} />);
      }
    } else if (paperType === 'grid') {
      for (let y = m; y <= h - m; y += spacing) {
        elements.push(<line key={`h-${y}`} x1={m} y1={y} x2={w - m} y2={y} stroke={lColor} strokeWidth={lWidth} strokeDasharray={dashArray} strokeLinecap={strokeLinecap} />);
      }
      for (let x = m; x <= w - m; x += spacing) {
        elements.push(<line key={`v-${x}`} x1={x} y1={m} x2={x} y2={h - m} stroke={lColor} strokeWidth={lWidth} strokeDasharray={dashArray} strokeLinecap={strokeLinecap} />);
      }
    } else if (paperType === 'dot') {
      for (let y = m; y <= h - m; y += spacing) {
        for (let x = m; x <= w - m; x += spacing) {
          elements.push(<circle key={`d-${x}-${y}`} cx={x} cy={y} r={lWidth * 1.5} fill={lColor} />);
        }
      }
    } else if (paperType === 'isometric') {
      const dx = spacing * Math.cos(Math.PI / 6);
      const dy = spacing * Math.sin(Math.PI / 6);
      for (let y = m; y <= h - m; y += spacing) {
        elements.push(<line key={`h-${y}`} x1={m} y1={y} x2={w - m} y2={y} stroke={lColor} strokeWidth={lWidth} />);
      }
      for (let x = m - h; x <= w - m + h; x += dx * 2) {
        elements.push(<line key={`d1-${x}`} x1={x} y1={m} x2={x + (h - 2*m) * Math.tan(Math.PI / 6)} y2={h - m} stroke={lColor} strokeWidth={lWidth} />);
        elements.push(<line key={`d2-${x}`} x1={x} y1={h - m} x2={x + (h - 2*m) * Math.tan(Math.PI / 6)} y2={m} stroke={lColor} strokeWidth={lWidth} />);
      }
    } else if (paperType === 'music') {
      let y = m + 10;
      while (y + spacing * 4 <= h - m) {
        for (let i = 0; i < 5; i++) {
          elements.push(<line key={`m-${y}-${i}`} x1={m} y1={y + i * spacing} x2={w - m} y2={y + i * spacing} stroke={lColor} strokeWidth={lWidth} />);
        }
        y += spacing * 8; // space between staves
      }
    } else if (paperType === 'guitar_tab') {
      let y = m + 10;
      while (y + spacing * 5 <= h - m) {
        for (let i = 0; i < 6; i++) {
          elements.push(<line key={`t-${y}-${i}`} x1={m} y1={y + i * spacing} x2={w - m} y2={y + i * spacing} stroke={lColor} strokeWidth={lWidth} />);
        }
        y += spacing * 9; // space between tabs
      }
    } else if (paperType === 'cornell') {
      const topMargin = m + 30;
      const bottomMargin = h - m - 40;
      const leftColWidth = (w - 2 * m) * 0.3;
      
      // Header line
      elements.push(<line key="c-top" x1={m} y1={topMargin} x2={w - m} y2={topMargin} stroke={lColor} strokeWidth={lWidth * 2} />);
      // Footer line
      elements.push(<line key="c-bottom" x1={m} y1={bottomMargin} x2={w - m} y2={bottomMargin} stroke={lColor} strokeWidth={lWidth * 2} />);
      // Vertical line
      elements.push(<line key="c-vert" x1={m + leftColWidth} y1={topMargin} x2={m + leftColWidth} y2={bottomMargin} stroke={lColor} strokeWidth={lWidth * 2} />);
      
      // Lined notes area
      for (let y = topMargin + spacing; y < bottomMargin; y += spacing) {
        elements.push(<line key={`c-h-${y}`} x1={m + leftColWidth + 2} y1={y} x2={w - m} y2={y} stroke={lColor} strokeWidth={lWidth} strokeDasharray={dashArray} strokeLinecap={strokeLinecap} />);
      }
    } else if (paperType === 'seyes') {
      // French ruled (Seyes)
      const majorSpacing = spacing;
      const minorSpacing = spacing / 4;
      for (let y = m; y <= h - m; y += majorSpacing) {
        elements.push(<line key={`s-M-${y}`} x1={m} y1={y} x2={w - m} y2={y} stroke={lColor} strokeWidth={lWidth * 2} />);
        for (let i = 1; i <= 3; i++) {
          if (y + i * minorSpacing < h - m) {
            elements.push(<line key={`s-m-${y}-${i}`} x1={m} y1={y + i * minorSpacing} x2={w - m} y2={y + i * minorSpacing} stroke={lColor} strokeWidth={lWidth * 0.5} />);
          }
        }
      }
      // Vertical margin line
      elements.push(<line key="s-v" x1={m + 30} y1={m} x2={m + 30} y2={h - m} stroke="#ef4444" strokeWidth={lWidth * 1.5} />);
    } else if (paperType === 'mizige') {
      const boxSize = spacing * 4;
      for (let y = m; y + boxSize <= h - m; y += boxSize + 5) {
        for (let x = m; x + boxSize <= w - m; x += boxSize + 5) {
          // Outer box
          elements.push(<rect key={`mz-b-${x}-${y}`} x={x} y={y} width={boxSize} height={boxSize} fill="none" stroke={lColor} strokeWidth={lWidth * 2} />);
          // Inner dashed lines
          elements.push(<line key={`mz-h-${x}-${y}`} x1={x} y1={y + boxSize/2} x2={x + boxSize} y2={y + boxSize/2} stroke={lColor} strokeWidth={lWidth} strokeDasharray="3,3" />);
          elements.push(<line key={`mz-v-${x}-${y}`} x1={x + boxSize/2} y1={y} x2={x + boxSize/2} y2={y + boxSize} stroke={lColor} strokeWidth={lWidth} strokeDasharray="3,3" />);
          elements.push(<line key={`mz-d1-${x}-${y}`} x1={x} y1={y} x2={x + boxSize} y2={y + boxSize} stroke={lColor} strokeWidth={lWidth} strokeDasharray="3,3" />);
          elements.push(<line key={`mz-d2-${x}-${y}`} x1={x} y1={y + boxSize} x2={x + boxSize} y2={y} stroke={lColor} strokeWidth={lWidth} strokeDasharray="3,3" />);
        }
      }
    } else if (paperType === 'blank') {
      // Do nothing for blank paper
    } else {
      // Default to lined if not fully implemented
      for (let y = m; y <= h - m; y += spacing) {
        elements.push(<line key={`h-${y}`} x1={m} y1={y} x2={w - m} y2={y} stroke={lColor} strokeWidth={lWidth} strokeDasharray={dashArray} strokeLinecap={strokeLinecap} />);
      }
    }

    if (enableSidebar) {
      const marginX = marginLinePosition === 'left' ? m + 25 : w - (m + 25);
      const mDashArray = marginLineStyle === 'dashed' ? '5,5' : marginLineStyle === 'dotted' ? '1,5' : 'none';
      const mLinecap = marginLineStyle === 'dotted' ? 'round' : 'butt';
      const lastY = m + Math.floor((h - 2 * m) / spacing) * spacing;
      elements.push(<line key="sidebar-line" x1={marginX} y1={m} x2={marginX} y2={lastY} stroke={marginLineColor} strokeWidth={marginLineWidth} strokeDasharray={mDashArray} strokeLinecap={mLinecap} />);
    }

    if (enableWatermark && watermark) {
      elements.push(
        <text 
          key="watermark" 
          x={w / 2} 
          y={h / 2} 
          fill={watermarkColor} 
          opacity={watermarkOpacity} 
          fontSize={watermarkFontSize} 
          fontWeight="bold" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          transform={`rotate(${watermarkAngle} ${w/2} ${h/2})`}
        >
          {watermark}
        </text>
      );
    }

    if (enableLogo && logoImage) {
      let lx = m;
      let ly = m;
      
      if (logoPosition.includes('center')) lx = (w - logoSize) / 2;
      if (logoPosition.includes('right')) lx = w - m - logoSize;
      
      if (logoPosition.includes('middle')) ly = (h - logoSize) / 2;
      if (logoPosition.includes('bottom')) ly = h - m - logoSize;

      elements.push(
        <image 
          key="logo" 
          x={lx} 
          y={ly} 
          width={logoSize} 
          height={logoSize} 
          href={logoImage} 
          opacity={logoOpacity} 
        />
      );
    }

    if (showPageNumber && !isGeneratingPDF) {
      elements.push(
        <text
          key="page-number"
          x={w / 2}
          y={h - 10}
          fill={lColor}
          fontSize={10}
          textAnchor="middle"
        >
          {startPageNumber}
        </text>
      );
    }

    return [...bgElements, ...elements];
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">PaperMe</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Generate custom paper templates and download them as PDF, SVG, or PNG.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Settings Panel */}
        <div className="space-y-6 lg:col-span-4 xl:col-span-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              <Settings2 className="h-4 w-4" />
              Paper Settings
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Paper Type</label>
                <select
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                >
                  {/* Grouping options */}
                  {Array.from(new Set(PAPER_TYPES.map(p => p.group))).map(group => {
                    if (!group) {
                      return PAPER_TYPES.filter(p => !p.group).map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ));
                    }
                    return (
                      <optgroup key={group} label={`---- ${group} ----`}>
                        {PAPER_TYPES.filter(p => p.group === group).map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Paper Size</label>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                >
                  {PAPER_SIZES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {paperSize === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Width (mm)</label>
                    <input
                      type="number"
                      min="1"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Height (mm)</label>
                    <input
                      type="number"
                      min="1"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                >
                  {THEMES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Line Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={lineColor}
                      onChange={(e) => setLineColor(e.target.value)}
                      className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                    <input
                      type="text"
                      value={lineColor}
                      onChange={(e) => setLineColor(e.target.value)}
                      className="w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-2 text-xs font-mono focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Bg Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-2 text-xs font-mono focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Line Style</label>
                <select
                  value={lineStyle}
                  onChange={(e) => setLineStyle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Spacing (mm)</label>
                  <input
                    type="number"
                    min="1"
                    value={lineSpacing}
                    onChange={(e) => setLineSpacing(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Width (px)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Margins (mm)</label>
                <input
                  type="number"
                  min="0"
                  value={margins}
                  onChange={(e) => setMargins(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                />
              </div>

              <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Background Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Bg Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-2 text-xs font-mono focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Bg Pattern</label>
                    <select
                      value={bgPattern}
                      onChange={(e) => setBgPattern(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                    >
                      <option value="none">No Pattern</option>
                      <option value="grid">Grid Pattern</option>
                      <option value="dots">Dots Pattern</option>
                      <option value="lines">Lines Pattern</option>
                      <option value="crosshatch">Crosshatch Pattern</option>
                      <option value="graph">Graph Pattern</option>
                      <option value="custom">Custom Image</option>
                    </select>
                  </div>
                </div>
                {bgPattern === 'custom' && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Upload Custom Pattern</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBgImageUpload}
                      className="w-full text-sm text-zinc-500 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-900 hover:file:bg-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-50 dark:hover:file:bg-zinc-700"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  <input
                    type="checkbox"
                    checked={enableSidebar}
                    onChange={(e) => setEnableSidebar(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-zinc-50 dark:focus:ring-zinc-50"
                  />
                  Enable Margin Line
                </label>
                {enableSidebar && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Position</label>
                      <select
                        value={marginLinePosition}
                        onChange={(e) => setMarginLinePosition(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                      >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Width (px)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={marginLineWidth}
                        onChange={(e) => setMarginLineWidth(Number(e.target.value))}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={marginLineColor}
                          onChange={(e) => setMarginLineColor(e.target.value)}
                          className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Style</label>
                      <select
                        value={marginLineStyle}
                        onChange={(e) => setMarginLineStyle(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  <input
                    type="checkbox"
                    checked={enableWatermark}
                    onChange={(e) => setEnableWatermark(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-zinc-50 dark:focus:ring-zinc-50"
                  />
                  Enable Watermark
                </label>
                {enableWatermark && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="col-span-2 space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Watermark Text</label>
                      <input
                        type="text"
                        value={watermark}
                        onChange={(e) => setWatermark(e.target.value)}
                        placeholder="e.g. DRAFT"
                        className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Opacity</label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max="1"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Angle (deg)</label>
                      <input
                        type="number"
                        value={watermarkAngle}
                        onChange={(e) => setWatermarkAngle(Number(e.target.value))}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Font Size</label>
                      <input
                        type="number"
                        value={watermarkFontSize}
                        onChange={(e) => setWatermarkFontSize(Number(e.target.value))}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={watermarkColor}
                          onChange={(e) => setWatermarkColor(e.target.value)}
                          className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  <input
                    type="checkbox"
                    checked={enableLogo}
                    onChange={(e) => setEnableLogo(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-zinc-50 dark:focus:ring-zinc-50"
                  />
                  Enable Logo
                </label>
                {enableLogo && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="col-span-2 space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Upload Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="w-full text-sm text-zinc-500 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-900 hover:file:bg-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-50 dark:hover:file:bg-zinc-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Position</label>
                      <select
                        value={logoPosition}
                        onChange={(e) => setLogoPosition(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                      >
                        <option value="top-left">Top Left</option>
                        <option value="top-center">Top Center</option>
                        <option value="top-right">Top Right</option>
                        <option value="middle-left">Middle Left</option>
                        <option value="middle-center">Middle Center</option>
                        <option value="middle-right">Middle Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-center">Bottom Center</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Size (mm)</label>
                      <input
                        type="number"
                        value={logoSize}
                        onChange={(e) => setLogoSize(Number(e.target.value))}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Opacity</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={logoOpacity}
                        onChange={(e) => setLogoOpacity(Number(e.target.value))}
                        className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Page Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Page Count</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={pageCount}
                      onChange={(e) => setPageCount(Number(e.target.value))}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Start Page Number</label>
                    <input
                      type="number"
                      min="1"
                      value={startPageNumber}
                      onChange={(e) => setStartPageNumber(Number(e.target.value))}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-1.5 text-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={showPageNumber}
                    onChange={(e) => setShowPageNumber(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:bg-zinc-50 dark:focus:ring-zinc-50"
                  />
                  Show Page Number
                </label>
              </div>

            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <button
              onClick={handleDownloadPDF}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <FileText className="h-4 w-4" />
              Download PDF
            </button>
            <div className="flex flex-1 gap-3">
              <button
                onClick={handleDownloadPNG}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                <FileImage className="h-4 w-4" />
                PNG
              </button>
              <button
                onClick={handleDownloadSVG}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                <File className="h-4 w-4" />
                SVG
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Live Preview</h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {currentSize.width} × {currentSize.height} mm
              </span>
            </div>
            
            <div className="flex items-center justify-center overflow-auto rounded-xl border border-zinc-200 bg-zinc-200/50 p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
              {/* Paper Container */}
              <div 
                ref={previewRef}
                className="relative shadow-xl transition-all"
                style={{ 
                  width: `${currentSize.width}mm`, 
                  backgroundColor: bgColor,
                  // Scale down for preview on smaller screens
                  transformOrigin: 'top center',
                  maxWidth: '100%',
                  aspectRatio: `${currentSize.width} / ${currentSize.height}`,
                  height: 'auto'
                }}
              >
                <svg 
                  width="100%" 
                  height="100%" 
                  viewBox={`0 0 ${currentSize.width} ${currentSize.height}`} 
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0"
                >
                  {renderPaperContent()}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
