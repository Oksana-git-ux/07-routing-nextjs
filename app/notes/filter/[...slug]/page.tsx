import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import NotesClient from '@/app/notes/filter/[...slug]/Notes.client';
import { fetchNotes } from '@/lib/api';
import NotesPageCSS from '@/app/notes/NotesPage.module.css';

interface FilterPageProps {
  params: { slug: string[] } | Promise<{ slug: string[] }>;
}

export default async function FilterPage({ params }: FilterPageProps) {
  
  const resolvedParams = await Promise.resolve(params);

  const rawTag = resolvedParams.slug?.[0] || '';

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
        <NotesClient key={normalizedTag} initialSearch={normalizedTag} />
      </HydrationBoundary>
    </div>
  );
}