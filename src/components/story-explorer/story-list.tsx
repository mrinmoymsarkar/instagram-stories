import type { Story } from '@/lib/stories';
import { StoryPreviewCard } from './story-preview-card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface StoryListProps {
  stories: Story[];
}

export function StoryList({ stories }: StoryListProps) {
  if (!stories || stories.length === 0) {
    return <p className="text-center text-muted-foreground">No stories available at the moment.</p>;
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border border-border shadow-lg">
      <div className="flex w-max space-x-4 p-4">
        {stories.map(story => (
          <StoryPreviewCard key={story.id} story={story} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
