import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, MessageCircle, Repeat2, Heart, Share, MoreHorizontal, BadgeCheck, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as htmlToImage from 'html-to-image';

export function TweetGenerator() {
  const [name, setName] = useState('Elon Musk');
  const [handle, setHandle] = useState('elonmusk');
  const [isVerified, setIsVerified] = useState(true);
  const [tweetText, setTweetText] = useState('Just bought Twitter. Next I\'m buying Coca-Cola to put the cocaine back in.');
  const [time, setTime] = useState('8:56 PM · Apr 27, 2022');
  const [views, setViews] = useState('145.2M');
  const [retweets, setRetweets] = useState('684.5K');
  const [quotes, setQuotes] = useState('142.1K');
  const [likes, setLikes] = useState('4.8M');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [avatarUrl, setAvatarUrl] = useState('https://picsum.photos/seed/elon/100/100');
  
  const tweetRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadTweet = async () => {
    if (!tweetRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(tweetRef.current, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'fake-tweet.png';
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
            <h1 className="text-3xl font-bold tracking-tight">Tweet Generator</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Create fake tweets for jokes and memes.</p>
          </div>
          <Button onClick={downloadTweet} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Tweet
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Tweet Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-medium">Theme</label>
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === 'light' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username (@handle)</label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
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
                <label className="text-sm font-medium">Tweet Text</label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time & Date</label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Views</label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Retweets</label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={retweets}
                    onChange={(e) => setRetweets(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quotes</label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={quotes}
                    onChange={(e) => setQuotes(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Likes</label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <label className="text-sm font-medium">Profile Picture</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="flex w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm file:font-medium hover:file:bg-zinc-200 dark:border-zinc-700 dark:file:bg-zinc-800 dark:file:text-zinc-400 dark:hover:file:bg-zinc-700"
                  onChange={handleImageUpload}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center items-start">
            {/* Tweet Preview */}
            <div 
              ref={tweetRef}
              className={`w-[500px] border rounded-xl p-4 font-sans ${theme === 'dark' ? 'bg-black text-white border-zinc-800' : 'bg-white text-black border-zinc-200'}`}
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover" crossOrigin="anonymous" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-bold hover:underline cursor-pointer">{name}</span>
                      {isVerified && <BadgeCheck className="w-5 h-5 text-blue-500 fill-current" />}
                    </div>
                    <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}>@{handle}</span>
                  </div>
                </div>
                <MoreHorizontal className={`w-5 h-5 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`} />
              </div>

              {/* Body */}
              <div className="text-[23px] leading-tight mb-4 whitespace-pre-wrap break-words">
                {tweetText}
              </div>

              {/* Time & Views */}
              <div className={`flex items-center gap-1 text-[15px] mb-4 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                <span>{time}</span>
                <span>·</span>
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{views}</span>
                <span>Views</span>
              </div>

              {/* Stats */}
              <div className={`flex items-center gap-6 py-3 border-y text-[15px] ${theme === 'dark' ? 'border-zinc-800 text-zinc-500' : 'border-zinc-200 text-zinc-500'}`}>
                <div className="flex items-center gap-1">
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{retweets}</span>
                  <span>Retweets</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{quotes}</span>
                  <span>Quotes</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{likes}</span>
                  <span>Likes</span>
                </div>
              </div>

              {/* Actions */}
              <div className={`flex justify-between items-center pt-3 px-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                <MessageCircle className="w-[22px] h-[22px] hover:text-blue-500 cursor-pointer" />
                <Repeat2 className="w-[22px] h-[22px] hover:text-green-500 cursor-pointer" />
                <Heart className="w-[22px] h-[22px] hover:text-pink-500 cursor-pointer" />
                <Share className="w-[22px] h-[22px] hover:text-blue-500 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
