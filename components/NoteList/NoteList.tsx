import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { type Note } from '../../types/note';
import { deleteNote } from '@/lib/api'; 
import css from './NoteList.module.css';
import Link from 'next/link';

interface NoteListProps {
    notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            toast.success('Note deleted!');
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Deletion failed';
            toast.error(message);
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <ul className={css.list}>
            {notes.map(note => (
                <li key={note.id} className={css.listItem}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
                    <div className={css.footer}>
                        <Link href={`/notes/${note.id}`} className={css.detailsLink}> 
                            View details
                        </Link>
                        <span className={css.tag}>{note.tag}</span>
                        <button 
                            className={css.button} 
                            onClick={() => handleDelete(note.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default NoteList;