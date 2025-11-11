'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteNote } from '@/lib/api';
import type { Note } from '@/types/note';

import Modal from '../Modal/Modal';
import NotePreview from '@/app/@modal/(.)notes/[id]/NotePreview.client';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [noteToView, setNoteToView] = useState<Note | null>(null); // для модалки перегляду
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      toast.success('Note deleted!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setNoteToDelete(null);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Deletion failed';
      toast.error(message);
    },
  });

  const confirmDelete = () => {
    if (noteToDelete) deleteMutation.mutate(noteToDelete.id);
  };

  const cancelDelete = () => setNoteToDelete(null);
  const closePreview = () => setNoteToView(null);

  return (
    <>
      <ul className={css.list}>
        {notes.map((note) => (
          <li key={note.id} className={css.listItem}>
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.content}>{note.content}</p>

            <div className={css.footer}>
              {note.tag && <span className={css.tag}>{note.tag}</span>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={css.link}
                  onClick={() => setNoteToView(note)} // відкриваємо модалку
                >
                  View
                </button>
                <button
                  className={css.button}
                  onClick={() => setNoteToDelete(note)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && noteToDelete?.id === note.id
                    ? 'Deleting...'
                    : 'Delete'}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Модалка видалення */}
      {noteToDelete && (
        <Modal onClose={cancelDelete}>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Note</h3>
            <p>Are you sure you want to delete this note?</p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              <button
                className={css.button}
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
              <button className={css.link} onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Модалка перегляду */}
      {noteToView && (
        <Modal onClose={closePreview}>
          <NotePreview id={noteToView.id} />
        </Modal>
      )}
    </>
  );
};

export default NoteList;
