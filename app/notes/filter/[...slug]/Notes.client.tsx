'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import Modal from '@/components/Modal/Modal';
import css from '@/app/notes/Notes.module.css';

const NotePreviewComponent = dynamic(
  () => import('@/components/NotePreview/NotePreview'),
  { ssr: false }
);

const NotePreviewClient: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.notePreviewWrapper}>
        <NotePreviewComponent noteId={id} />
      </div>
    </Modal>
  );
};

export default NotePreviewClient;