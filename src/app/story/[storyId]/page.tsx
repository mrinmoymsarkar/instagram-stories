import { FullScreenStoryViewer } from '@/components/story-explorer/full-screen-story-viewer';
import { getStoryById, getStories } from '@/lib/stories';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import type { Story } from '@/lib/stories';

interface StoryPageProps {
  params: {
    storyId: string;
  };
}

export async function generateStaticParams() {
  const stories: Story[] = await getStories();
  return stories.map((story) => ({
    storyId: story.id,
  }));
}

export async function generateMetadata(
  { params: { storyId } }: StoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const story: Story | undefined = await getStoryById(storyId);

  if (!story) {
    return {
      title: 'Story Not Found',
    };
  }

  return {
    title: `${story.title} | Story Explorer`,
    description: `View the story: ${story.altText}`,
  };
}

export default async function StoryPage({ params: { storyId } }: StoryPageProps) {
  const story: Story | undefined = await getStoryById(storyId);
  const allStories: Story[] = await getStories();

  if (!story) {
    notFound();
  }

  return <FullScreenStoryViewer currentStory={story} allStories={allStories} />;
}
