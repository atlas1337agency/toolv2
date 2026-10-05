import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Youtube, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function YouTubeThumbnail() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractVideoId = (inputUrl: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVideoId(null);

    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
    } else {
      setError('Invalid YouTube URL. Please enter a valid video link.');
    }
  };

  const downloadImage = async (imageUrl: string, quality: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `youtube_thumbnail_${quality}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback if CORS blocks the fetch
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/social-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Social Tools
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">YouTube Thumbnail Grabber</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Get all available thumbnail images of a YouTube video.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Youtube className="w-5 h-5 mr-2 text-red-600" />
              Extract Thumbnails
            </CardTitle>
            <CardDescription>
              Paste a YouTube video URL to get its thumbnails in various sizes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFetch} className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="url" 
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex h-10 flex-1 rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                  Get Thumbnails
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-start text-sm">
                <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {videoId && (
          <div className="space-y-8 mt-8">
            <ThumbnailCard 
              title="Maximum Resolution (1080p)" 
              url={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              quality="maxres"
              onDownload={downloadImage}
            />
            <ThumbnailCard 
              title="High Quality (720p)" 
              url={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`}
              quality="hq"
              onDownload={downloadImage}
            />
            <ThumbnailCard 
              title="Medium Quality (480p)" 
              url={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              quality="mq"
              onDownload={downloadImage}
            />
            <ThumbnailCard 
              title="Standard Quality (360p)" 
              url={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
              quality="sq"
              onDownload={downloadImage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ThumbnailCard({ title, url, quality, onDownload }: { title: string, url: string, quality: string, onDownload: (url: string, q: string) => void }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button variant="outline" size="sm" onClick={() => onDownload(url, quality)}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 bg-zinc-100 dark:bg-zinc-950 flex justify-center">
        <img 
          src={url} 
          alt={title} 
          className="max-w-full h-auto"
          onError={(e) => {
            // Some videos don't have maxresdefault, hide the image if it fails to load
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              parent.innerHTML = '<div class="p-8 text-zinc-500 text-sm">This resolution is not available for this video.</div>';
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
