import React, { useState } from 'react';

export function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  className,
  imageClassName = "w-full h-full object-contain"
}: { 
  beforeImage: string; 
  afterImage: string; 
  className?: string;
  imageClassName?: string;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className={`relative select-none group bg-zinc-100 dark:bg-zinc-800/50 ${className || 'w-full aspect-video rounded-lg overflow-hidden'}`}>
      {/* After Image (Background) */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgBxV1j4zh6mBZYRx0wGgQjGTAaBCMZMBqEIxkwGgQjGTAaBCMZAAASZg8w2vX94QAAAABJRU5ErkJggg==')]">
        <img src={afterImage} alt="After" className={imageClassName} />
      </div>
      
      {/* Before Image (Foreground, clipped) */}
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/50"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img src={beforeImage} alt="Before" className={imageClassName} />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_4px_rgba(0,0,0,0.5)]"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-zinc-200">
          <div className="flex space-x-1">
            <div className="w-0.5 h-3 bg-zinc-400 rounded-full"></div>
            <div className="w-0.5 h-3 bg-zinc-400 rounded-full"></div>
            <div className="w-0.5 h-3 bg-zinc-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Invisible Range Input for Interaction */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize m-0 p-0"
      />

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/60 text-white px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-md pointer-events-none transition-opacity opacity-0 group-hover:opacity-100">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-black/60 text-white px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-md pointer-events-none transition-opacity opacity-0 group-hover:opacity-100">
        After
      </div>
    </div>
  );
}
