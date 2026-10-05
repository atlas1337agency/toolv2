import React from "react";
import { Link } from "react-router-dom";
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Video, 
  Code, 
  Image as ImageIcon,
  Download,
  Share2,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";

const tools = [
  {
    title: "Instagram Filters",
    description: "Apply Instagram filters to your photos either by uploading a local file or from a URL.",
    icon: Instagram,
    href: "/social-tools/instagram-filters",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "Instagram Post Generator",
    description: "Create Instagram posts as if they were real, download them as an image and make jokes.",
    icon: Instagram,
    href: "/social-tools/instagram-post",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "Instagram Story Generator",
    description: "Create Instagram stories as if they were real, download them as an image and make jokes.",
    icon: Instagram,
    href: "/social-tools/instagram-story",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "Instagram Photo Downloader",
    description: "Download photos from public Instagram posts and save them to your local device.",
    icon: Download,
    href: "/social-tools/instagram-downloader",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "Tweet Generator",
    description: "Create tweets as if they were real, download them as an image and make jokes.",
    icon: Twitter,
    href: "/social-tools/tweet-generator",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    title: "Tweet to Image Converter",
    description: "Convert tweets to images by adding fancy backgrounds, download and share them.",
    icon: ImageIcon,
    href: "/social-tools/tweet-to-image",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    title: "Twitter Ad Revenue Generator",
    description: "Generate Twitter ad revenue screenshots and make jokes to your friends.",
    icon: DollarSign,
    href: "/social-tools/twitter-ad-revenue",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    title: "YouTube Thumbnail Grabber",
    description: "Get all available thumbnail images of a YouTube video just by entering the URL.",
    icon: Youtube,
    href: "/social-tools/youtube-thumbnail",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    title: "Vimeo Thumbnail Grabber",
    description: "Get all available thumbnail images of a Vimeo video just by entering the URL.",
    icon: Video,
    href: "/social-tools/vimeo-thumbnail",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    title: "Open Graph Meta Generator",
    description: "Generate open graph meta code for your web page and add it to your site's head section.",
    icon: Code,
    href: "/social-tools/open-graph",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

export function SocialTools() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Social Media Tools</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">
            A collection of tools for social media content creation, downloading, and meta tag generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={tool.href} className="block h-full">
                  <Card className="h-full hover:shadow-md transition-all hover:border-zinc-400 dark:hover:border-zinc-600 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${tool.color}`} />
                      </div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                      <CardDescription className="text-sm mt-2 leading-relaxed">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
