import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, Download, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as htmlToImage from 'html-to-image';

const VerifiedBadge = ({ className }: { className?: string }) => (
  <svg aria-label="Verified" className={className || "w-3.5 h-3.5 ml-1"} viewBox="0 0 40 40">
    <path
      d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const HeartIcon = ({ className, filled }: { className?: string, filled?: boolean }) => {
  if (filled) {
    return (
      <svg aria-label="Unlike" className={className} fill="currentColor" viewBox="0 0 48 48">
        <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
      </svg>
    );
  }
  return (
    <svg aria-label="Like" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z" />
    </svg>
  );
};

const CommentIcon = ({ className }: { className?: string }) => (
  <svg aria-label="Comment" className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" strokeLinejoin="round" />
  </svg>
);

const ShareIcon = ({ className }: { className?: string }) => (
  <svg aria-label="Share Post" className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="22" x2="9.218" y1="3" y2="10.083" strokeLinejoin="round" />
    <polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" strokeLinejoin="round" />
  </svg>
);

const BookmarkIcon = ({ className }: { className?: string }) => (
  <svg aria-label="Save" className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" strokeLinejoin="round" />
  </svg>
);

export function InstagramPostGenerator() {
  const [username, setUsername] = useState('username');
  const [location, setLocation] = useState('Location');
  const [likes, setLikes] = useState('1,234');
  const [caption, setCaption] = useState('This is a beautiful day! #sunshine #happy');
  const [time, setTime] = useState('2 HOURS AGO');
  
  const [avatarUrl, setAvatarUrl] = useState('https://picsum.photos/seed/avatar/100/100');
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/seed/post/600/600');
  
  // New features
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isVerified, setIsVerified] = useState(true);
  const [imageCount, setImageCount] = useState(1);
  const [commentsCount, setCommentsCount] = useState('45');
  const [isLiked, setIsLiked] = useState(false);
  const [isTagged, setIsTagged] = useState(false);
  const [hasStory, setHasStory] = useState(false);
  const [showComments, setShowComments] = useState(true);
  
  const postRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setter(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadPost = async () => {
    if (!postRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(postRef.current, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'instagram-post.png';
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
            <h1 className="text-3xl font-bold tracking-tight">Instagram Post Generator</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Create fake Instagram posts with advanced options.</p>
          </div>
          <Button onClick={downloadPost} className="bg-pink-600 hover:bg-pink-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Post
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">Basic Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Username</label>
                    <input 
                      type="text" 
                      className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Location</label>
                    <input 
                      type="text" 
                      className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Likes Count</label>
                    <input 
                      type="text" 
                      className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                      value={likes}
                      onChange={(e) => setLikes(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Comments Count</label>
                    <input 
                      type="text" 
                      className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                      value={commentsCount}
                      onChange={(e) => setCommentsCount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Time</label>
                    <input 
                      type="text" 
                      className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Caption</label>
                  <textarea 
                    className="flex min-h-[60px] w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">Toggles & Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="verified" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} className="rounded border-zinc-300 text-blue-500 focus:ring-blue-500" />
                    <label htmlFor="verified" className="text-sm font-medium">Verified Badge</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="hasStory" checked={hasStory} onChange={(e) => setHasStory(e.target.checked)} className="rounded border-zinc-300 text-pink-500 focus:ring-pink-500" />
                    <label htmlFor="hasStory" className="text-sm font-medium">Has Story Ring</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="isLiked" checked={isLiked} onChange={(e) => setIsLiked(e.target.checked)} className="rounded border-zinc-300 text-red-500 focus:ring-red-500" />
                    <label htmlFor="isLiked" className="text-sm font-medium">Liked by Viewer</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="isTagged" checked={isTagged} onChange={(e) => setIsTagged(e.target.checked)} className="rounded border-zinc-300 text-zinc-500 focus:ring-zinc-500" />
                    <label htmlFor="isTagged" className="text-sm font-medium">Someone Tagged</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="showComments" checked={showComments} onChange={(e) => setShowComments(e.target.checked)} className="rounded border-zinc-300 text-zinc-500 focus:ring-zinc-500" />
                    <label htmlFor="showComments" className="text-sm font-medium">Show Comments Line</label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Image Count (Carousel)</label>
                    <input 
                      type="number" 
                      min="1" max="10"
                      className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                      value={imageCount}
                      onChange={(e) => setImageCount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500">Theme</label>
                    <div className="flex gap-2">
                      <Button variant={theme === 'light' ? "default" : "outline"} onClick={() => setTheme('light')} className="flex-1 h-9">Light</Button>
                      <Button variant={theme === 'dark' ? "default" : "outline"} onClick={() => setTheme('dark')} className="flex-1 h-9">Dark</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Profile Picture</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="flex w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm file:font-medium hover:file:bg-zinc-200 dark:border-zinc-700 dark:file:bg-zinc-800 dark:file:text-zinc-400 dark:hover:file:bg-zinc-700"
                    onChange={(e) => handleImageUpload(e, setAvatarUrl)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500">Post Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="flex w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm file:font-medium hover:file:bg-zinc-200 dark:border-zinc-700 dark:file:bg-zinc-800 dark:file:text-zinc-400 dark:hover:file:bg-zinc-700"
                    onChange={(e) => handleImageUpload(e, setImageUrl)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center items-start">
            {/* Instagram Post Preview */}
            <div 
              ref={postRef}
              className={`w-[400px] border rounded-sm overflow-hidden font-sans ${theme === 'dark' ? 'bg-black text-white border-zinc-800' : 'bg-white text-black border-zinc-200 shadow-sm'}`}
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-[2px] ${hasStory ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500' : ''}`}>
                    <img src={avatarUrl} alt="Avatar" className={`w-8 h-8 rounded-full object-cover border-2 ${theme === 'dark' ? 'border-black' : 'border-white'}`} crossOrigin="anonymous" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold leading-none">{username}</span>
                      {isVerified && <VerifiedBadge className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-white' : 'text-blue-500'}`} />}
                    </div>
                    {location && <span className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{location}</span>}
                  </div>
                </div>
                <MoreHorizontal className={`w-5 h-5 ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-800'}`} />
              </div>

              {/* Image */}
              <div className="w-full aspect-square bg-zinc-100 relative">
                <img src={imageUrl} alt="Post" className="w-full h-full object-cover" crossOrigin="anonymous" />
                
                {/* Image Count Indicator (Top Right) */}
                {imageCount > 1 && (
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-medium">
                    1/{imageCount}
                  </div>
                )}
                
                {/* Tag Indicator (Bottom Left) */}
                {isTagged && (
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white p-1.5 rounded-full">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-3">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex gap-4">
                    <HeartIcon className={`w-6 h-6 ${isLiked ? 'text-red-500' : ''}`} filled={isLiked} />
                    <CommentIcon className="w-6 h-6" />
                    <ShareIcon className="w-6 h-6" />
                  </div>
                  
                  {/* Carousel Dots */}
                  {imageCount > 1 && (
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(imageCount, 5) }).map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-blue-500' : (theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-300')}`} />
                      ))}
                    </div>
                  )}
                  
                  <BookmarkIcon className="w-6 h-6" />
                </div>

                {/* Likes */}
                <div className="text-sm font-semibold mb-1">
                  {likes} likes
                </div>

                {/* Caption */}
                <div className="text-sm mb-1">
                  <span className="font-semibold mr-1">{username}</span>
                  <span>{caption}</span>
                </div>
                
                {/* Comments */}
                {showComments && (
                  <div className={`text-sm mb-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    View all {commentsCount} comments
                  </div>
                )}

                {/* Time */}
                <div className={`text-[10px] uppercase tracking-wide mt-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  {time}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
