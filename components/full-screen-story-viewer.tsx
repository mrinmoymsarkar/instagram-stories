import Image from 'next/image';
import { Story } from '@/lib/stories';

interface FullScreenStoryViewerProps {
  story: Story;
}

export default function FullScreenStoryViewer({ story }: FullScreenStoryViewerProps) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={story.imageUrl}
        alt={story.altText}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <h1 className="text-white text-2xl font-bold">{story.title}</h1>
      </div>
    </div>
  );
} 