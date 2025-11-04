import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api'; 
import NotePreview from '@/components/NotePreview/NotePreview';
import { redirect } from 'next/navigation';

interface InterceptedNotePageProps {
  params: {
    id: string;
  };
}

export default async function InterceptedNotePage({ params }: InterceptedNotePageProps) {
  const noteId = params.id;
  
  if (!noteId) {
    redirect('/notes/filter/all'); 
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', noteId], 
    queryFn: () => fetchNoteById(noteId),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview noteId={noteId} /> 
    </HydrationBoundary>
  );
}
