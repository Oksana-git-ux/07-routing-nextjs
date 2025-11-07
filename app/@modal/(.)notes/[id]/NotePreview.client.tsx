'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import { Note } from '@/types/note';

import css from '@/app/notes/Notes.module.css';

const DynamicErrorMessage = dynamic(
  () => import('@/components/ErrorMessage/ErrorMessage'),
  { ssr: false }
);
const DynamicLoader = dynamic(() => import('@/components/Loader/Loader'), {
  ssr: false,
});

interface NotePreviewClientProps {
  noteId: string;
}

const NotePreviewClient: React.FC<NotePreviewClientProps> = ({ noteId }) => {
  const router = useRouter();

  const {
    data: note,
    isError,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Modal onClose={handleClose}>
      <div className={css.notePreviewWrapper}>
        {isLoading && <DynamicLoader />}

        {isError && (
          <DynamicErrorMessage
            message={error instanceof Error ? error.message : 'Error loading note.'}
          />
        )}

        {note && (
          <article className={css.noteContent}>
            <h1 className={css.noteTitle}>{note.title}</h1>
            <div className={css.noteMeta}>
              <span className={css.noteTag}>Тег: #{note.tag}</span>
              <span className={css.noteDate}>
                Created by: {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className={css.noteBody}>{note.content}</p>
          </article>
        )}
      </div>
    </Modal>
  );
};

export default NotePreviewClient;