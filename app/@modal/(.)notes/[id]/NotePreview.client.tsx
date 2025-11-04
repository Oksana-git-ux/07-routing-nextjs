'use client';

import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal'; 
import { useRouter } from 'next/navigation';
import { fetchNoteById, type Note } from '@/lib/api'; 
import NotePreviewComponent from '@/components/NotePreview/NotePreview';

interface NotePreviewClientProps {
    noteId: string;
}

const NotePreviewClient: React.FC<NotePreviewClientProps> = ({ noteId }) => {
    const router = useRouter();

    const handleClose = () => {
        router.back(); 
    };
   
    return (
        <Modal onClose={handleClose}>
            <NotePreviewComponent noteId={noteId} /> 
        </Modal>
    );
};

export default NotePreviewClient;
