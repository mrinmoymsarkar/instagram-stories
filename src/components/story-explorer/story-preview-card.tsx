
import Link from 'next/link';
import Image from 'next/image';
import type { Story } from '@/lib/stories';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface StoryPreviewCardProps {
  story: Story;
}

export function StoryPreviewCard({ story }: StoryPreviewCardProps) {
  return (
    <Link href={`/story/${story.id}`} passHref legacyBehavior>
      <Card className="w-60 h-96 hover:shadow-primary/20 hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex flex-col overflow-hidden bg-card hover:border-accent">
        <CardHeader className="p-0">
          <div className="relative w-full h-64">
            <Image
              src={story.previewImageUrl}
              alt={story.altText}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-t-md"
              data-ai-hint={story.dataAiHint}
              unoptimized={true} // Serve the placeholder image directly
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg leading-tight text-card-foreground">{story.title}</CardTitle>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <p className="text-xs text-muted-foreground">Click to view</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
