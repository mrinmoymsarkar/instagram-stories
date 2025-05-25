import { notFound } from 'next/navigation';
import { getStoryById, getStories } from '@/lib/stories';
import { FullScreenStoryViewer } from '@/components/story-explorer/full-screen-story-viewer';

export async function generateMetadata({ params }: { params: { storyId: string } }) {
  const story = await getStoryById(params.storyId);
  
  if (!story) {
    return {
      title: 'Story Not Found',
    };
  }

  return {
    title: story.title,
  };
}

export default async function StoryPage({ params }: { params: { storyId: string } }) {
  const story = await getStoryById(params.storyId);
  const allStories = await getStories();
  
  if (!story) {
    notFound();
  }

  return (
    <div className="relative w-full h-screen">
      <FullScreenStoryViewer currentStory={story} allStories={allStories} />
    </div>
  );
} 