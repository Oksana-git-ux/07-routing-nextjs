'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api'; 
import { Note } from '@/types/note';

import css from './NoteDetails.module.css'; 
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

interface NoteDetailsClientProps {
    noteId: string;
}

const NoteDetailsClient: React.FC<NoteDetailsClientProps> = ({ noteId }) => {
    const { data: note, isLoading, isError, error } = useQuery<Note>({
        queryKey: ['note', noteId], 
        queryFn: () => fetchNoteById(noteId),
        refetchOnMount: false,
    });

    if (isLoading) {
        return <p>Loading, please wait...</p>;
    }

    if (isError) {
        return (
             <ErrorMessage message={`Failed to load note details: ${error.message}`} />
        );
    }

    if (!note) {
        return <p>Something went wrong. Note not found.</p>;
    }

    return (
        <div className={css.container}>
            <div className={css.item}>
                <div className={css.header}>
                    <h2>{note.title}</h2>
                </div>
                <p className={css.content}>{note.content}</p>
                <p className={css.date}>Created: {new Date(note.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default NoteDetailsClient;