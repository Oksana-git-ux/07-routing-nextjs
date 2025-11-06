import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NotePreviewClient from './(.)notes/[id]/NotePreview.client';
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
      <NotePreviewClient noteId={noteId} />
    </HydrationBoundary>
  );
}