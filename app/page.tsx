import { StoryList } from '@/components/story-explorer/story-list';
import { getStories } from '@/lib/stories';
import { Separator } from '@/components/ui/separator';

export default async function HomePage() {
  const stories = await getStories(15);

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Story Explorer</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Tap a story to begin your visual journey.
        </p>
      </header>
      <Separator className="my-6 bg-border" />
      <StoryList stories={stories} />
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Navigate stories by tapping left/right edges or using arrow keys. Stories advance automatically every 5 seconds.</p>
        <p>&copy; {new Date().getFullYear()} Story Explorer. All rights reserved.</p>
      </footer>
    </main>
  );
} 