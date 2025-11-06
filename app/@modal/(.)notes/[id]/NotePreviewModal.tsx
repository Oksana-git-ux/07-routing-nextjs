'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import NotePreview from './NotePreview.client';

interface NotePreviewModalProps {
  noteId: string;
}

export default function NotePreviewModal({ noteId }: NotePreviewModalProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <NotePreview noteId={noteId} />
    </Modal>
  );
}