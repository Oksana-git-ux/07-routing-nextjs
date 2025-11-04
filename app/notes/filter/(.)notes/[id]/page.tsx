import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api'; 
import NotePreview from '@/components/NotePreview/NotePreview';
import Modal from '@/components/Modal/Modal';
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

'use client';
import { useQuery } from '@tanstack/react-query';
import Modal from '../Modal/Modal'; 
import { useRouter } from 'next/navigation';


const NotePreview = ({ noteId }: { noteId: string }) => {
    const router = useRouter();
    
    const handleClose = () => {
        router.back(); 
    };

    return (
        <Modal onClose={handleClose}>
        </Modal>
    );
};
*/
