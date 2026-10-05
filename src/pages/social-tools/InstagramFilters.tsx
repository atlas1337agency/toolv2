import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Download, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FILTERS = [
  { name: 'Normal', style: {} },
  { name: 'Clarendon', style: { filter: 'contrast(1.2) saturate(1.35)' } },
  { name: 'Gingham', style: { filter: 'brightness(1.05) hue-rotate(-10deg)' } },
  { name: 'Moon', style: { filter: 'grayscale(1) contrast(1.1) brightness(1.1)' } },
  { name: 'Lark', style: { filter: 'contrast(0.9) saturate(1.2)' } },
  { name: 'Reyes', style: { filter: 'sepia(0.22) brightness(1.1) contrast(0.85) saturate(0.75)' } },
  { name: 'Juno', style: { filter: 'saturate(1.4) contrast(1.15) hue-rotate(-4deg)' } },
  { name: 'Slumber', style: { filter: 'saturate(0.66) brightness(1.05)' } },
  { name: 'Crema', style: { filter: 'sepia(0.5) contrast(1.1) brightness(1.15) saturate(0.9)' } },
  { name: 'Ludwig', style: { filter: 'contrast(1.05) saturate(1.1) sepia(0.25)' } },
  { name: 'Aden', style: { filter: 'hue-rotate(-20deg) contrast(0.9) saturate(0.85) brightness(1.2)' } },
  { name: 'Perpetua', style: { filter: 'brightness(1.05) contrast(1.1) saturate(1.1)' } },
];

export function InstagramFilters() {
  const [image, setImage] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) {
      setImage(urlInput);
    }
  };

  const downloadImage = () => {
    if (!imageRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    // Apply filter to canvas context
    ctx.filter = activeFilter.style.filter || 'none';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const link = document.createElement('a');
    link.download = `filtered_${activeFilter.name.toLowerCase()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/social-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Social Tools
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instagram Filters</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Apply beautiful filters to your photos.</p>
        </div>

        {!image ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Local File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer border-zinc-300 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:bg-zinc-900">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-10 h-10 mb-3 text-zinc-400" />
                    <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Use Image URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/image.jpg"
                      className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Load Image</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => setImage(null)}>
                Choose Different Image
              </Button>
              <Button onClick={downloadImage} className="bg-pink-600 hover:bg-pink-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center min-h-[400px]">
                  <img 
                    ref={imageRef}
                    src={image} 
                    alt="Preview" 
                    className="max-w-full max-h-[600px] object-contain transition-all duration-300"
                    style={activeFilter.style}
                    crossOrigin="anonymous"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter.name}
                      onClick={() => setActiveFilter(filter)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                        activeFilter.name === filter.name 
                          ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 ring-2 ring-pink-500' 
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-md overflow-hidden mb-2 bg-zinc-200 dark:bg-zinc-800">
                        <img 
                          src={image} 
                          alt={filter.name} 
                          className="w-full h-full object-cover"
                          style={filter.style}
                          crossOrigin="anonymous"
                        />
                      </div>
                      <span className="text-xs font-medium">{filter.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
