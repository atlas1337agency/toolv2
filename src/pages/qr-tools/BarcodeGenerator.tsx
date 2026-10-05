import React, { useState, useRef } from "react";
import { motion } from "motion/react";
// @ts-ignore
import Barcode from "react-barcode";
import { Download, Printer, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function BarcodeGenerator() {
  const navigate = useNavigate();
  const [value, setValue] = useState("123456789012");
  const [format, setFormat] = useState("CODE128");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [lineColor, setLineColor] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const barcodeRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!barcodeRef.current) return;
    const svg = barcodeRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `barcode-${format}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pt-8 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/qr")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Barcode Generator</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Generate barcodes for different international standardizations with desired sizes.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px] bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 m-6 p-8">
            <div ref={barcodeRef} className="bg-white p-4 rounded-lg shadow-sm max-w-full overflow-x-auto">
              <Barcode 
                value={value || " "} 
                format={format as any} 
                width={width} 
                height={height} 
                displayValue={displayValue} 
                lineColor={lineColor} 
                background={background} 
              />
            </div>
          </CardContent>
          <div className="p-6 pt-0 flex justify-end gap-2">
            <Button onClick={handleDownload} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> Download PNG
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Barcode Value</Label>
              <Input 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                placeholder="Enter value..."
              />
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CODE128">CODE128</SelectItem>
                  <SelectItem value="CODE39">CODE39</SelectItem>
                  <SelectItem value="EAN13">EAN-13</SelectItem>
                  <SelectItem value="EAN8">EAN-8</SelectItem>
                  <SelectItem value="UPC">UPC</SelectItem>
                  <SelectItem value="ITF14">ITF-14</SelectItem>
                  <SelectItem value="MSI">MSI</SelectItem>
                  <SelectItem value="pharmacode">Pharmacode</SelectItem>
                  <SelectItem value="codabar">Codabar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Bar Width</Label>
                <span className="text-sm text-zinc-500">{width}px</span>
              </div>
              <Slider 
                value={[width]} 
                onValueChange={(v) => setWidth(Array.isArray(v) ? v[0] : v)} 
                min={1} 
                max={5} 
                step={1} 
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Height</Label>
                <span className="text-sm text-zinc-500">{height}px</span>
              </div>
              <Slider 
                value={[height]} 
                onValueChange={(v) => setHeight(Array.isArray(v) ? v[0] : v)} 
                min={30} 
                max={200} 
                step={5} 
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="display-value">Show Value Text</Label>
              <Switch 
                id="display-value" 
                checked={displayValue} 
                onCheckedChange={setDisplayValue} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Line Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={lineColor} 
                    onChange={(e) => setLineColor(e.target.value)} 
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input 
                    value={lineColor} 
                    onChange={(e) => setLineColor(e.target.value)} 
                    className="flex-1 font-mono text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={background} 
                    onChange={(e) => setBackground(e.target.value)} 
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input 
                    value={background} 
                    onChange={(e) => setBackground(e.target.value)} 
                    className="flex-1 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
