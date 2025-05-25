export interface Story {
  id: string;
  title: string;
  imageUrl: string;
  previewImageUrl: string;
  altText: string;
  dataAiHint?: string;
}

interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

// Keep a local cache to avoid hitting the API too often if not strictly necessary
// and to ensure getNext/getPrevious work on a consistent set of data for a session.
let cachedStories: Story[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getStories(limit: number = 10): Promise<Story[]> {
  const currentTime = Date.now();
  if (cachedStories && (currentTime - lastFetchTime < CACHE_DURATION)) {
    return cachedStories;
  }

  try {
    const response = await fetch(`https://picsum.photos/v2/list?limit=${limit}`);
    if (!response.ok) {
      console.error("Failed to fetch stories from Picsum API", response.status);
      return cachedStories || []; // Return old cache or empty if fetch fails
    }
    const picsumImages: PicsumImage[] = await response.json();
    
    cachedStories = picsumImages.map((image) => ({
      id: image.id,
      title: `Photo by ${image.author}`,
      imageUrl: `https://picsum.photos/id/${image.id}/1080/1080`,
      previewImageUrl: `https://picsum.photos/id/${image.id}/200/200`,
      altText: `Photograph by ${image.author}, dimensions: ${image.width}x${image.height}`,
      dataAiHint: image.author, 
    }));
    lastFetchTime = currentTime;
    return cachedStories;
  } catch (error) {
    console.error("Error fetching or processing stories:", error);
    return cachedStories || []; // Return old cache or empty on error
  }
}

export async function getStoryById(id: string): Promise<Story | undefined> {
  // Ensure stories are fetched and cached if not already
  const stories = await getStories(); 
  return stories.find(story => story.id === id);
}

export async function getNextStoryId(currentId: string): Promise<string | null> {
  const stories = await getStories();
  if (!stories || stories.length === 0) return null;
  const currentIndex = stories.findIndex(story => story.id === currentId);
  if (currentIndex === -1) return null;
  const nextIndex = (currentIndex + 1) % stories.length;
  return stories[nextIndex].id;
}

export async function getPreviousStoryId(currentId: string): Promise<string | null> {
  const stories = await getStories();
  if (!stories || stories.length === 0) return null;
  const currentIndex = stories.findIndex(story => story.id === currentId);
  if (currentIndex === -1) return null;
  const prevIndex = (currentIndex - 1 + stories.length) % stories.length;
  return stories[prevIndex].id;
}
