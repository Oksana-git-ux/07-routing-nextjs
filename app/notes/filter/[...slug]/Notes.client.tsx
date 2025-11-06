'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import Modal from '@/components/Modal/Modal';
import css from '@/app/notes/Notes.module.css';

const NotePreviewComponent = dynamic(
  () => import('@/components/NotePreview/NotePreview'),
  { ssr: false }
);

const NotePreviewClient: React.FC<{ noteId: string }> = ({ noteId }) => {
  const router = useRouter();
  
  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Modal onClose={handleClose}>
      <div className={css.notePreviewWrapper}>
        <NotePreviewComponent noteId={noteId} />
      </div>
    </Modal>
  );
};

export default NotePreviewClient;