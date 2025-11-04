'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { fetchNoteById } from '@/lib/api'; 
import { type Note } from '@/types/note';
import Modal from '@/components/Modal/Modal';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

import css from './NotePreview.module.css';

interface NotePreviewProps {
    noteId: string;
}

const NotePreview: React.FC<NotePreviewProps> = ({ noteId }) => {
    const router = useRouter();

    const { data: note, isLoading, isError, error } = useQuery<Note>({
        queryKey: ['note', noteId], 
        queryFn: () => fetchNoteById(noteId),
        refetchOnMount: false,
    });

    const handleClose = () => {
        router.back(); 
    };
    
    let content;

    if (isLoading) {
        content = <Loader message="Loading note details..." />;
    } else if (isError) {
        content = (
            <ErrorMessage message={`Failed to load note details: ${error instanceof Error ? error.message : 'Unknown error'}`} />
        );
    } else if (!note) {
        content = <p className={css.notFound}>Note not found or deleted.</p>;
    } else {
        content = (
            <div className={css.noteContent}>
                <h3 className={css.title}>{note.title}</h3>
                <p className={css.content}>{note.content}</p>
                <p className={css.date}>Created: {new Date(note.createdAt).toLocaleDateString()}</p>
            </div>
        );
    }

    return (
        <Modal onClose={handleClose}>
            <div className={css.container}>
                <button className={css.closeButton} onClick={handleClose} aria-label="Close modal">
                    &times;
                </button>
                {content}
            </div>
        </Modal>
    );
};

export default NotePreview;
