import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import NotesClient from '@/app/notes/filter/[...slug]/Notes.client';
import { fetchNotes } from '@/lib/api';
import NotesPageCSS from '@/app/notes/NotesPage.module.css';

interface FilterPageProps {
  params: {
    slug: string[];
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  
  const rawTag = params.slug?.[0] || '';

  const normalizedTag =
    rawTag === 'all' || rawTag.trim() === '' ? '' : rawTag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 0, normalizedTag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        tag: normalizedTag,
        search: '',
      }),
  });

  return (
    <div className={NotesPageCSS.container}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient key={normalizedTag} initialTag={normalizedTag} />
      </HydrationBoundary>
    </div>
  );
}