import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, MoreHorizontal, X, Camera, MapPin } from 'lucide-react';
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

const ShareIcon = ({ className }: { className?: string }) => (
  <svg aria-label="Share Post" className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="22" x2="9.218" y1="3" y2="10.083" strokeLinejoin="round" />
    <polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" strokeLinejoin="round" />
  </svg>
);

export function InstagramStoryGenerator() {
  const [username, setUsername] = useState('username');
  const [time, setTime] = useState('2h');
  const [isVerified, setIsVerified] = useState(false);
  const [storyCount, setStoryCount] = useState(3);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(1);
  const [location, setLocation] = useState('');
  
  // Story Text Parameters
  const [storyText, setStoryText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textBgColor, setTextBgColor] = useState('transparent');
  const [textSize, setTextSize] = useState(24);
  const [textYPos, setTextYPos] = useState(50); // percentage from top
  
  const [avatarUrl, setAvatarUrl] = useState('https://picsum.photos/seed/avatar/100/100');
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/seed/story/1080/1920');
  
  // Animation options
  const [showFloatingLikes, setShowFloatingLikes] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [commenterName, setCommenterName] = useState('friend_user');
  const [commentText, setCommentText] = useState('😍😍😍');
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number; delay: number; scale: number }[]>([]);

  useEffect(() => {
    if (showFloatingLikes) {
      // Generate some random hearts for the animation
      const hearts = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        left: 70 + Math.random() * 20, // Between 70% and 90% from left
        delay: Math.random() * 2, // Random delay up to 2s
        scale: 0.6 + Math.random() * 0.6, // Random scale between 0.6 and 1.2
      }));
      setFloatingHearts(hearts);
    } else {
      setFloatingHearts([]);
    }
  }, [showFloatingLikes]);
  
  const storyRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setter(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadStory = async () => {
    if (!storyRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(storyRef.current, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'instagram-story.png';
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
            <h1 className="text-3xl font-bold tracking-tight">Instagram Story Generator</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Create fake Instagram stories for jokes and memes.</p>
          </div>
          <Button onClick={downloadStory} className="bg-pink-600 hover:bg-pink-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Story
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Story Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time (e.g., 2h, 15m)</label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="verified" 
                  checked={isVerified} 
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="rounded border-zinc-300 text-pink-600 focus:ring-pink-600"
                />
                <label htmlFor="verified" className="text-sm font-medium">Verified Badge</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Stories</label>
                  <input 
                    type="number" 
                    min="1"
                    max="20"
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={storyCount}
                    onChange={(e) => setStoryCount(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Story Index</label>
                  <input 
                    type="number" 
                    min="1"
                    max={storyCount}
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={currentStoryIndex}
                    onChange={(e) => setCurrentStoryIndex(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location Sticker (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g., Paris, France"
                  className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-medium">Animations & Interactions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="floatingLikes" 
                      checked={showFloatingLikes} 
                      onChange={(e) => setShowFloatingLikes(e.target.checked)}
                      className="rounded border-zinc-300 text-red-500 focus:ring-red-500"
                    />
                    <label htmlFor="floatingLikes" className="text-sm font-medium">Floating Likes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="commentPopup" 
                      checked={showCommentPopup} 
                      onChange={(e) => setShowCommentPopup(e.target.checked)}
                      className="rounded border-zinc-300 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="commentPopup" className="text-sm font-medium">Comment Popup</label>
                  </div>
                </div>

                {showCommentPopup && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500">Commenter Username</label>
                      <input 
                        type="text" 
                        className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                        value={commenterName}
                        onChange={(e) => setCommenterName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500">Comment Text</label>
                      <input 
                        type="text" 
                        className="flex h-9 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-medium">Story Text Overlay</h3>
                <div className="space-y-2">
                  <textarea 
                    placeholder="Add text to your story..."
                    className="flex min-h-[80px] w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:focus:ring-zinc-600"
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500">Text Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex h-8 flex-1 rounded-md border border-zinc-300 bg-transparent px-2 text-xs focus:outline-none dark:border-zinc-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500">Background Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={textBgColor === 'transparent' ? '#000000' : textBgColor}
                        onChange={(e) => setTextBgColor(e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer"
                      />
                      <select 
                        className="flex h-8 flex-1 rounded-md border border-zinc-300 bg-transparent px-2 text-xs focus:outline-none dark:border-zinc-700"
                        value={textBgColor === 'transparent' ? 'transparent' : 'custom'}
                        onChange={(e) => setTextBgColor(e.target.value === 'transparent' ? 'transparent' : '#000000')}
                      >
                        <option value="transparent">Transparent</option>
                        <option value="custom">Custom Color</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500">Text Size ({textSize}px)</label>
                    <input 
                      type="range" 
                      min="12" max="72" 
                      value={textSize}
                      onChange={(e) => setTextSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500">Vertical Position ({textYPos}%)</label>
                    <input 
                      type="range" 
                      min="10" max="90" 
                      value={textYPos}
                      onChange={(e) => setTextYPos(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profile Picture</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="flex w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm file:font-medium hover:file:bg-zinc-200 dark:border-zinc-700 dark:file:bg-zinc-800 dark:file:text-zinc-400 dark:hover:file:bg-zinc-700"
                    onChange={(e) => handleImageUpload(e, setAvatarUrl)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Story Background Image</label>
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
            {/* Instagram Story Preview */}
            <div 
              ref={storyRef}
              className="w-[320px] h-[568px] relative bg-black rounded-lg overflow-hidden text-white font-sans shadow-xl"
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
            >
              {/* Background Image */}
              <img 
                src={imageUrl} 
                alt="Story" 
                className="absolute inset-0 w-full h-full object-cover" 
                crossOrigin="anonymous" 
              />
              
              {/* Gradient overlay for top text */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

              {/* Progress Bar */}
              <div className="absolute top-3 left-2 right-2 flex gap-1 z-20">
                {Array.from({ length: Math.max(1, storyCount) }).map((_, i) => (
                  <div key={i} className="h-0.5 bg-white/30 flex-1 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full" 
                      style={{ 
                        width: i + 1 < currentStoryIndex ? '100%' : i + 1 === currentStoryIndex ? '60%' : '0%' 
                      }} 
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-6 left-0 right-0 p-3 flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-white/20" crossOrigin="anonymous" />
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] font-semibold drop-shadow-md">{username}</span>
                    {isVerified && <VerifiedBadge className="w-3.5 h-3.5 text-white drop-shadow-md" />}
                    <span className="text-[13px] text-white/80 drop-shadow-md ml-1">{time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MoreHorizontal className="w-5 h-5 drop-shadow-md" />
                  <X className="w-6 h-6 drop-shadow-md" />
                </div>
              </div>

              {/* Location Sticker */}
              {location && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-white/90 backdrop-blur-sm text-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg transform -rotate-2">
                    <MapPin className="w-4 h-4 text-pink-600" />
                    <span className="text-sm font-bold tracking-tight">{location}</span>
                  </div>
                </div>
              )}

              {/* Custom Text Overlay */}
              {storyText && (
                <div 
                  className="absolute left-4 right-4 z-20 text-center whitespace-pre-wrap break-words"
                  style={{ 
                    top: `${textYPos}%`, 
                    transform: 'translateY(-50%)'
                  }}
                >
                  <span 
                    className="px-3 py-1 rounded-md font-bold leading-relaxed"
                    style={{ 
                      color: textColor, 
                      backgroundColor: textBgColor,
                      fontSize: `${textSize}px`,
                      boxShadow: textBgColor === 'transparent' ? '0 2px 10px rgba(0,0,0,0.3)' : 'none',
                      textShadow: textBgColor === 'transparent' ? '0 1px 3px rgba(0,0,0,0.8)' : 'none'
                    }}
                  >
                    {storyText}
                  </span>
                </div>
              )}

              {/* Floating Likes Animation */}
              {showFloatingLikes && floatingHearts.map((heart) => (
                <div 
                  key={heart.id}
                  className="absolute bottom-16 z-30 animate-float-up opacity-0"
                  style={{
                    left: `${heart.left}%`,
                    animationDelay: `${heart.delay}s`,
                    animationDuration: '2.5s',
                    animationIterationCount: 'infinite',
                    transform: `scale(${heart.scale})`
                  }}
                >
                  <HeartIcon className="w-8 h-8 text-red-500" filled={true} />
                </div>
              ))}

              {/* Comment Popup */}
              {showCommentPopup && (
                <div className="absolute bottom-20 left-4 right-4 z-30 animate-slide-up">
                  <div className="bg-black/70 backdrop-blur-md text-white p-3 rounded-xl flex items-start gap-3 shadow-lg">
                    <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-white/20" crossOrigin="anonymous" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold mr-1">{commenterName}</span>
                        <span>{commentText}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4 z-20 bg-gradient-to-t from-black/60 to-transparent pt-12">
                <div className="flex-1 h-11 rounded-full border border-white/50 flex items-center px-4 backdrop-blur-sm">
                  <span className="text-sm text-white/90">Send message</span>
                </div>
                <HeartIcon className="w-6 h-6 drop-shadow-md text-white" />
                <ShareIcon className="w-6 h-6 drop-shadow-md text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
