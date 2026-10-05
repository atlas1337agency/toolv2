import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Instagram, AlertCircle, Loader2, User, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function InstagramDownloader() {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; type: 'post' | 'profile' } | null>(null);

  const fetchInstagramImage = async (targetUrl: string, type: 'post' | 'profile') => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Use a CORS proxy to fetch the Instagram page HTML
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const html = data.contents;

      if (!html) {
        throw new Error('Failed to fetch content from Instagram.');
      }

      // Parse the HTML to find the og:image meta tag
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');

      if (ogImage && !ogImage.includes('1190632971110592_1565287620')) { // Check if it's not the generic IG logo
        setResult({ url: ogImage, type });
      } else {
        throw new Error('Could not find the image. The profile might be private or Instagram blocked the request.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch Instagram image. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!url.includes('instagram.com/p/') && !url.includes('instagram.com/reel/')) {
      setError('Please enter a valid Instagram post or reel URL.');
      return;
    }

    await fetchInstagramImage(url, 'post');
  };

  const handleProfileDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    const cleanUsername = username.replace('@', '').trim();
    const profileUrl = `https://www.instagram.com/${cleanUsername}/`;
    
    await fetchInstagramImage(profileUrl, 'profile');
  };

  const downloadImage = async () => {
    if (!result) return;
    
    try {
      // Fetch the image through proxy to avoid canvas CORS issues if we wanted to manipulate it,
      // but for direct download we can just fetch it as a blob.
      const imageResponse = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(result.url)}`);
      const blob = await imageResponse.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `instagram_${result.type}_${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback: open in new tab
      window.open(result.url, '_blank');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/social-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Social Tools
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instagram Photo Downloader</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Download photos from public Instagram posts and profiles.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Instagram className="w-5 h-5 mr-2 text-pink-600" />
              Download Instagram Content
            </CardTitle>
            <CardDescription>
              Fetch high-quality images directly from Instagram without needing an account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="post" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="post" className="flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Post / Reel
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Profile Picture
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="post">
                <form onSubmit={handlePostDownload} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="url" 
                      placeholder="https://www.instagram.com/p/..."
                      className="flex h-10 flex-1 rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                    <Button type="submit" disabled={isLoading || !url} className="bg-pink-600 hover:bg-pink-700 text-white sm:w-32">
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                      Fetch
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="profile">
                <form onSubmit={handleProfileDownload} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">@</span>
                      <input 
                        type="text" 
                        placeholder="username"
                        className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent pl-8 pr-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isLoading || !username} className="bg-pink-600 hover:bg-pink-700 text-white sm:w-32">
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                      Fetch
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-start text-sm">
                <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Error fetching image</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`mx-auto bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm ${result.type === 'profile' ? 'w-64 h-64 rounded-full' : 'w-full max-w-md aspect-square'}`}>
                  <img src={result.url} alt={`Instagram ${result.type}`} className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-center">
                  <Button onClick={downloadImage} className="bg-pink-600 hover:bg-pink-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download High Quality Image
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

