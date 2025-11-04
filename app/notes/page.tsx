import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from '../notes/Notes.client';

const PER_PAGE = 12;
const INITIAL_PAGE = 1;

export default async function NotesPage() {
  const queryClient = new QueryClient();
  const search = '';

  await queryClient.prefetchQuery({
    queryKey: ['notes', INITIAL_PAGE, search],
    queryFn: () => fetchNotes({
      page: INITIAL_PAGE,
      perPage: PER_PAGE,
      search: search
    }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}