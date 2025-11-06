'use client';

import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import { type Note } from '@/types/note';
import NotePreviewComponent from '@/components/NotePreview/NotePreview';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

interface NotePreviewClientProps {
  noteId: string;
}

const NotePreviewClient: React.FC<NotePreviewClientProps> = ({ noteId }) => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const { data: note, isLoading, isError, error } = useQuery<Note>({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={handleClose}>
      {isLoading && <Loader />}
      {isError && (
        <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load note.'} />
      )}
      {note && <NotePreviewComponent note={note} />}
    </Modal>
  );
};

export default NotePreviewClient;