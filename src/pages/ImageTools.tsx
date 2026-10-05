import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Minimize, 
  Maximize, 
  ZoomIn, 
  Eraser, 
  Stamp, 
  Globe, 
  Crop, 
  RotateCw, 
  Smile, 
  FileImage, 
  Images, 
  Type,
  Wand2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tools = [
  {
    title: "Compress IMAGE",
    description: "Compress JPG, PNG, SVG, and GIFs while saving space and maintaining quality.",
    icon: Minimize,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/image-tools/compress"
  },
  {
    title: "Image To Text",
    description: "Extract the Text From an Image.",
    icon: Type,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/image-tools/text"
  },
  {
    title: "Image To Prompt",
    description: "Generate a highly detailed AI prompt from any image using Gemini 3.1.",
    icon: Wand2,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/image-tools/prompt"
  },
  {
    title: "Resize IMAGE",
    description: "Define your dimensions, by percent or pixel, and resize your JPG, PNG, SVG, and GIF images.",
    icon: Maximize,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    href: "/image-tools/resize"
  },
  {
    title: "Upscale Image",
    description: "Enlarge your images with high resolution. Easily increase the size of your JPG and PNG images while maintaining visual quality.",
    icon: ZoomIn,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    href: "/image-tools/upscale"
  },
  {
    title: "Remove background",
    description: "Quickly remove image backgrounds with high accuracy. Instantly detect objects and cut out backgrounds with ease.",
    icon: Eraser,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    href: "/image-tools/remove-bg"
  },
  {
    title: "Watermark IMAGE",
    description: "Stamp an image or text over your images in seconds. Choose the typography, transparency and position.",
    icon: Stamp,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    href: "/image-tools/watermark"
  },
  {
    title: "HTML to IMAGE",
    description: "Convert webpages in HTML to JPG or SVG. Copy and paste the URL of the page you want and convert it to IMAGE with a click.",
    icon: Globe,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    href: "/image-tools/html-to-image"
  },
  {
    title: "Crop IMAGE",
    description: "Crop JPG, PNG, or GIFs with ease; Choose pixels to define your rectangle or use our visual editor.",
    icon: Crop,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    href: "/image-tools/crop"
  },
  {
    title: "Rotate IMAGE",
    description: "Rotate many images JPG, PNG or GIF at same time. Choose to rotate only landscape or portrait images!",
    icon: RotateCw,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    href: "/image-tools/rotate"
  },
  {
    title: "Meme generator",
    description: "Create your memes online with ease. Caption meme images or upload your pictures to make custom memes.",
    icon: Smile,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    href: "/image-tools/meme"
  },
  {
    title: "Convert to JPG",
    description: "Turn PNG, GIF, TIF, PSD, SVG, WEBP, HEIC, or RAW format images to JPG in bulk with ease.",
    icon: FileImage,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    href: "/image-tools/convert-format"
  },
  {
    title: "Convert from JPG",
    description: "Turn JPG images to PNG and GIF. Choose several JPGs to create an animated GIF in seconds!",
    icon: Images,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    href: "/image-tools/convert-format"
  }
];

export function ImageTools() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Image Tools</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">
            A complete suite of smart image editing and conversion tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
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
