'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api'; // використовуємо ваш API
import { Note } from '@/types/note';
import css from '@/components/NotePreview/NotePreview.module.css';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const { data: note, isLoading, isError, error } = useQuery<Note>({
    queryKey: ['note-preview', id],
    queryFn: async () => {
      console.log('Fetching note preview with id:', id); // дебаг
      return fetchNoteById(id);
    },
    enabled: !!id, // виконуємо запит тільки якщо id існує
    refetchOnMount: false,
  });

  if (!id) return <p>Note ID is required.</p>;
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <ErrorMessage message={`Failed to load note preview: ${error?.message}`} />;
  if (!note) return <p>Note not found.</p>;

  return (
    <div className={css.container}>
      <h3 className={css.title}>{note.title}</h3>
      <p className={css.content}>{note.content}</p>
    </div>
  );
}