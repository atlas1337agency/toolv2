import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Image as ImageIcon, Twitter, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as htmlToImage from 'html-to-image';

const GRADIENTS = [
  'bg-gradient-to-br from-purple-500 to-indigo-500',
  'bg-gradient-to-br from-pink-500 to-rose-500',
  'bg-gradient-to-br from-cyan-500 to-blue-500',
  'bg-gradient-to-br from-emerald-500 to-teal-500',
  'bg-gradient-to-br from-orange-500 to-red-500',
  'bg-gradient-to-br from-zinc-800 to-black',
];

export function TweetToImage() {
  const [name, setName] = useState('Naval');
  const [handle, setHandle] = useState('naval');
  const [isVerified, setIsVerified] = useState(true);
  const [tweetText, setTweetText] = useState('Play iterated games. All the returns in life, whether in wealth, relationships, or knowledge, come from compound interest.');
  const [avatarUrl, setAvatarUrl] = useState('https://picsum.photos/seed/naval/100/100');
  const [background, setBackground] = useState(GRADIENTS[0]);
  const [darkMode, setDarkMode] = useState(true);
  
  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'tweet-card.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link to="/social-tools" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Social Tools
        </Link>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tweet to Image</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Convert tweets into beautiful, shareable images.</p>
          </div>
          <Button onClick={downloadImage} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Image
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Customize Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Content</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Name</label>
                    <input 
                      type="text" 
                      className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Username</label>
                    <input 
                      type="text" 
                      className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="verified" 
                    checked={isVerified} 
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="rounded border-zinc-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="verified" className="text-sm font-medium">Verified Badge</label>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Tweet Text</label>
                  <textarea 
                    className="flex min-h-[100px] w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Profile Picture</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="flex w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm file:font-medium hover:file:bg-zinc-200 dark:border-zinc-700 dark:file:bg-zinc-800 dark:file:text-zinc-400 dark:hover:file:bg-zinc-700"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-medium">Appearance</h3>
                
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Background Gradient</label>
                  <div className="flex flex-wrap gap-2">
                    {GRADIENTS.map((grad) => (
                      <button
                        key={grad}
                        onClick={() => setBackground(grad)}
                        className={`w-8 h-8 rounded-full ${grad} ${background === grad ? 'ring-2 ring-offset-2 ring-zinc-900 dark:ring-white dark:ring-offset-zinc-900' : ''}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Card Theme</label>
                  <div className="flex gap-2">
                    <Button 
                      variant={!darkMode ? "default" : "outline"} 
                      onClick={() => setDarkMode(false)}
                      className="flex-1"
                    >
                      Light
                    </Button>
                    <Button 
                      variant={darkMode ? "default" : "outline"} 
                      onClick={() => setDarkMode(true)}
                      className="flex-1"
                    >
                      Dark
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center items-start">
            {/* Image Preview Area */}
            <div 
              ref={cardRef}
              className={`w-[500px] aspect-square ${background} p-12 flex items-center justify-center`}
            >
              <div 
                className={`w-full rounded-2xl p-8 shadow-2xl ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover" crossOrigin="anonymous" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-lg">{name}</span>
                        {isVerified && <BadgeCheck className="w-5 h-5 text-blue-500 fill-current" />}
                      </div>
                      <span className={`${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>@{handle}</span>
                    </div>
                  </div>
                  <Twitter className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-blue-500'}`} />
                </div>

                <div className="text-2xl leading-snug font-medium whitespace-pre-wrap break-words">
                  {tweetText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
