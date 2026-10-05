import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function OpenGraphGenerator() {
  const [title, setTitle] = useState('My Awesome Website');
  const [description, setDescription] = useState('This is a description of my awesome website that will appear when shared on social media.');
  const [url, setUrl] = useState('https://example.com');
  const [imageUrl, setImageUrl] = useState('https://example.com/image.jpg');
  const [siteName, setSiteName] = useState('AwesomeSite');
  const [type, setType] = useState('website');
  
  const [copied, setCopied] = useState(false);

  const generateMetaTags = () => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${type}" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${imageUrl}" />`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMetaTags());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link to="/social-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Social Tools
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Open Graph Meta Generator</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Generate Open Graph meta tags for your website to look great when shared on social media.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Website Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input 
                  type="text" 
                  className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Page Title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the page..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <input 
                  type="url" 
                  className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <input 
                  type="url" 
                  className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://.../image.jpg"
                />
                <p className="text-xs text-zinc-500">Recommended size: 1200x630 pixels.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Site Name</label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="profile">Profile</option>
                    <option value="book">Book</option>
                    <option value="music.song">Music</option>
                    <option value="video.movie">Video</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden max-w-[500px] mx-auto bg-white dark:bg-zinc-950">
                  <div className="aspect-[1.91/1] bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
                    )}
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1 truncate">{url.replace(/^https?:\/\//, '').split('/')[0]}</div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate mb-1">{title || 'Page Title'}</div>
                    <div className="text-sm text-zinc-500 line-clamp-2">{description || 'Page description will appear here.'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Output */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Generated HTML
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
                  <code>{generateMetaTags()}</code>
                </pre>
                <p className="text-sm text-zinc-500 mt-4">
                  Paste this code inside the <code>&lt;head&gt;</code> section of your HTML document.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
