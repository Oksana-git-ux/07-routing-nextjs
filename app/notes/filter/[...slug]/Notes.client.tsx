'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';

import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from '@/app/notes/Notes.module.css';

const DynamicErrorMessage = dynamic(
  () => import('@/components/ErrorMessage/ErrorMessage'),
  { ssr: false }
);

const DynamicLoader = dynamic(() => import('@/components/Loader/Loader'), {
  ssr: false,
});

const NotePreviewComponent = dynamic(
  () => import('@/components/NotePreview/NotePreview'),
  { ssr: false }
);

interface NotePreviewClientProps {
  id: string;
}

const NotePreviewClient: React.FC<NotePreviewClientProps> = ({ id }) => {
  const {
    data: note,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: async ({ queryKey }) => {
      const noteId = queryKey[1] as string;
      return fetchNoteById(noteId);
    },
    staleTime: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    if (isError) {
      const message =
        error instanceof Error ? error.message : 'Failed to load note.';
      toast.error(`Error loading note: ${message}`);
    }
  }, [isError, error]);

  return (
    <Modal onClose={() => window.history.back()}>
      <div className={css.notePreviewWrapper}>
        {isLoading && <DynamicLoader />}

        {isError && (
          <DynamicErrorMessage
            message={
              error instanceof Error ? error.message : 'Error loading note.'
            }
          />
        )}

        {note && <NotePreviewComponent noteId={id} />}
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </Modal>
  );
};

export default NotePreviewClient;