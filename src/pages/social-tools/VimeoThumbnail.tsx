import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Video, Download, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function VimeoThumbnail() {
  const [url, setUrl] = useState('');
  const [thumbnails, setThumbnails] = useState<{ large: string, medium: string, small: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const extractVideoId = (inputUrl: string) => {
    const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
    const match = inputUrl.match(regExp);
    return match ? match[1] : null;
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setThumbnails(null);
    setLoading(true);

    const id = extractVideoId(url);
    if (!id) {
      setError('Invalid Vimeo URL. Please enter a valid video link.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://vimeo.com/api/v2/video/${id}.json`);
      if (!response.ok) {
        throw new Error('Video not found or is private.');
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setThumbnails({
          large: data[0].thumbnail_large,
          medium: data[0].thumbnail_medium,
          small: data[0].thumbnail_small
        });
      } else {
        throw new Error('No thumbnail data found.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch video details.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl: string, quality: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `vimeo_thumbnail_${quality}.jpg`;
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
          <h1 className="text-3xl font-bold tracking-tight">Vimeo Thumbnail Grabber</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Get all available thumbnail images of a Vimeo video.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="w-5 h-5 mr-2 text-blue-500" />
              Extract Thumbnails
            </CardTitle>
            <CardDescription>
              Paste a Vimeo video URL to get its thumbnails in various sizes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFetch} className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="url" 
                  placeholder="https://vimeo.com/..."
                  className="flex h-10 flex-1 rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
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

        {thumbnails && (
          <div className="space-y-8 mt-8">
            <ThumbnailCard 
              title="Large Resolution" 
              url={thumbnails.large}
              quality="large"
              onDownload={downloadImage}
            />
            <ThumbnailCard 
              title="Medium Resolution" 
              url={thumbnails.medium}
              quality="medium"
              onDownload={downloadImage}
            />
            <ThumbnailCard 
              title="Small Resolution" 
              url={thumbnails.small}
              quality="small"
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
        />
      </CardContent>
    </Card>
  );
}
