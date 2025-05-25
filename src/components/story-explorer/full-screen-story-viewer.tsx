"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Story } from '@/lib/stories';
import { getNextStoryId, getPreviousStoryId } from '@/lib/stories';
import { ChevronLeft, ChevronRight, X as XIcon, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FullScreenStoryViewerProps {
  currentStory: Story;
  allStories: Story[];
}

export function FullScreenStoryViewer({ currentStory, allStories }: FullScreenStoryViewerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now()); // Used to force re-render/animation

  const currentIndex = useMemo(() => allStories.findIndex(s => s.id === currentStory.id), [allStories, currentStory.id]);
  const totalStories = allStories.length;

  const navigateToStory = useCallback((storyId: string | null) => {
    if (storyId) {
      setIsLoading(true);
      setIsError(false);
      setImageKey(Date.now()); // Change key to trigger animation
      router.push(`/story/${storyId}`);
    }
  }, [router]);

  const handlePrevious = useCallback(async () => {
    const prevStoryId = await getPreviousStoryId(currentStory.id);
    if (prevStoryId) {
      navigateToStory(prevStoryId);
    }
  }, [currentStory.id, navigateToStory]);

  const handleNext = useCallback(async () => {
    const nextStoryId = await getNextStoryId(currentStory.id);
    if (nextStoryId) {
      navigateToStory(nextStoryId);
    }
  }, [currentStory.id, navigateToStory]);

  useEffect(() => {
    // Reset loading/error states when story changes (via props)
    setIsLoading(true);
    setIsError(false);
  }, [currentStory.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentStory.id, handleNext]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') handlePrevious();
      else if (event.key === 'ArrowRight') handleNext();
      else if (event.key === 'Escape') router.push('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevious, handleNext, router]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onTouchStart={() => setShowControls(true)} // For touch devices
      key={imageKey} // This key combined with animate-fadeIn should give a transition
    >
      <div className="absolute inset-0 animate-fadeIn">
        {/* Close Button */}
        <Link href="/" passHref legacyBehavior>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-[60] text-foreground hover:text-accent-foreground hover:bg-accent rounded-full p-2"
            aria-label="Close story viewer"
          >
            <XIcon size={28} />
          </Button>
        </Link>

        {/* Image Display Area */}
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-[55]">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
          )}
          {isError && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-background z-[55]">
              <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
              <p className="text-xl font-semibold text-foreground">Oops! Image Error</p>
              <p className="text-muted-foreground mb-6">The story image could not be loaded.</p>
              <Button onClick={handleNext} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                Try Next Story <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          {!isError && ( // Render image container even if loading to allow smooth opacity transition
            <div className="w-full h-full"> {/* Removed opacity transition from this wrapper div */}
              <Image
                src={currentStory.imageUrl}
                alt={currentStory.altText}
                fill
                style={{ objectFit: 'contain' }}
                priority={true}
                onLoad={() => { setIsLoading(false); setIsError(false); }}
                onError={() => { setIsLoading(false); setIsError(true); }}
                className="opacity-0 data-[loaded=true]:opacity-100 transition-opacity duration-500" // Custom fade for image itself
                data-loaded={!isLoading && !isError}
                data-ai-hint={currentStory.dataAiHint}
              />
            </div>
          )}
        </div>

        {/* Navigation Controls (always present for looping) */}
        <button
          onClick={handlePrevious}
          aria-label="Previous story"
          className={`absolute left-0 top-0 h-full w-1/4 md:w-1/6 flex items-center justify-start p-2 md:p-4 z-[58] transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 focus:opacity-100'}`}
        >
          <ChevronLeft 
            size={40} 
            className="text-accent bg-background/30 hover:bg-background/60 rounded-full p-1 backdrop-blur-sm" 
          />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next story"
          className={`absolute right-0 top-0 h-full w-1/4 md:w-1/6 flex items-center justify-end p-2 md:p-4 z-[58] transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 focus:opacity-100'}`}
        >
          <ChevronRight 
            size={40} 
            className="text-accent bg-background/30 hover:bg-background/60 rounded-full p-1 backdrop-blur-sm"
          />
        </button>
        
        {/* Story Title & Progress */}
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 p-3 bg-background/50 backdrop-blur-sm rounded-lg text-center z-[58] transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 sm:opacity-100'}`}>
          <p className="text-foreground text-md sm:text-lg font-semibold">{currentStory.title}</p>
          <p className="text-muted-foreground text-xs sm:text-sm">{currentIndex + 1} / {totalStories}</p>
        </div>
      </div>
    </div>
  );
}

// Add this to globals.css or tailwind.config.js if not already using similar animation from shadcn
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.5s ease-in-out;
// }

// For the image itself to fade in after load:
// Add to globals.css
// img[data-loaded="false"] { opacity: 0; }
// img[data-loaded="true"] { opacity: 1; transition: opacity 500ms ease-in-out; }
// This logic is now handled by `className="opacity-0 data-[loaded=true]:opacity-100 transition-opacity duration-500"` on Image.
// Adding img[data-loaded="true"] { opacity: 1; } to globals.css for robustness.
