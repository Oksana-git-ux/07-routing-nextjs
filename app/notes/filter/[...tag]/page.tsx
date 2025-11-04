import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api'; 
import NotesClient from '../../Notes.client'; // 
import { type Note } from '@/types/note';

interface FilteredNotesPageProps {
  params: {
    tag: string[]; 
  };
}

const PER_PAGE = 12;

export default async function FilteredNotesPage({ params }: FilteredNotesPageProps) {
  const tagParam = params.tag?.[0] || 'all';

  const filterTag = tagParam === 'all' ? '' : tagParam; 
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, filterTag],
    queryFn: () => fetchNotes({ page: 1, perPage: PER_PAGE, search: filterTag }),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient /> 
    </HydrationBoundary>
  );
}
