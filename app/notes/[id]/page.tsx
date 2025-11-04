import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

interface NoteDetailsPageProps {
  params: Promise<{
    id: string;
  }> | { id: string };
}

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const resolvedParams = await params;
  const noteId = resolvedParams.id;

 if (!noteId) {
    return <div>Note ID is missing.</div>;
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={noteId} /> 
    </HydrationBoundary>
  );
}